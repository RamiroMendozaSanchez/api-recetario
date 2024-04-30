const User = require("../models/user");
const Token = require("../models/token");
const logger = require("./logger");
const { validateToken } = require("../helpers/validToken");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const validator = require('validator');
require("dotenv").config();

const createUser = async (req, res) => {
  let parameters = req.body;
  let pass = req.body.password;
  let password;
  let tokenMaster = process.env.ADMIN_SECRET;
  let token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
  const userAgent = req.headers["user-agent"];
  let clientIP = req.ip;

  logger.access.info(`access`, {
    path: req.path,
    ip: clientIP,
    userAgent: userAgent,
  });

  if (token === tokenMaster) {
    bcrypt.hash(pass, 10, (err, hash) => {
      if (err) {
        logger.userMethodError.error(`Error al generar el hash '${err}'`);
        console.error("Error al generar el hash:", err);
        return;
      }
      password = hash;

      const user = new User({ ...parameters, password });

      user
        .save()
        .then((userSave) => {
          if (!userSave) {
            logger.userMethodError.error(
              `Error al guardar el usuario '${userSave.username}'`
            );
            return res.status(404).json({
              status: "error",
              message: "Error al guardar el usuario",
            });
          }
          logger.userMethodInfo.info(
            `Usuario creada con éxito '${userSave.username}'`
          );
          return res.status(200).json({
            status: "success",
            message: "Usuario creada con éxito",
            user: userSave,
          });
        })
        .catch((error) => {
          logger.userMethodError.error(`server error: '${error}'`);
          return res.status(500).json({
            status: "error",
            message: "error" + error,
          });
        });
    });
  } else {
    logger.userSessionError.error(`Tokens Invalidos`);
    res.status(401).json({
      message: "Tokens Invalidos",
    });
  }
};

const listUsers = (req, res) => {
  let clientIP = req.ip;
  let token = req.headers.authorization.split(" ")[1];
  let secret = process.env.SECRET;

  try {
    const decode = jwt.verify(token, secret);
    req.user = decode;
  } catch (error) {
    console.log("Invalido");
  }

  const username = req.user.username;
  const userAgent = req.headers["user-agent"];

  logger.access.info(`access`, {
    path: req.path,
    username: username,
    ip: clientIP,
    userAgent: userAgent,
  });

  validateToken(token).then((tokenExist) => {
    if (tokenExist) {
      logger.userMethodError.error(`Token Invalidado`, {
        status: "Error",
        username: username,
      });
      return res.status(401).json({
        status: "error",
        message: "Token Invalidado",
      });
    }
    User.find({})
      .exec()
      .then((users) => {
        if (users.length == 0) {
          logger.userMethodError.error(`No se han encontrado usuarios`, {
            status: "Error",
            username: username,
          });
          return res.status(404).json({
            status: "error",
            message: "No se han encontrado usuarios",
          });
        }
        logger.userMethodInfo.info(`Listado exitoso`, {
          status: "success",
          username: username,
        });
        return res.status(200).json({
          status: "success",
          count: users.length,
          users: users
        });
      })
      .catch((error) => {
        logger.userMethodError.error({
          status: "Server Error",
          error: error,
          username: username,
        });
        return res.status(500).json({
          status: "error",
          message: "Error: " + error,
        });
      });
  });
};

const editUser = (req, res) => {
  let id = req.body.id;
  //Recoger los parametros por post a guardar
  let parameters = req.body;

  let pass = req.body.password;
  let password;
  const username = req.user.username;
  const userAgent = req.headers["user-agent"];
  let clientIP = req.ip;
  let token = req.headers.authorization.split(" ")[1];
  let secret = process.env.SECRET;

  try {
    const decode = jwt.verify(token, secret);
    req.user = decode;
  } catch (error) {
    console.log("Invalido");
  }

  logger.access.info(`access`, {
    path: req.path,
    username: username,
    ip: clientIP,
    userAgent: userAgent,
  });

  validateToken(token).then((tokenExist) => {
    if (tokenExist) {
      logger.userMethodError.error(`Token Invalidado`, {
        status: "Error",
        username: username,
      });
      return res.status(401).json({
        status: "error",
        message: "Token Invalidado",
      });
    }

    bcrypt.hash(pass, 10, (err, hash) => {
      if (err) {
        logger.userMethodError.error(`Error al generar el hash '${err}'`);
        return;
      }
      password = hash;

      //Guardar el articulo en la base de datos
      User.findOneAndUpdate(
        { _id: id },
        { ...parameters, password },
        { new: true }
      )
        .exec()
        .then((user) => {
          if (!user) {
            logger.userMethodError.error(
              `No se ha encontrado el usuario: '${id}'`,
              { status: "Error", username: username }
            );
            return res.status(404).json({
              status: "error",
              message: "No se ha encontrado el usuario",
            });
          }
          logger.userMethodInfo.info(`Usuario actualizado: '${id}'`, {
            status: "success",
            username: username,
          });
          return res.status(200).json({
            status: "success",
            message: "Usuario actualizada",
            user: user,
          });
        })
        .catch((error) => {
          logger.userMethodError.error({
            status: "Server Error",
            error: error,
            username: username,
          });
          return res.status(500).json({
            status: "500",
            message: "error: [ " + error + " ]",
          });
        });
    });
  });
};

const login = async (req, res) => {
    
let token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
  let tokenMaster = process.env.ADMIN_SECRET;
  let secret = process.env.SECRET;
  const userAgent = req.headers["user-agent"];
  let clientIP = req.ip;

  logger.access.info(`access`, {
    path: req.path,
    ip: clientIP,
    userAgent: userAgent,
  });
  if (token === tokenMaster) {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        logger.userSessionError.error(`Usuario '${username}' no encontrado`);
        return res.status(401).json({
          message: "Usuario no encontrado",
        });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        logger.userSessionError.error(
          `Credenciales inválidas para el usuario '${username}'`
        );
        return res.status(401).json({
          message: "Credenciales inválidas",
        });
      }

      const token = jwt.sign({ id: user._id, name: user.username }, secret, {
        expiresIn: "1h",
      });
      logger.userSessionInfo.info(
        `Inicio de sesión exitoso para el usuario '${username}'`
      );
      res.status(200).json({
        token,
        id: user._id,
      });
    } catch (error) {
      logger.userSessionError.error(
        `Error durante el inicio de sesión para el usuario '${username}': ${error.message}`
      );
      res.status(500).json({
        message: "Error durante el inicio de sesión",
      });
    }
  } else {
    logger.userSessionError.error(`Tokens Invalidos`);
    res.status(401).json({
      message: "Tokens Invalidos",
    });
  }
};

const logout = async (req, res) => {
  let usedToken = req.headers.authorization.split(" ")[1];
  const username = req.user.username;
  const userAgent = req.headers["user-agent"];
  let clientIP = req.ip;
  let secret = process.env.SECRET;

  try {
    const decode = jwt.verify(usedToken, secret);
    req.user = decode;
  } catch (error) {
    console.log("Invalido");
  }

  logger.access.info(`access`, {
    path: req.path,
    username: username,
    ip: clientIP,
    userAgent: userAgent,
  });

  validateToken(usedToken).then((tokenExist) => {
    if (tokenExist) {
      logger.userMethodError.error(`Token Invalidado`, {
        status: "Error",
        username: username,
      });
      return res.status(401).json({
        status: "error",
        message: "Token Invalidado",
      });
    }

    const token = new Token({ usedToken });
    token
      .save()
      .then((tokenSave) => {
        if (!tokenSave) {
          logger.userMethodError.error(
            `Error al guardar el Token '${tokenSave.usedToken}'`
          );
          return res.status(404).json({
            status: "error",
            message: "Error al guardar el token",
          });
        }
        logger.userMethodInfo.info(
          `Token Invalidado con exito '${tokenSave.usedToken}'`
        );
        return res.status(200).json({
          status: "success",
          message: "Token invalidado",
          token: tokenSave,
        });
      })
      .catch((error) => {
        logger.userMethodError.error(`server error: '${error}'`);
        return res.status(500).json({
          status: "error",
          message: "error" + error,
        });
      });
  });
};

module.exports = {
  createUser,
  listUsers,
  editUser,
  login,
  logout,
};
