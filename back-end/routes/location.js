const express = require('express');
const router = express.Router();
const mongoCRUDs = require('../db/mongoCRUDs'); 

//  GET /loc, status with payload all locations
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

 //  GET /loc/:id, status with payload location w id
router.get('/:id', async (req, res) => {
  try {
    const locationId = req.params.id; 

    const location = await mongoCRUDs.getLocationById(locationId);

    if (location) {
      res.status(200).json(location);
    } else {
      res.status(404).send('Location not found'); 
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

//  POST /loc, with payload in header Location: /loc/newid
router.post('/', async (req, res) => {
  try {
    console.log("post request received")
    const newLocation = req.body;

    const addedLocationId = await mongoCRUDs.addLocation(newLocation);

    if (addedLocationId) {
     // newLocation._id = addedLocationId;
      //res.status(201).json(newLocation);
      res.status(201).set('Location', `/loc/${addedLocationId}`).send('Location added successfully');
    } else {
      res.status(400).send('Could not add location');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// PUT /loc/:id, status 204 no payload
router.put('/:id', async (req, res) => {
  try {
    const locationId = req.params.id; 
    const updatedLocationData = req.body; 
    console.log("hi")
    console.log(locationId)

    const updatedLocation = await mongoCRUDs.updateLocation(locationId, updatedLocationData);

    if (updatedLocation) {
      res.status(204).send();
    } else {
      res.status(404).send('Location not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});


// DELETE loc/:id, status 204 no payload
router.delete('/:id', async (req, res) => {

  
  try {
      const locationId = req.params.id; 

      const deletedLocation = await mongoCRUDs.deleteLocation(locationId);

      if (deletedLocation) {
          res.status(204).send();
      } else {
          res.status(404).send('Location not found'); 
      }
  } catch (error) {
      console.error(error);
      res.status(500).send('Server error'); 
  }
});
module.exports = router;