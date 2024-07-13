const jwt = require('jsonwebtoken')
 
const authGuard = (req, res, next) => {
    // get header authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.json({
            success : false,
            message : "Authorization header not found!"
        })
    }
    // get token by spiliting the header
    // Format = 'Beaerer token.....'
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.json({
            success:false,
            message: "Token not found!"
        })
    }
    try {
        // verify token
        const decodeUser = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        req.user = decodeUser;
        next();
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message : "Invalid Token"
        })
    }
}
 
module.exports = authGuard;