const Token = require('../models/token');

function validateToken(token) {
    return new Promise((res, rej) =>{
        Token.findOne({usedToken: token})
             .then(foundToken =>{
                if (foundToken) {
                    res(true)
                } else {
                    res(false)
                }
             })
    })
 }

 module.exports = {validateToken}