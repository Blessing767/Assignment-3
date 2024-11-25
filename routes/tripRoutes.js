const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

// Render the contact page
router.get("/contact", (req, res) => {
  res.render("contact");
});

// Render the dashboard with all trips
router.get("/dashboard", tripController.getAllTrips);

// Render the public trips page
router.get("/public", tripController.renderPublicTrips);

// Render the form to add a new trip
router.get("/add", tripController.renderTripForm);

// Render the form to edit an existing trip
router.get("/edit/:id", tripController.renderTripForm);

// View details of a specific trip
router.get("/:id", tripController.getTripDetails);

// Handle adding a new trip
router.post("/add", tripController.addTrip);

// Handle updating an existing trip
router.post("/edit/:id", tripController.updateTrip);

// Handle deleting a trip
router.post("/delete/:id", tripController.deleteTrip);

module.exports = router;