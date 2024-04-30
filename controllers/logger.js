const winston = require('winston');

const userSessionError = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.label({label: 'userAuthorization'}),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/user/error.log'}), // Este transporte manejará todos los mensajes, incluidos los de nivel 'info'
    ]
});

const userSessionInfo = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.label({label: 'userAuthorization'}),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/user/info.log'}), // Este transporte manejará todos los mensajes, incluidos los de nivel 'info'
    ]
});

const userMethodError = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.label({label: 'userMethod'}),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/user/error.log'}), // Este transporte manejará todos los mensajes, incluidos los de nivel 'info'
    ]
});

const userMethodInfo = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.label({label: 'userMethod'}),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/user/info.log'}), // Este transporte manejará todos los mensajes, incluidos los de nivel 'info'
    ]
});

const recipeMethodError = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.label({label: 'recipeMethod'}),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/recipe/error.log'}), // Este transporte manejará todos los mensajes, incluidos los de nivel 'info'
    ]
});

const recipeMethodInfo = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.label({label: 'recipeMethod'}),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/recipe/info.log'}), // Este transporte manejará todos los mensajes, incluidos los de nivel 'info'
    ]
});

const access = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.label({label: 'access'}),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/access.log'}), // Este transporte manejará todos los mensajes, incluidos los de nivel 'info'
    ]
});

module.exports = {
    userSessionError,
    userSessionInfo,
    userMethodError,
    userMethodInfo,
    recipeMethodError,
    recipeMethodInfo,
    access
}