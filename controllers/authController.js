const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
    try {
        const { nrp, name, email, password, roleId } = req.body;
        const hashedPassword = await bcrypt.hash(password, Number(process.env.PASS_SALT));
        const user = await User.create({ nrp, name, email, password: hashedPassword, roleId });

        res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.login = async (req, res) => {
    try {
        const { nrp, password } = req.body;
        const user = await User.findOne({ where: { nrp } });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { nrp: user.nrp, role: user.roleId },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TOKEN_AGE }
        );

        const refreshToken = jwt.sign(
            { nrp: user.nrp, role: user.roleId },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        user.refreshToken = refreshToken; // You might need to add refreshToken column in your User model and migration
        await user.save();

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    const { nrp, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { nrp } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.PASS_SALT));

        await User.update({ password: hashedPassword }, { where: { nrp } });

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating password', error });
    }
};

exports.deleteUser = async (req, res) => {
    const { nrp } = req.params;

    try {
        const user = await User.findOne({ where: { nrp } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.destroy({ where: { nrp } });

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting user', error });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: 'Refresh token is required' });

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findOne({ where: { nrp: decoded.nrp } });
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign(
            { nrp: decoded.nrp, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TOKEN_AGE }
        );

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};

exports.logout = async (req, res) => {
    const { nrp } = req.user;

    try {
        const user = await User.findOne({ where: { nrp } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        user.refreshToken = null;
        await user.save();

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
