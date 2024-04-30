const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user'); // Reemplaza esta importación con la ubicación de tu modelo de usuario

let secret = process.env.SECRET;

// Configura la estrategia de autenticación JWT
passport.use(new JwtStrategy({
  secretOrKey: secret, // La misma clave secreta utilizada para firmar el token JWT
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // Extrae el token del encabezado de Authorization
}, async (payload, done) => {
  try {
    // Busca el usuario por ID en la base de datos
    const user = await User.findById(payload.id);

    if (!user) {
      return done(null, false); // Usuario no encontrado
    }

    return done(null, user); // Usuario encontrado y autenticado correctamente
  } catch (error) {
    return done(error, false); // Error al buscar el usuario en la base de datos
  }
}));

module.exports = passport;