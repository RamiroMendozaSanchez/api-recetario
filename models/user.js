const {Schema, model} = require("mongoose");

const UserSchema = Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    name:{
        type: String,
        require: true,
    },
    lastname:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    profileImage:{
        type: String,
        default: 'default.png'
    },
    date:{
        type: Date,
        default: Date.now
    }

});

module.exports = model("User", UserSchema, "users")