const express = require('express');
const multer = require('multer');

const UserController = require('../controllers/user');
const passport = require('../helpers/passport-config')

const router = express.Router();
const storage = multer.diskStorage({
    destination:function (req, file ,cb) { 
        cb(null,"./images/user/")
     },
     filename: function (req, file, cb) { 
        cb(null, "user"+Date.now()+file.originalname);
      },
});

const recipeImageMdlw = multer({storage:storage})

router.post("/create", UserController.createUser);
router.get("/list-all" , passport.authenticate('jwt', {session: false}) , UserController.listUsers);
router.put("/edit" , passport.authenticate('jwt', {session: false}) , UserController.editUser);
router.post("/login", UserController.login);
router.post("/logout", passport.authenticate('jwt', {session: false}), UserController.logout);

module.exports = router;