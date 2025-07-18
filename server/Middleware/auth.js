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

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded user in auth middleware:', decoded.user); // เพิ่มบรรทัดนี้
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Auth middleware error:', err); // เปลี่ยนข้อความ error
        res.status(401).send('Invalid Token');
    }
};