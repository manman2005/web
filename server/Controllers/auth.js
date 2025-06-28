const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        // 1. Check user
        const { username, password } = req.body;

        let user = await Users.findOne({ name: username });

        if (user) {
            return res.status(400).json({ message: 'User Already Exists!!!' });
        }

        // 2. Encrypt
        const salt = await bcrypt.genSalt(10);

        user = new Users({
            name: username,   
            password
        });

        user.password = await bcrypt.hash(password, salt);

        // 3. Save
        await user.save();

        res.json({ message: 'Register Success' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // ใช้ findOne แทน findOneAndUpdate
        const user = await Users.findOne({ name: username });

        if (!user) {
            return res.status(400).json({ message: 'User not found!!!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Password Invalid!!!' });
        }

        const payload = {
            user: {
                name: user.name
            }
        };

        // Generate JWT
        jwt.sign(payload, 'jwtsecret', { expiresIn: 86400 }, (err, token) => {
            if (err) throw err;
            res.json({ token, payload });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};
