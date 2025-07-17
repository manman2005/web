exports.adminCheck = async (req, res, next) => {
    console.log('--- AdminCheck Middleware Triggered ---');
    try {
        // req.user ถูกตั้งค่าโดย auth middleware และมีข้อมูล user รวมถึง role
        const userRole = req.user.role;
        console.log('Checking admin access for user role:', userRole);

        if (userRole !== 'admin') {
            console.log(`Access Denied: User role is '${userRole}', not 'admin'.`);
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