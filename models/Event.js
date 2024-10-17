const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  name: { type: String, required: true },
  assigneesPerDay: { type: Number, required: true },
  assignees: [{ type: String, required: true }]
});

const ScheduleSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  jobs: [{
    name: { type: String, required: true },
    assignee: { type: String, required: true }
  }]
});

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  teammates: [{ type: String, required: true }],
  jobs: [JobSchema],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: String,
  alert: String,
  schedules: [ScheduleSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);