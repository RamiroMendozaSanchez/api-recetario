const express = require('express');
const multer = require('multer');

const RecipeController = require('../controllers/recipe');
const passport = require('../helpers/passport-config')

const router = express.Router();
const storage = multer.diskStorage({
    destination:function (req, file ,cb) { 
        cb(null,"./images/recipe")
     },
     filename: function (req, file, cb) { 
        cb(null, "recipe"+Date.now()+file.originalname);
      },
});

const recipeImageMdlw = multer({storage:storage})

router.post("/create", passport.authenticate('jwt', {session: false}), [recipeImageMdlw.single("file0")] , RecipeController.createRecipe);
router.get("/list-all", passport.authenticate('jwt', {session: false}), RecipeController.listRecipes);
router.post("/list", passport.authenticate('jwt', {session: false}), RecipeController.listRecipe);
router.delete("/delete/:id", passport.authenticate('jwt', {session: false}), RecipeController.deleteRecipe);
router.put("/edit", passport.authenticate('jwt', {session: false}), RecipeController.editRecipe);
router.post("/image", passport.authenticate('jwt', {session: false}), RecipeController.getRecipeImage);


module.exports = router;