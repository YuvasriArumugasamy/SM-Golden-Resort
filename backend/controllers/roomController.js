const Room = require("../models/Room");

const roomsData = [
  // Non-AC Rooms — 7 rooms (₹1,500/night)
  { roomId: "101", name: "Room 101", type: "Non-AC", price: 1500, beds: "Double Bed", badge: "Non-AC", amenities: ["WiFi", "TV", "Hot Water", "Fan"] },
  { roomId: "102", name: "Room 102", type: "Non-AC", price: 1500, beds: "Double Bed", badge: "Non-AC", amenities: ["WiFi", "TV", "Hot Water", "Fan"] },
  { roomId: "103", name: "Room 103", type: "Non-AC", price: 1500, beds: "Double Bed", badge: "Non-AC", amenities: ["WiFi", "TV", "Hot Water", "Fan"] },
  { roomId: "104", name: "Room 104", type: "Non-AC", price: 1500, beds: "Double Bed", badge: "Non-AC", amenities: ["WiFi", "TV", "Hot Water", "Fan"] },
  { roomId: "105", name: "Room 105", type: "Non-AC", price: 1500, beds: "Double Bed", badge: "Non-AC", amenities: ["WiFi", "TV", "Hot Water", "Fan"] },
  { roomId: "106", name: "Room 106", type: "Non-AC", price: 1500, beds: "Double Bed", badge: "Non-AC", amenities: ["WiFi", "TV", "Hot Water", "Fan"] },
  { roomId: "107", name: "Room 107", type: "Non-AC", price: 1500, beds: "Double Bed", badge: "Non-AC", amenities: ["WiFi", "TV", "Hot Water", "Fan"] },
  // AC Rooms — 2 rooms (₹2,000/night)
  { roomId: "201", name: "Room 201", type: "AC", price: 2000, beds: "Double Bed", badge: "AC", amenities: ["WiFi", "TV", "Hot Water", "AC"] },
  { roomId: "202", name: "Room 202", type: "AC", price: 2000, beds: "Double Bed", badge: "AC", amenities: ["WiFi", "TV", "Hot Water", "AC"] },
  // Villa Room 110 — 1 room (₹2,500/night)
  { roomId: "110", name: "Room 110 - Villa", type: "Villa", price: 2500, beds: "Double Bed", badge: "Villa", amenities: ["WiFi", "TV", "Hot Water", "Fan", "Kitchen", "Private Entrance"] },
  // Villa Room 110 — 1 room (₹2,500/night)
  { roomId: "110", name: "Room 110 - Villa", type: "Villa", price: 2500, beds: "Double Bed", badge: "Villa", amenities: ["WiFi", "TV", "Hot Water", "Fan", "Kitchen", "Private Entrance"] },
  // Suite AC Rooms — 1 room (₹10,000/night)
  { roomId: "501", name: "Suite Room", type: "Suite AC", price: 10000, beds: "King Bed", badge: "Suite", amenities: ["WiFi", "TV", "Hot Water", "AC", "Minibar", "Bathtub", "Living Area"] },
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

// @desc    Seed rooms — force reseed with latest data
// @access  Internal (called on server start)
const seedRooms = async () => {
  try {
    await Room.deleteMany({});
    // Drop and recreate index to avoid duplicate key errors
    await Room.collection.dropIndexes().catch(() => {});
    await Room.insertMany(roomsData);
    console.log(`✅ ${roomsData.length} rooms seeded successfully`);
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
