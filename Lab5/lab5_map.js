/* MAPS */
var map = L.map("map", {
  center: [6.79, 20.91],
  zoom: 3
});

var Esri_WorldStreetMap = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012' }
).addTo(map);

var Esri_WorldImagery = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' }
);

var Esri_WorldTopoMap = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community' }
);

var homeCenter = map.getCenter();
var homeZoom = map.getZoom();

L.easyButton(
  '<img src="images/globe_icon.png" height="70%">',
  function() {
    map.flyTo(homeCenter, homeZoom, { duration: 2 });
  },
  "Return to world view"
).addTo(map);

/* DATA */
var wonders = [
  { name: "Great Wall of China", coords: [40.4505, 116.549] },
  { name: "Chichen Itza", coords: [20.6793, -88.5682] },
  { name: "Petra", coords: [30.3287, 35.4444] },
  { name: "Machu Picchu", coords: [-13.1629, -72.545] },
  { name: "Christ the Redeemer", coords: [-22.9517, -43.2104] },
  { name: "Colosseum", coords: [41.8904, 12.4922] },
  { name: "Taj Mahal", coords: [27.1753, 78.0421] }
];

var iconFiles = [
  "images/icon_1.png",
  "images/icon_2.png",
  "images/icon_3.png",
  "images/icon_4.png",
  "images/icon_5.png",
  "images/icon_6.png",
  "images/icon_7.png"
];

var wonderIcons = [];

for (var i = 0; i < iconFiles.length; i++) {
  wonderIcons.push(
    L.icon({
      iconUrl: iconFiles[i],
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -28]
    })
  );
}

var landmarks = L.layerGroup();

/* ADD MARKERS */
function addWondersToLayer(dataArray, layerGroup, iconsArray) {
  for (var i = 0; i < dataArray.length; i++) {
    var feature = dataArray[i];
    var marker = L.marker(feature.coords, { icon: iconsArray[i] })
      .bindPopup(feature.name)
      .bindTooltip(feature.name, { direction: "top", sticky: true })
      .addTo(layerGroup);

    marker.on("click", function(e) {
      map.flyTo(e.latlng, 7, { duration: 2 });
    });
  }
}

addWondersToLayer(wonders, landmarks, wonderIcons);
landmarks.addTo(map);

/* CLICK INTERACTIVITY */
var clickPopup = L.popup();

map.on("click", function(e) {
  var lat = e.latlng.lat.toFixed(5);
  var lon = e.latlng.lng.toFixed(5);

  clickPopup
    .setLatLng(e.latlng)
    .setContent("<b>Lat:</b> " + lat + "<br><b>Lon:</b> " + lon)
    .openOn(map);

  document.getElementById("click-lat").textContent = lat;
  document.getElementById("click-lon").textContent = lon;
});

/* LAYER CONTROL */
var baseLayers = {
  "Street Map": Esri_WorldStreetMap,
  "Satellite": Esri_WorldImagery,
  "Topographic": Esri_WorldTopoMap
};

var overlays = {
  "Seven Wonders": landmarks
};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(map);

/* MINIMAP */
var miniLayer = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
);

new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false
}).addTo(map);

/* REAL-TIME ISS (Lab 5) */
var issIcon = L.icon({
  iconUrl: "images/iss200.png",
  iconSize: [80, 52],
  iconAnchor: [25, 16]
});

var issMarker = L.marker([0, 0], { icon: issIcon }).addTo(map);
var api_url = "https://api.wheretheiss.at/v1/satellites/25544";

function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

async function getISS() {
  try {
    var response = await fetch(api_url);
    if (!response.ok) throw new Error("ISS API error");
    var data = await response.json();
    var latitude = data.latitude;
    var longitude = data.longitude;
    issMarker.setLatLng([latitude, longitude]);
    document.getElementById("lat").textContent = latitude.toFixed(3);
    document.getElementById("lon").textContent = longitude.toFixed(3);
    document.getElementById("iss-time").textContent = formatTime(new Date());
  } catch (err) {
    document.getElementById("iss-time").textContent = "ISS unavailable";
  }
}

/* CALL & REFRESH */
getISS();
setInterval(getISS, 1000);

/* JUMP TO ISS */
document.getElementById("btn-iss").addEventListener("click", function() {
  var issLatLng = issMarker.getLatLng();
  map.setView([issLatLng.lat, issLatLng.lng], 4, { duration: 2 });
});