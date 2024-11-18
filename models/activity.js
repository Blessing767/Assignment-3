const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String },
    notes: { type: String },
});

module.exports = mongoose.model('Activity', activitySchema);