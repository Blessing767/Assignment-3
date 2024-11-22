const Trip = require('../models/Trip');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');

// Render the splash (home) page
exports.renderHomePage = (req, res) => {
    res.render('home'); // Render home.ejs
};

// Render the public trips page
exports.renderPublicTrips = async (req, res) => {
    try {
        const trips = await Trip.find(); // Fetch all trips from the database
        res.render('publicTrips', { trips }); // Render publicTrips.ejs with trips data
    } catch (error) {
        console.error('Error fetching public trips:', error.message);
        res.status(500).send('Error fetching public trips');
    }
};

// Show all trips for the dashboard
exports.getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find(); // Fetch all trips from the database
        res.render('dashboard', { trips });
    } catch (error) {
        console.error('Error fetching trips:', error.message);
        res.status(500).send('Error retrieving trips');
    }
};

// Show trip details and its activities
exports.getTripDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid trip ID');
        }

        const trip = await Trip.findById(id);
        if (!trip) {
            return res.status(404).send('Trip not found');
        }

        // Fetch activities associated with this trip
        const activities = await Activity.find({ tripId: trip._id });

        res.render('tripDetails', { trip, activities });
    } catch (error) {
        console.error('Error fetching trip details:', error.message);
        res.status(500).send('Error fetching trip details');
    }
};

// Render Add/Edit Trip Form
exports.renderTripForm = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the route is for editing a trip
        if (id) {
            // Validate ObjectId for edit route
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).send('Invalid trip ID');
            }

            // Fetch the trip for editing
            const trip = await Trip.findById(id);
            if (!trip) {
                return res.status(404).send('Trip not found');
            }
            return res.render('addEditTrip', { trip });
        }

        // If no ID is provided, render the form for adding a new trip
        res.render('addEditTrip', { trip: null });
    } catch (error) {
        console.error('Error rendering trip form:', error.message);
        res.status(500).send('Error rendering trip form');
    }
};

// Add a new trip
exports.addTrip = async (req, res) => {
    try {
        const { title, destination, startDate, endDate, notes } = req.body;

        // Ensure required fields are present
        if (!title || !destination || !startDate || !endDate) {
            return res.status(400).send('Missing required fields');
        }

        // Create and save a new trip
        const newTrip = new Trip({
            title,
            destination,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            notes,
        });

        await newTrip.save();
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error adding trip:', error.message);
        res.status(500).send('Error adding trip');
    }
};

// Update an existing trip
exports.updateTrip = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, destination, startDate, endDate, notes } = req.body;

        // Validate ObjectId for update
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid trip ID');
        }

        await Trip.findByIdAndUpdate(id, {
            title,
            destination,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            notes,
        });

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error updating trip:', error.message);
        res.status(500).send('Error updating trip');
    }
};

// Delete a trip and its activities
exports.deleteTrip = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId for delete
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid trip ID');
        }

        await Trip.findByIdAndDelete(id);
        await Activity.deleteMany({ tripId: id }); // Delete all activities associated with the trip

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error deleting trip:', error.message);
        res.status(500).send('Error deleting trip');
    }
};