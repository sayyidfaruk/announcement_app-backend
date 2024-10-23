const express = require('express');
const { createAnnouncement, editAnnouncement, deleteAnnouncement, getAllAnnouncements, getAnnouncementById } = require('../controllers/announcementController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', verifyToken, verifyRole([2, 3]), upload.single('file'), createAnnouncement);  // Super Admin & Admin
router.put('/:id', verifyToken, verifyRole([2, 3]), upload.single('file'), editAnnouncement);   // Super Admin & Admin
router.delete('/:id', verifyToken, verifyRole([2, 3]), deleteAnnouncement);                    // Super Admin & Admin
router.get('/', verifyToken, getAllAnnouncements);                                            // Semua user bisa melihat
router.get('/:id', verifyToken, getAnnouncementById);                                         // Semua user bisa melihat

module.exports = router;
