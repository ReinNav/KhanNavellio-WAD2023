const MAPQUEST_API_KEY = 'BTjR7udbEih1QrCTjZUq7w1m25Eket6l'

export async function geocodeAddress(address) {
    const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${MAPQUEST_API_KEY}&location=${encodeURIComponent(address)}`;
  
    // Return a promise with the lat long from response
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error('Error in geocoding!');
          }
          response.json()
        })
        .then(data => {
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
  