const express = require('express');
const router = express.Router();
const bookingBlockCtrl = require('../controllers/bookingBlockController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all booking blocks (Protected or Public? Let's make it Public so frontend booking page can query it, or protected if only admin manages.
// But the booking page needs to see blocks to disable calendar dates. Let's make GET public, and POST/DELETE protected.)
router.get('/', bookingBlockCtrl.getBlocks);
router.post('/', authMiddleware, bookingBlockCtrl.createBlock);
router.delete('/:id', authMiddleware, bookingBlockCtrl.deleteBlock);

module.exports = router;
