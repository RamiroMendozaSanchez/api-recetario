const mongoose = require('mongoose');
require('dotenv').config();

const connection = async () =>{
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@tradiciondigital.b7gmcv7.mongodb.net/recetario?retryWrites=true&w=majority`)
        console.log("Conexión correcta a la BD recetario");
    } catch (error) {
        console.log(error);
        throw new Error("No es posible establecer la conexión con la BD recetario")
    }
}

module.exports ={
    connection,
}