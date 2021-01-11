const jwt = require('jsonwebtoken')
module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) throw "Vous n'avez pas acces."
        const token = req.headers.authorization.split(" ")[1]
        const payload = await jwt.verify(token, process.env.JWT_SECRET)        
        req.payload = payload
        next()
    } catch (error) {
        res.status(401).json({
            message: "Vous n'avez pas acces."
        })
    }
}