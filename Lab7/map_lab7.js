// == 1. BASE MAP == //
var streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

var mymap = L.map("map", {
    center: [28, 85],
    zoom: 5,
    layers: [streets]
});

// Scale bar //
L.control.scale().addTo(mymap);


// == 2. MINIMAP == //
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");

new L.Control.MiniMap(miniLayer, {
    toggleDisplay: true,
    minimized: false
}).addTo(mymap);


// == 3. ICON == //
var myIcon = L.icon({
    iconUrl: 'images/peaks.png',
    iconSize: [20, 20],
    iconAnchor: [10, 15],
    popupAnchor: [1, -24]
});


// == 4. REGULAR MARKERS == //
var peaks = L.geoJSON(mtn_peaks, {
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, { icon: myIcon });
    },
    onEachFeature: function(feature, layer) {
        layer.bindPopup(
            "<b>" + feature.properties.TITLE + "</b><br>" +
            "Height: " + feature.properties.Peak_Heigh + " m<br>" +
            "Deaths: " + feature.properties.number_of_ + "<br>" +
            "Expeditions: " + feature.properties.number_of1
        );
    }
});


// == 5. PROPORTIONAL CIRCLES == //
function getRadius(value) {
    return value * 0.02;
}

var propCircles = L.geoJSON(mtn_peaks, {
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: getRadius(feature.properties.number_of1),
            fillColor: "blue",
            color: "#000",
            weight: 1,
            fillOpacity: 0.6
        });
    },
    onEachFeature: function(feature, layer) {
        layer.bindPopup(
            "<b>" + feature.properties.TITLE + "</b><br>" +
            "Expeditions: " + feature.properties.number_of1
        );

        layer.on({
            mouseover: function(e) {
                e.target.setStyle({ color: 'yellow' });
            },
            mouseout: function(e) {
                propCircles.resetStyle(e.target);
            }
        });
    }
});


// == 6. HEATMAP == //
var heatMapPoints = [];
var min = Infinity;
var max = -Infinity;

mtn_peaks.features.forEach(function(feature) {
    var lat = feature.geometry.coordinates[1];
    var lng = feature.geometry.coordinates[0];
    var deaths = feature.properties.number_of_;

    heatMapPoints.push([lat, lng, deaths]);

    if (deaths > max) max = deaths;
    if (deaths < min) min = deaths;
});

var heat = L.heatLayer(heatMapPoints, {
    radius: 25,
    minOpacity: 0.5,
    gradient: {
        0.5: 'blue',
        0.75: 'lime',
        1: 'red'
    }
});


// == 7. CLUSTER MAP == //
var clusterMarkers = L.markerClusterGroup();

mtn_peaks.features.forEach(function(feature) {
    clusterMarkers.addLayer(
        L.marker([
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
        ])
    );
});


// == 8. ADD LAYER CONTROL == //

// Base layer (radio button behavior)
var baseLayers = {
    "<img src='images/peaks.png' width='18'> Mountain Peaks": peaks,
    "<img src='images/propcircles.png' width='18'> Proportional Circles": propCircles,
    "<img src='images/dead.jpg' width='18'> Deaths (Density)": heat,
    "<img src='images/cluster_icon.png' width='18'> Clustered Peaks": clusterMarkers
};

// Add control //
L.control.layers(baseLayers, null, {
    collapsed: false
}).addTo(mymap);

// Set default layer //
peaks.addTo(mymap);
peaks.addTo(mymap);


// == 9. SEARCH BOX == //
var searchControl = new L.Control.Search({
    position: 'topright',
    layer: peaks,
    propertyName: 'TITLE',
    marker: false,
    collapsed: false,
    textPlaceholder: 'Search peaks (Everest, Lhotse...)',
    moveToLocation: function(latlng) {
        mymap.setView(latlng, 10);
    }
});

mymap.addControl(searchControl);


// == 10. FULL EXTENT BUTTON == //
var fullExtent = [28, 85]; 
var fullZoom = 5;


L.easyButton('<img src="images/globe_icon.png" height ="70%">', function(btn, map){
    map.setView(fullExtent, fullZoom);
}, 'Zoom to full extent').addTo(mymap);