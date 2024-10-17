const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const generateFairSchedule = require('../utils/scheduleGenerator');

// Create a new event
router.post('/', auth, async (req, res) => {
  try {
    console.log('Received event data:', req.body);

    const { name, teammates, jobs, startDate, endDate, description, alert } = req.body;

    // Validate required fields
    if (!name || !teammates || !jobs || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate data types
    if (!Array.isArray(teammates) || !Array.isArray(jobs)) {
      return res.status(400).json({ message: 'Invalid data format for teammates or jobs' });
    }

    const schedules = generateFairSchedule(startDate, endDate, teammates, jobs);

    const newEvent = new Event({
      name,
      teammates,
      jobs,
      startDate,
      endDate,
      description,
      alert,
      schedules,
      user: req.user.id
    });

    console.log('New event object:', newEvent);

    const savedEvent = await newEvent.save();
    console.log('Saved event:', savedEvent);
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error in create event route:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all events for a user
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id });
    res.json(events);
  } catch (error) {
    console.error('Error in get all events route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a single event
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.user.id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error in get single event route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;