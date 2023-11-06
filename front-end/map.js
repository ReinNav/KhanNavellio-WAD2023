document.addEventListener("DOMContentLoaded", function() {
    L.mapquest.key = 'BTjR7udbEih1QrCTjZUq7w1m25Eket6l';

    var map = L.mapquest.map('map', {
        center: [52.5573155, 13.3729101], // Default center coordinates (Berlin)
        layers: L.mapquest.tileLayer('map'),
        zoom: 9 // Default zoom level
    });

    // Example marker
    var marker = L.marker([52.5573155 , 13.3729101]).addTo(map);
    var marker1 = L.marker([52.38300635 , 12.610102564424093]).addTo(map);
    var marker2 = L.marker([52.3928, 13.7892]).addTo(map);

   
});
