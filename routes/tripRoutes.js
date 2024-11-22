const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

// Render the home page
router.get('/', tripController.renderHomePage);

// Render the public trips page
router.get('/public', tripController.renderPublicTrips);

// Display the dashboard with all trips
router.get('/dashboard', tripController.getAllTrips);

// View details of a specific trip
router.get('/:id', tripController.getTripDetails);

// Render the form to add a new trip
router.get('/add', tripController.renderTripForm);

// Render the form to edit an existing trip
router.get('/edit/:id', tripController.renderTripForm);

// Add a new trip
router.post('/add', tripController.addTrip);

// Update an existing trip
router.post('/edit/:id', tripController.updateTrip);

// Delete a specific trip
router.post('/delete/:id', tripController.deleteTrip);

module.exports = router;