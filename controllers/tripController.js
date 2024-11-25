const Trip = require('../models/Trip');
const Activity = require('../models/Activity');

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

// Show all trips for a user
exports.getAllTrips = async (req, res) => {
try {
    console.log('Fetching all trips...'); // Debug log
    const trips = await Trip.find(); // Fetch all trips from the database
    console.log('Trips retrieved successfully:', trips); // Debug log
    res.render('dashboard', { trips });
} catch (error) {
console.error(error.message);
res.status(500).send('Error retrieving trips');
}
};

// Show trip details and its activities
exports.getTripDetails = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
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
        const tripId = req.params.id;

        // If `tripId` is "add", do NOT fetch anything; just render an empty form
        if (tripId === "add" || !tripId) {
            console.log('Rendering blank form for adding a new trip');
            return res.render('addEditTrip', { trip: null });
        }

        // Otherwise, try to fetch the trip for editing
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).send('Trip not found');
        }

        res.render('addEditTrip', { trip }); // Render form for editing
    } catch (error) {
        console.error('Error rendering trip form:', error.message);
        res.status(500).send('Error fetching trip details');
    }
};


// Add a new trip
exports.addTrip = async (req, res) => {
try {
    console.log('Trip data received:', req.body); // Debug: Log the request body
    const { title, destination, startDate, endDate, notes } = req.body;

    // Ensure required fields are present
    if (!title || !destination || !startDate || !endDate) {
        console.error('Missing required fields'); // Debug
        return res.status(400).send('Missing required fields');
    }

    // Create and save a new trip
    const newTrip = new Trip({
        title,
        destination,
        startDate: new Date(startDate), // Convert to Date object
        endDate: new Date(endDate),     // Convert to Date object
        notes,
    });

    await newTrip.save();
    console.log('Trip added successfully:', newTrip); // Debug

    // Redirect to the dashboard
    res.redirect('/trips/dashboard');
} catch (error) {
    console.error('Error adding trip:', error.message); // Log the error
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
        const tripId = req.params.id; // Get the tripId from the URL
        await Trip.findByIdAndDelete(tripId); // Delete the trip from the database
        console.log(`Trip with ID ${tripId} deleted successfully.`);
        res.redirect('/trips/dashboard'); // Redirect back to the dashboard
    } catch (error) {
        console.error("Error deleting trip:", error);
        res.status(500).send("Error deleting trip.");
    }
};