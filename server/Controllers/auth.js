const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Server-side Validation
        if (!username || !password) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: 'ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' });
        }

        // 1. Check user
        let user = await Users.findOne({ name: username });

        if (user) {
            return res.status(400).json({ message: 'ชื่อผู้ใช้นี้มีอยู่แล้ว' });
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

        res.json({ message: 'ลงทะเบียนสำเร็จ' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Server-side Validation
        if (!username || !password) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
        }

        // ใช้ findOne แทน findOneAndUpdate
        const user = await Users.findOne({ name: username });

        if (!user) {
            return res.status(400).json({ message: 'ไม่พบชื่อผู้ใช้' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
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
        const { name, password, role, address, phone } = req.body;

        let updateData = { name, role, address, phone };

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

exports.getCurrentUser = async (req, res) => {
    try {
        const user = await Users.findOne({ name: req.user.name }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
