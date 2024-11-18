const Activity = require('../models/Activity');
const Trip = require('../models/Trip');

// Show all activities for a trip
exports.getActivities = async (req, res) => {
try {
const { id: tripId } = req.params;
const activities = await Activity.find({ tripId }).sort({ date: 1, time: 1 });
const trip = await Trip.findById(tripId);

if (!trip) {
return res.status(404).send('Trip not found');
}

res.render('tripDetails', { trip, activities });
} catch (error) {
console.error(error.message);
res.status(500).send('Error retrieving activities');
}
};

// Add a new activity
exports.addActivity = async (req, res) => {
try {
const { id: tripId } = req.params;
const { name, date, time, location, notes } = req.body;

const activity = new Activity({
tripId,
name,
date,
time,
location,
notes,
});

await activity.save();
res.redirect(`/trips/${tripId}`);
} catch (error) {
console.error(error.message);
res.status(500).send('Error adding activity');
}
};

// Edit an activity (form rendering)
exports.editActivityForm = async (req, res) => {
try {
const { id } = req.params;
const activity = await Activity.findById(id);

if (!activity) {
return res.status(404).send('Activity not found');
}

res.render('activityForm', { activity, tripId: activity.tripId });
} catch (error) {
console.error(error.message);
res.status(500).send('Error loading activity form');
}
};

// Update an activity
exports.updateActivity = async (req, res) => {
try {
const { id } = req.params;
const { name, date, time, location, notes } = req.body;

await Activity.findByIdAndUpdate(id, { name, date, time, location, notes });
const activity = await Activity.findById(id);

res.redirect(`/trips/${activity.tripId}`);
} catch (error) {
console.error(error.message);
res.status(500).send('Error updating activity');
}
};

// Delete an activity
exports.deleteActivity = async (req, res) => {
try {
const { id } = req.params;

const activity = await Activity.findByIdAndDelete(id);

if (!activity) {
return res.status(404).send('Activity not found');
}

res.redirect(`/trips/${activity.tripId}`);
} catch (error) {
console.error(error.message);
res.status(500).send('Error deleting activity');
}
};