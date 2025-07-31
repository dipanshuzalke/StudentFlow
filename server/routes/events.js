const express = require("express");
const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventByDate
} = require("../controller/eventController");

const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.get("/-by-date", getEventByDate);
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

module.exports = router;
