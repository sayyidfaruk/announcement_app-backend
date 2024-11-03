const express = require('express');
const { register, login, changePassword, deleteUser, refreshToken, logout, getAllUsers, updateUser } = require('../controllers/authController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/refresh-token', refreshToken); 
router.post('/logout', verifyToken, logout);
router.post('/register', verifyToken, verifyRole([3]), register);
router.get('/users', verifyToken, verifyRole([3]), getAllUsers);
router.put('/change-password', verifyToken, changePassword);
router.put('/user-update', verifyToken, verifyRole([3]), updateUser);
router.delete('/user/:nrp', verifyToken, verifyRole([3]), deleteUser);

module.exports = router;