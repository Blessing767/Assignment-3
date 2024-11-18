const Trip = require('../models/Trip');
const Activity = require('../models/Activity');

// Show all trips for a user
exports.getAllTrips = async (req, res) => {
try {
const userId = req.user.id; // Assuming req.user contains authenticated user data
const trips = await Trip.find({ userId }).sort({ startDate: 1 });

res.render('dashboard', { trips });
} catch (error) {
console.error(error.message);
res.status(500).send('Error retrieving trips');
}
};

// Show trip details and its activities
exports.getTripDetails = async (req, res) => {
try {
const { id } = req.params;
const trip = await Trip.findById(id);
const activities = await Activity.find({ tripId: id }).sort({ date: 1, time: 1 });

if (!trip) {
return res.status(404).send('Trip not found');
}

res.render('tripDetails', { trip, activities });
} catch (error) {
console.error(error.message);
res.status(500).send('Error retrieving trip details');
}
};

// Render Add/Edit Trip Form
exports.renderTripForm = async (req, res) => {
try {
const { id } = req.params;
const trip = id ? await Trip.findById(id) : null;

res.render('addEditTrip', { trip });
} catch (error) {
console.error(error.message);
res.status(500).send('Error loading trip form');
}
};

// Add a new trip
exports.addTrip = async (req, res) => {
try {
const userId = req.user.id; // Assuming req.user contains authenticated user data
const { title, destination, startDate, endDate, notes } = req.body;

const newTrip = new Trip({
userId,
title,
destination,
startDate,
endDate,
notes,
});

await newTrip.save();
res.redirect('/dashboard');
} catch (error) {
console.error(error.message);
res.status(500).send('Error adding trip');
}
};

// Update an existing trip
exports.updateTrip = async (req, res) => {
try {
const { id } = req.params;
const { title, destination, startDate, endDate, notes } = req.body;

await Trip.findByIdAndUpdate(id, {
title,
destination,
startDate,
endDate,
notes,
});

res.redirect('/dashboard');
} catch (error) {
console.error(error.message);
res.status(500).send('Error updating trip');
}
};

// Delete a trip and its activities
exports.deleteTrip = async (req, res) => {
try {
const { id } = req.params;

await Trip.findByIdAndDelete(id);
await Activity.deleteMany({ tripId: id }); // Delete all activities associated with the trip

res.redirect('/dashboard');
} catch (error) {
console.error(error.message);
res.status(500).send('Error deleting trip');
}
};