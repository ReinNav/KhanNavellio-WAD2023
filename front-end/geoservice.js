const MAPQUEST_API_KEY = 'BTjR7udbEih1QrCTjZUq7w1m25Eket6l'

export async function geocodeAddress(address) {
    const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${MAPQUEST_API_KEY}&outFormat=json&location=${encodeURIComponent(address)}`;
  
    // Return a promise with the lat long from response
    return new Promise((resolve, reject) => {
      console.log(address);
      fetch(url)
        .then(response => {
          console.log(response);
          if (!response.ok) {
            throw new Error('Error in geocoding!');
          }
          return response.json();
        })
        .then(data => {

          console.log(data);

          const street = data.results[0].locations[0].street;
          const postalCode = data.results[0].locations[0].postalCode;

          if (street === '' || postalCode === '') {
            throw new Error('No locations found');
          }

          const locations = data.results[0].locations;

          if (locations && locations.length > 0) {
            const latLng = locations[0].latLng;
            resolve(latLng);
          } else {
            reject(new Error('No locations found'));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  