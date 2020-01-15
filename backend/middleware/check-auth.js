const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        // req.headers.authorization - should be written like this only otherwise it throw an error 
        // note : same header name as provided in interceptor()
        // note : headers are not case snsitive.
        jwt.verify(token, 'my-secret-key');
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Auth failed-check-auth'
        });
    }
}