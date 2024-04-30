const Recipe = require("../models/recipe");
const logger = require("./logger");
const { validateToken } = require("../helpers/validToken");

const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
let secret = process.env.SECRET;

const createRecipe = async (req, res) => {
  let clientIP = req.ip;
  let parameters = req.body;
  let imageURL = req.file ? req.file.filename : null;
  let token = req.headers.authorization.split(" ")[1];

  try {
    const decode = jwt.verify(token, secret);
    req.user = decode;
  } catch (error) {
    console.log("Invalido");
  }

  const user = req.user.id;
  const username = req.user.username;
  const userAgent = req.headers["user-agent"];

  const recipe = new Recipe({ ...parameters, imageURL, user });

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
    recipe
      .save()
      .then((recipeSave) => {
        if (!recipeSave) {
          logger.recipeMethodError.error(`Error al guardar el lugar`, {
            status: "Error",
            username: username,
          });
          return res.status(404).json({
            status: "error",
            message: "Error al guardar el lugar",
          });
        }
        logger.recipeMethodInfo.info(`Receta creada con éxito`, {
          status: "success",
          username: username,
        });
        return res.status(200).json({
          status: "success",
          message: "Receta creada con éxito",
          recipe: recipeSave,
        });
      })
      .catch((error) => {
        logger.recipeMethodError.error({
          status: "Server Error",
          error: error,
          username: username,
        });
        return res.status(500).json({
          status: "error",
          message: "error" + error,
        });
      });
  });
};

const listRecipes = async (req, res) => {
  let clientIP = req.ip;
  let token = req.headers.authorization.split(" ")[1];

  try {
    const decode = jwt.verify(token, secret);
    req.user = decode;
  } catch (error) {
    console.log("Invalido");
  }

  const userid = req.user.id;
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

    Recipe.find({user: userid})
      .exec()
      .then((recipes) => {
        if (!recipes) {
          logger.recipeMethodError.error(`No se han encontrado recetas`, {
            status: "Error",
            username: username,
          });
          return res.status(404).json({
            status: "error",
            message: "No se han encontrado recetas",
          });
        }
        logger.recipeMethodInfo.info(`Listado exitoso`, {
          status: "success",
          username: username,
        });
        return res.status(200).json({
          status: "success",
          count: recipes.length,
          recipes,
        });
      })
      .catch((error) => {
        logger.recipeMethodError.error({
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

const listRecipe = (req, res) => {
  let id = req.body.id;
  let clientIP = req.ip;
  let token = req.headers.authorization.split(" ")[1];

  try {
    const decode = jwt.verify(token, secret);
    req.user = decode;
  } catch (error) {
    console.log("Invalido");
  }

  const userid = req.user.id;
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

    Recipe.find({ _id: id, user: userid })
      .exec()
      .then((recipe) => {
        if (recipe == 0) {
          logger.recipeMethodError.error(
            `No se ha encontrado la receta: '${id}'`,
            { status: "Error", username: username }
          );
          return res.status(404).json({
            status: "error",
            message: "No se ha encontrado la receta",
          });
        }
        logger.recipeMethodInfo.info(`Se mostro la receta: '${id}'`, {
          status: "success",
          username: username,
        });
        return res.status(200).json({
          status: "success",
          recipe,
        });
      })
      .catch((error) => {
        logger.recipeMethodError.error({
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

const deleteRecipe = (req, res) => {
  let id = req.params.id;
  let clientIP = req.ip;
  let token = req.headers.authorization.split(" ")[1];

  try {
    const decode = jwt.verify(token, secret);
    req.user = decode;
  } catch (error) {
    console.log("Invalido");
  }

  const userid = req.user.id;
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
    Recipe.findOneAndDelete({ _id: id, user: userid})
      .exec()
      .then((recipe) => {
        if (!recipe) {
          logger.recipeMethodError.error(
            `No se ha encontrado la receta: '${id}'`,
            { status: "Error", username: username }
          );
          return res.status(404).json({
            status: "error",
            message: "No se ha encontrado la receta",
          });
        }
        logger.recipeMethodInfo.info(`Receta Eliminada: '${id}'`, {
          status: "success",
          username: username,
        });
        return res.status(200).json({
          status: "success",
          message: "Receta Eliminada",
          recipe,
        });
      })
      .catch((error) => {
        logger.recipeMethodError.error({
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
};

const editRecipe = async (req, res) => {
  let id = req.body.id;
  //Recoger los parametros por post a guardar
  let parameters = req.body;
  let clientIP = req.ip;
  let token = req.headers.authorization.split(" ")[1];

  try {
    const decode = jwt.verify(token, secret);
    req.user = decode;
  } catch (error) {
    console.log("Invalido");
  }

  const userid = req.user.id;
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
    Recipe.findOneAndUpdate({ _id: id, user: userid}, parameters, { new: true })
      .exec()
      .then((recipe) => {
        if (!recipe) {
          logger.recipeMethodError.error(
            `No se ha encontrado la receta: '${id}'`,
            { status: "Error", username: username }
          );
          return res.status(404).json({
            status: "error",
            message: "No se ha encontrado la receta",
          });
        }
        logger.recipeMethodInfo.info(`Receta actualizada: '${id}'`, {
          status: "success",
          username: username,
        });
        return res.status(200).json({
          status: "success",
          message: "Receta actualizada",
          recipe,
        });
      })
      .catch((error) => {
        logger.recipeMethodError.error({
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
};

const getRecipeImage = (req, res) => {
  let file = req.body.file;
  let physical_path = "./images/recipe/" + file;
  let clientIP = req.ip;
  let token = req.headers.authorization.split(" ")[1];

  try {
    const decode = jwt.verify(token, secret);
    req.user = decode;
  } catch (error) {
    console.log("Invalido");
  }

  const user = req.user.id;
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
    fs.stat(physical_path, (error, exis) => {
      if (exis) {
        logger.recipeMethodInfo.info(`Se mostro la imagen: '${file}'`, {
          status: "success",
          username: username,
        });
        return res.sendFile(path.resolve(physical_path));
      } else {
        logger.recipeMethodError.error(`La imagen no existe: '${file}'`, {
          status: "Error",
          username: username,
        });
        return res.status(404).json({
          status: "Error",
          message: "La imagen no existe",
        });
      }
    });
  });
};

module.exports = {
  createRecipe,
  listRecipes,
  listRecipe,
  deleteRecipe,
  editRecipe,
  getRecipeImage,
};
