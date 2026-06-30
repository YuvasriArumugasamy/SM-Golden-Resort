const BookingBlock = require('../models/BookingBlock');
const Room = require('../models/Room');

// Create a booking block
exports.createBlock = async (req, res) => {
  try {
    const { roomId, startDate, endDate } = req.body;
    if (!roomId || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    
    // Check if room exists
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const block = await BookingBlock.create({ roomId, startDate: start, endDate: end });
    res.status(201).json({ message: 'Block created successfully', block });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all booking blocks
exports.getBlocks = async (req, res) => {
  try {
    const blocks = await BookingBlock.find().sort({ startDate: 1 });
    res.json(blocks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a booking block
exports.deleteBlock = async (req, res) => {
  try {
    const { id } = req.params;
    await BookingBlock.findByIdAndDelete(id);
    res.json({ message: 'Block deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
