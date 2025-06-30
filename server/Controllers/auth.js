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
                name: user.name,
                role: user.role
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

exports.listUsers = async (req, res) => {
    try {
        const users = await Users.find({}).select('-password'); // Exclude password
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, password, role } = req.body;

        let updateData = { name, role };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const user = await Users.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password'); // Exclude password from response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
