const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
            { url: /\/api\/v1\/productQuantities(.*)/, methods: ['GET', 'OPTIONS', 'DELETE'] },
            { url: /\/api\/v1\/test(.*)/, methods: ['GET', 'POST', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`,
            `https://cmstwo.cyclic.app/api/v1/productQuantities/63c705b7f3794300239ca613/63e65e061142c1002c96e8cc`,
        ]
    })
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true)
    }

    done();
}



module.exports = authJwt