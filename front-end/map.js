document.addEventListener("DOMContentLoaded", function() {
    L.mapquest.key = 'BTjR7udbEih1QrCTjZUq7w1m25Eket6l';

    var map = L.mapquest.map('map', {
        center: [52.5200, 13.4050], // Default center coordinates (Berlin)
        layers: L.mapquest.tileLayer('map'),
        zoom: 12 // Default zoom level
    });

    // Example marker
    var marker = L.marker([52.5200, 13.4050]).addTo(map);
});
