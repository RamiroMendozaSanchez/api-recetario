const { model } = require('mongoose');
const Recipe = require('../models/recipe');

const checkRecipeOwnership = async (userId) => {
    try {
      // Buscar la imagen en la base de datos
      const recipeOwner = await Recipe.findOne({ user: userId});
      // Si se encuentra la imagen, devuelve true, de lo contrario, false
      return !!recipeOwner;
    } catch (error) {
      console.error("Error al verificar la propiedad de la imagen:", error);
      return false; // Manejar el error de manera adecuada según las necesidades de tu aplicación
    }
  };

  module.exports = {
    checkRecipeOwnership
  }