const express = require('express');
const { register, login, changePassword, deleteUser, refreshToken, logout } = require('../controllers/authController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken); 
router.post('/logout', verifyToken, logout);
router.put('/change-password', verifyToken, verifyRole([3]), changePassword);
router.delete('/user/:nrp', verifyToken, verifyRole([3]), deleteUser);

module.exports = router;