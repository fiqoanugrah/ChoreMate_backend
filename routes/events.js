const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const generateFairSchedule = require('../utils/scheduleGenerator');

router.post('/', auth, async (req, res) => {
  try {
    console.log('Received event data:', JSON.stringify(req.body, null, 2));

    const { name, teammates, jobs, startDate, endDate, description, alert } = req.body;

    // Validate required fields
    if (!name || !teammates || !jobs || !startDate || !endDate) {
      console.error('Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate data types
    if (!Array.isArray(teammates) || !Array.isArray(jobs)) {
      console.error('Invalid data format for teammates or jobs');
      return res.status(400).json({ message: 'Invalid data format for teammates or jobs' });
    }

    console.log('Generating fair schedule...');
    const schedules = generateFairSchedule(startDate, endDate, teammates, jobs);
    console.log('Generated schedules:', JSON.stringify(schedules, null, 2));

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

    console.log('Saving new event...');
    const savedEvent = await newEvent.save();
    console.log('Saved event:', JSON.stringify(savedEvent, null, 2));
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error in create event route:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id });
    res.json(events);
  } catch (error) {
    console.error('Error in get all events route:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

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