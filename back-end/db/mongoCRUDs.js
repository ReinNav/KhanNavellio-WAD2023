const { MongoClient, ObjectId } = require("mongodb");


// Replace DB_USER, DB_USER_PASSWD, DB_NAME here:
const db_user = "klimaware_wad_daniyal";
const db_pswd = "TrJIh6rdb";
const db_name= "klimaware_wad"
const dbHostname = "mongodb1.f4.htw-berlin.de"
const dbPort = 27017
const uri = 'mongodb://klimaware_wad_daniyal:TrJIh6rdb@mongodb1.f4.htw-berlin.de:27017/klimaware_wad';

function MongoCRUDs (db_name, uri) {
    this.db_name = db_name;
    this.uri = uri;
} 

MongoCRUDs.prototype.findOneUser  = async function(uNameIn, passwdIn) {
  const client = new MongoClient(uri);
  try {
    const database = client.db(db_name);
    const users = database.collection('User');
    const query = {username: uNameIn, password: passwdIn};
    const doc = await users.findOne(query);
    if (doc) {
      delete doc.password;
    }
    return doc;
  } finally {
    // Ensures that the client will close when finished and on error
    await client.close();
  }
};

MongoCRUDs.prototype.findAllUsers  = async function() {
  const client = new MongoClient(uri);
  try {  
    const database = client.db(db_name);
    const users = database.collection('User');
    const query = {};
    const cursor = users.find(query);
    // Print a message if no documents were found
    if ((await users.countDocuments(query)) === 0) {
      console.log("No documents found!");
      return null;
    }
    let docs = new Array();
    for await (const doc of cursor) {
      delete doc.password;
      docs.push(doc);
    }
    return docs;
  } finally {
    // Ensures that the client will close when finished and on error
    await client.close();
  }
};

MongoCRUDs.prototype.getAllLocations = async function () {
  const client = new MongoClient(this.uri);
  try {
    await client.connect();
    const database = client.db(this.db_name);
    const locations = database.collection('Location');
    const allLocations = await locations.find({}).toArray();
    return allLocations;
  } catch (error) {
    console.error('Error fetching all locations:', error);
    return null; // Handle error appropriately
  } finally {
    await client.close();
  }
};

MongoCRUDs.prototype.getLocationById = async function(locationId) {
  const client = new MongoClient(this.uri);
  try {
    await client.connect();
    const database = client.db(this.db_name);
    const locations = database.collection('Location');
    const location = await locations.findOne({ _id: new ObjectId(locationId) }); // Use 'new ObjectId'

    return location;
  } catch (error) {
    console.error('Error fetching location by ID:', error);
    return null; // Handle error appropriately
  } finally {
    await client.close();
  }
};

MongoCRUDs.prototype.addLocation = async function(locationData) {
  const client = new MongoClient(this.uri);
  try {
    await client.connect();
    const database = client.db(this.db_name);
    const locations = database.collection('Location');
    const result = await locations.insertOne(locationData);

    if (result.insertedId) {
      return { message: 'Location added successfully', locationId: result.insertedId };
    } else {
      return null; // Handle the case where the location was not added
    }
  } catch (error) {
    console.error('Error adding location:', error);
    return null; // Handle error appropriately
  } finally {
    await client.close();
  }
};


MongoCRUDs.prototype.updateLocation = async function (locationId, updatedLocationData) {
  const client = new MongoClient(this.uri);
  try {
    await client.connect();
    const database = client.db(this.db_name);
    const locations = database.collection('Location');

    // Convert the locationId to ObjectId
    const objectId = new ObjectId(locationId);

    // Use objectId in the update query
    const result = await locations.updateOne({ _id: objectId }, { $set: updatedLocationData });

    if (result.modifiedCount === 1) {
      // Successfully updated the location
      return { message: 'Location updated successfully' };
    } else {
      // Location with the provided ID not found
      return null;
    }
  } catch (error) {
    console.error('Error updating location:', error);
    return null;  // Handle error appropriately
  } finally {
    await client.close();
  }
};

MongoCRUDs.prototype.deleteLocation = async function (locationId) {
  const client = new MongoClient(this.uri);
  try {
    await client.connect();
    const database = client.db(this.db_name);
    const locations = database.collection('Location');

    // Convert the locationId to ObjectId
    const objectId = new ObjectId(locationId);

    // Use objectId in the delete query
    const result = await locations.deleteOne({ _id: objectId });

    if (result.deletedCount === 1) {
      // Successfully deleted the location
      return { message: 'Location deleted successfully' };
    } else {
      // Location with the provided ID not found
      return null;
    }
  } catch (error) {
    console.error('Error deleting location:', error);
    return null;  // Handle error appropriately
  } finally {
    await client.close();
  }
};

const mongoCRUDs = new MongoCRUDs(db_name, uri);


module.exports = mongoCRUDs;