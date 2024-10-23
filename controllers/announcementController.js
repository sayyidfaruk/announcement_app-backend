const { Announcement } = require('../models');

exports.createAnnouncement = async (req, res) => {
    try {
        const { title, content } = req.body;
        const nrp = req.user.nrp;
        const attachment = req.file ? req.file.filename : null;

        const announcement = await Announcement.create({ title, content, attachment, nrp });
        console.log(`apa nih ${announcement}`);
        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll();
    return res.status(200).json(announcements);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching announcements', error });
  }
};

exports.getAnnouncementById = async (req, res) => {
  const { id } = req.params;
  try {
    const announcement = await Announcement.findOne({ where: { id } });
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
  const file = req.file ? req.file.path : null;

  try {
    const announcement = await Announcement.findOne({ where: { id } });

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    await Announcement.update(
      {
        title,
        content,
        file
      },
      { where: { id } }
    );

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

    await Announcement.destroy({ where: { id } });

    return res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting announcement', error });
  }
};
