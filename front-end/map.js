document.addEventListener("DOMContentLoaded", function() {
    L.mapquest.key = 'BTjR7udbEih1QrCTjZUq7w1m25Eket6l';

    var map = L.mapquest.map('map', {
        center: [52.5573155, 13.3729101], // coordinates on load (Berlin)
        layers: L.mapquest.tileLayer('map'),
        zoom: 9 
    });

    var marker1 = L.marker([52.5573155 , 13.3729101]).addTo(map);
    marker1.bindPopup('Kiez in der Schwedenstraße');
    
    var marker2 = L.marker([52.38300635 , 12.610102564424093]).addTo(map);
    marker2.bindPopup('Zigarettenfabrik');

    var marker3 = L.marker([52.3928, 13.7892]).addTo(map);
    marker3.bindPopup('Tesla Giga Factory');

    marker1.on('click', function(e) {
        marker1.openPopup();
    });
    marker2.on('click', function(e) {
        marker2.openPopup();
    });
    marker3.on('click', function(e) {
        marker3.openPopup();
    });
   
});
