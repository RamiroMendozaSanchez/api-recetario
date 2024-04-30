const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const fs = require('fs');
const helmet = require('helmet')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const {connection} = require('./database/connection');
const routeRecipe = require('./routes/recipe');
const routeUser = require('./routes/user');

console.log("App de Node Arrancada: " + Date());
connection()

const app = express();
const port = process.env.PORT || 3000;

// Habilitar la confianza en los encabezados de proxy
app.set('trust proxy', true);

const limiter = rateLimit({
    windowMs: 15 * 600 * 1000,
    max: 100
})

app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Recetario Documentación',
            version: '0.0.1',
            description: 'Documentación para recetario',
        },
    },
    apis: ['./documentation/*.yml'], // Rutas donde están definidos los endpoints
};

const specs = swaggerJsdoc(options);
app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/recipe", routeRecipe);
app.use("/api/user", routeUser);


app.listen(port, () =>{
    console.log("Servidor corriendo en el puerto: "+port);
    console.log("http://localhost:"+port);
})