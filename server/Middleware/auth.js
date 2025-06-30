const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
    console.log('--- Auth Middleware Triggered ---');
    try {
        const authHeader = req.headers["authorization"];
        console.log('Authorization Header:', authHeader);

        if (!authHeader) {
            return res.status(401).send('No token provided');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).send('Malformed token');
        }

        const decoded = jwt.verify(token, 'jwtsecret');
        console.log('Decoded Token Payload:', decoded);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.log('Error in Auth Middleware:', err);
        res.status(401).send('Token Invalid');
    }
};