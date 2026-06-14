const Room = require("../models/Room");

const roomsData = [
  { roomId: "101", name: "Room 101", type: "AC", price: 2000, beds: "Double Bed", badge: "AC", amenities: ["WiFi", "TV", "Hot Water", "AC"] },
  { roomId: "102", name: "Room 102", type: "Suite AC", price: 10000, beds: "King Bed", badge: "Suite AC", amenities: ["WiFi", "TV", "Hot Water", "AC", "Minibar", "Balcony"] },
  { roomId: "103", name: "Room 103", type: "AC", price: 2000, beds: "Double Bed", badge: "AC", amenities: ["WiFi", "TV", "Hot Water", "AC"] },
  { roomId: "104", name: "Room 104", type: "Non-AC", price: 1500, beds: "Double Bed", badge: "Non-AC", amenities: ["WiFi", "TV", "Hot Water", "Fan"] },
  { roomId: "105", name: "Room 105", type: "Non-AC", price: 1500, beds: "Single Bed", badge: "Non-AC", amenities: ["WiFi", "TV", "Hot Water", "Fan"] },
  { roomId: "106", name: "Room 106", type: "Non-AC", price: 1500, beds: "Single Bed", badge: "Non-AC", amenities: ["WiFi", "TV", "Hot Water", "Fan"] },
  { roomId: "107", name: "Room 107", type: "Non-AC", price: 1500, beds: "Double Bed", badge: "Non-AC", amenities: ["WiFi", "TV", "Hot Water", "Fan"] },
  { roomId: "108", name: "Room 108", type: "AC", price: 2000, beds: "Double Bed", badge: "AC", amenities: ["WiFi", "TV", "Hot Water", "AC"] },
  { roomId: "109", name: "Room 109", type: "Non-AC", price: 1500, beds: "Double Bed", badge: "Non-AC", amenities: ["WiFi", "TV", "Hot Water", "Fan"] },
  { roomId: "110", name: "Room 110 - Villa", type: "Villa", price: 2500, beds: "Double Bed", badge: "Villa", amenities: ["WiFi", "TV", "Hot Water", "Fan", "Garden View", "Kitchen Access"] },
  { roomId: "111", name: "Suite Premium", type: "Suite AC", price: 10000, beds: "King Bed", badge: "Suite Premium", amenities: ["WiFi", "TV", "Hot Water", "AC", "Minibar", "Balcony", "Mountain View"] },
];

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomId: 1 });
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({ message: "Server error fetching rooms" });
  }
};

// @desc    Seed rooms if collection is empty
// @access  Internal (called on server start)
const seedRooms = async () => {
  try {
    const count = await Room.countDocuments();
    if (count === 0) {
      await Room.insertMany(roomsData);
      console.log("✅ 11 rooms seeded successfully");
    } else {
      console.log(`ℹ️  Rooms already seeded (${count} rooms in DB)`);
    }
  } catch (error) {
    console.error("Room seeding error:", error);
  }
};

// @desc    Toggle room availability
// @route   PATCH /api/rooms/:roomId/toggle
// @access  Protected
const toggleAvailability = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.available = !room.available;
    await room.save();

    res.status(200).json({
      message: `Room ${roomId} is now ${room.available ? "available" : "unavailable"}`,
      room,
    });
  } catch (error) {
    console.error("Toggle availability error:", error);
    res.status(500).json({ message: "Server error toggling room availability" });
  }
};

module.exports = { getAllRooms, seedRooms, toggleAvailability };
