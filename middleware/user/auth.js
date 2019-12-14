const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    // Get header token
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No token, authorization denied'
        });
    }

    // Verify token
    try {
        const decode = jwt.verify(token, config.get('jwtSecrect'));

        req.user = decode.user;
        next();
    } catch (err) {
        return res.status(401).json({
            msg: 'Authorization not valid'
        });
    }

}