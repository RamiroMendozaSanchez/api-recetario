const {Schema, model} = require("mongoose");

const TokenSchema= Schema({
    usedToken:{
        type: String,
        require: true,
        unique: true,
    },
    date:{
        type: Date,
        default: Date.now
    }

});

module.exports = model("Token", TokenSchema, "tokens")