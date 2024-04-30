const {Schema, model} = require("mongoose");

const RecipeSchema = Schema({
    user:{
        type: String,
        require: true
    },
    name:{
        type: String,
        require: true,
    },
    description:{
        type: String,
        require: true,
    },
    category:{
        type: String
    },
    ingredients:[{
        nameIngredient: {
            type: String,
            require: true
        },
        quantity: {
            type: String,
            require: true
        }
    }],
    steps:{
        type: Object,
        require: true
    },
    imageURL:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    }

});

module.exports = model("Recipe", RecipeSchema, "recipes")