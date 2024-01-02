const express = require('express');
const router = express.Router();
const mongoCRUDs = require('../db/mongoCRUDs'); 

router.get('/loc', async function(req, res) {
    console.log("Request received at /loc");
    try {
      // Implement logic to fetch location data from your MongoDB using mongoCRUDs
     
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

router.post('/', async (req, res) => {
  try {
    const newLocation = req.body;
    // Add your validation logic for newLocation here if needed

    // Add newLocation to MongoDB
    const addedLocationId = await mongoCRUDs.addLocation(newLocation);

    if (addedLocationId) {
      res.status(201).header('Location', `/loc/${addedLocationId}`).send();
    } else {
      res.status(400).send('Could not add location');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;

