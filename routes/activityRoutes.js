const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// List all activities for a specific trip
router.get('/trips/:id/activities', activityController.getActivities);

// Add a new activity to a specific trip
router.post('/trips/:id/activities/add', activityController.addActivity);

// Render the edit activity form
router.get('/activities/edit/:id', activityController.editActivityForm);

// Update an existing activity
router.post('/activities/edit/:id', activityController.updateActivity);

// Delete an activity
router.post('/activities/delete/:id', activityController.deleteActivity);

module.exports = router;
