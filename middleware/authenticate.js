const jwt = require('jsonwebtoken')

const authenticateLogin = async (req, res, next) => {
    try {
        jwt.verify(req.query.token, process.env.SECRET_KEY, (err, authData) => {
            if (err) {
                res.status(401).json({ "message": "Unauthorized Token", "status": "error" })
            } else {
                req.authData = authData;
                next();
            }
        });
        next()
    } catch (error) {
        res.status(401).json({ "message": "Unauthorized Token", "status": "error" })
        console.log(error)
    }
}

module.exports = authenticateLogin