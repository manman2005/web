const Users = require('../models/Users');

exports.adminCheck = async (req, res, next) => {
    console.log('--- AdminCheck Middleware Triggered ---');
    try {
        const { name } = req.user;
        console.log('Checking admin access for user:', name);

        const adminUser = await Users.findOne({ name }).exec();
        console.log('User found in DB:', adminUser);

        if (adminUser.role !== 'admin') {
            console.log(`Access Denied: User role is '${adminUser.role}', not 'admin'.`);
            res.status(403).send('Admin access denied');
        } else {
            console.log('Access Granted: User is an admin.');
            next();
        }
    } catch (err) {
        console.log('Error in AdminCheck Middleware:', err);
        res.status(401).send('Admin access denied');
    }
};