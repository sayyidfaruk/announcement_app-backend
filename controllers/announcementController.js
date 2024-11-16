const fs = require('fs');
const path = require('path');
const { Announcement, User } = require('../models');

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    const nrp = req.user.nrp;
    const attachment = req.file ? req.file.filename : null;

    const announcement = await Announcement.create({ title, content, attachment, nrp });
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    return res.status(200).json(announcements);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching announcements', error });
  }
};

exports.getAnnouncementById = async (req, res) => {
  const { id } = req.params;
  try {
    const announcement = await Announcement.findOne({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
      where: { id }
    });
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    return res.status(200).json(announcement);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching announcement', error });
  }
};

exports.editAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const attachment = req.file ? req.file.filename : null;

  try {
    const announcement = await Announcement.findOne({ where: { id } });

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (attachment && announcement.attachment) {
      const oldFilePath = path.join(__dirname, '../uploads', announcement.attachment);
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error('Error deleting old file:', err);
        }
      });
    }

    const updateData = { title, content };

    if (attachment) {
      updateData.attachment = attachment;
    }

    await Announcement.update(updateData, { where: { id } });

    return res.status(200).json({ message: 'Announcement updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating announcement', error });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  const { id } = req.params;
  try {
    const announcement = await Announcement.findOne({ where: { id } });
    
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (announcement.attachment) {
      const filePath = path.join(__dirname, '../uploads', announcement.attachment);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
    }

    await Announcement.destroy({ where: { id } });

    return res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting announcement', error });
  }
};
