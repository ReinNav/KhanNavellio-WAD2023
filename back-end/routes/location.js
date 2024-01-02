const express = require('express');
const router = express.Router();
const mongoCRUDs = require('../db/mongoCRUDs'); 

// Define the GET route for /loc
router.get('/', async function(req, res) {
    console.log("Request received at /loc");

    try {
      
      const locations = await mongoCRUDs.getAllLocations();

  
      if (locations) {
        res.status(200).json(locations);
      } else {
        res.status(404).send('Locations not found!');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });

 // Define the GET route for /loc/:id (to retrieve a location by ID)
router.get('/:id', async (req, res) => {
  try {
    const locationId = req.params.id; // Get the location ID from the URL

    // Use the locationId to retrieve the location from MongoDB using mongoCRUDs
    const location = await mongoCRUDs.getLocationById(locationId);

    if (location) {
      res.status(200).json(location); // Respond with the location data
    } else {
      res.status(404).send('Location not found'); // Location with the provided ID not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error'); // Internal server error
  }
});

// Define the POST route for /loc
router.post('/', async (req, res) => {
  try {
    const newLocation = req.body;

    // Add newLocation to MongoDB
    const addedLocationId = await mongoCRUDs.addLocation(newLocation);

    if (addedLocationId) {
      res.status(201).header('Location', `/loc/${addedLocationId}`).send('Location added successfully');
    } else {
      res.status(400).send('Could not add location');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Define the PUT route for /loc/:id (to update a location)
router.put('/:id', async (req, res) => {
  try {
    const locationId = req.params.id; // Get the location ID from the URL
    const updatedLocationData = req.body; // New location data to update

    // Update the location with the provided ID
    const updatedLocation = await mongoCRUDs.updateLocation(locationId, updatedLocationData);

    if (updatedLocation) {
      res.status(200).json(updatedLocation); // Respond with the updated location
    } else {
      res.status(404).send('Location not found'); // Location with the provided ID not found
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error'); // Internal server error
  }
});


// Define the DELETE route for /loc/:id (to delete a location)
router.delete('/:id', async (req, res) => {

  
  try {
      const locationId = req.params.id; // Get the location ID from the URL

      // Delete the location with the provided ID using mongoCRUDs
      const deletedLocation = await mongoCRUDs.deleteLocation(locationId);

      if (deletedLocation) {
          res.status(200).json(deletedLocation); // Respond with the deleted location
      } else {
          res.status(404).send('Location not found'); // Location with the provided ID not found
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error'); // Internal server error
  }
});
module.exports = router;