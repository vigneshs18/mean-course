const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        // req.headers.authorization - should be written like this only otherwise it throw an error 
        // note : same header name as provided in interceptor()
        // note : headers are not case snsitive.
        const decodedToken = jwt.verify(token, 'my-secret-key');
        req.userData = {email: decodedToken.email, userId: decodedToken.id};
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Auth failed-check-auth'
        });
    }
}