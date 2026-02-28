/*MAP LAYERS AND BACKGROUND IMAGERY*/
var Esri_WorldStreetMap = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012' }
);

var Esri_WorldImagery = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' }
);

var Esri_WorldTopoMap = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community' }
);

var map = L.map("map", {
  center: [6.794952075439587, 20.91148703911037],
  zoom: 3,
  layers: [Esri_WorldStreetMap]
});

var homeCenter = map.getCenter();
var homeZoom = map.getZoom();

L.easyButton('<img src="Home_icon_black.png" height="70%">', function () {
  map.flyTo(homeCenter, homeZoom, { duration: 2 });
}, "Return to World View").addTo(map);


/*POPUPS*/

var greatwallPopup = "Great Wall of China<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/20090529_Great_Wall_8185.jpg/256px-20090529_Great_Wall_8185.jpg' width='150px'/>";
var chichenPopup = "Chichen Itza<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/003_El_Castillo_o_templo_de_Kukulkan._Chich%C3%A9n_Itz%C3%A1%2C_M%C3%A9xico._MPLC.jpg/256px-003_El_Castillo_o_templo_de_Kukulkan._Chich%C3%A9n_Itz%C3%A1%2C_M%C3%A9xico._MPLC.jpg' width='150px'/>";
var petraPopup = "Petra<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/The_Monastery%2C_Petra%2C_Jordan8.jpg/256px-The_Monastery%2C_Petra%2C_Jordan8.jpg' width='150px'/>";
var machuPopup = "Machu Picchu<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/256px-Machu_Picchu%2C_Peru.jpg' width='150px'/>";
var christPopup = "Christ the Redeemer<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg/256px-Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg' width='150px'/>";
var coloPopup = "Colosseum<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg/256px-Colosseum_in_Rome-April_2007-1-_copie_2B.jpg' width='150px'/>";
var tajPopup = "Taj Mahal<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Taj-Mahal.jpg/256px-Taj-Mahal.jpg' width='150px'/>";

var customOptions = {
  maxWidth: 150,
  className: 'custom'
};


/*LAYER GROUPS AND DATA ARRAY*/

var landmarks = L.layerGroup();
var lines = L.layerGroup();
var wonders = [
  { name: "Great Wall of China", coords: [40.4505, 116.5490], popupHtml: greatwallPopup },
  { name: "Chichen Itza", coords: [20.6793, -88.5682], popupHtml: chichenPopup },
  { name: "Petra", coords: [30.3287, 35.4444], popupHtml: petraPopup },
  { name: "Machu Picchu", coords: [-13.1629, -72.5450], popupHtml: machuPopup },
  { name: "Christ the Redeemer", coords: [-22.9517, -43.2104], popupHtml: christPopup },
  { name: "Colosseum", coords: [41.8904, 12.4922], popupHtml: coloPopup },
  { name: "Taj Mahal", coords: [27.1753, 78.0421], popupHtml: tajPopup }
];


/*ADD MARKERS*/

function addWondersToLayer(dataArray, layerGroup) {

  for (var i = 0; i < dataArray.length; i++) {

    var feature = dataArray[i];

    var marker = L.marker(feature.coords);

    marker.bindPopup(feature.popupHtml, customOptions);

    marker.on("click", function(e) {
      map.flyTo(e.latlng, 7, {
        duration: 2
      });
    });

    marker.addTo(layerGroup);
  }
}

addWondersToLayer(wonders, landmarks);

landmarks.addTo(map);


/*GREAT WALL POLYLINE*/

var greatWallLineCoords = [
  [40.45058574410227, 116.54903113946699],
  [40.44940804004364, 116.55324919831969],
  [40.44714494004076, 116.55510028845048],
  [40.44545911200895, 116.55455406535388],
  [40.44428131665059, 116.55637480900924],
  [40.44060923386488, 116.56019837128976],
  [40.43557422832096, 116.56189773235194],
  [40.431023921892326, 116.56441642808237],
  [40.43005690361108, 116.56583967643232],
  [40.42912280914733, 116.56815090383526],
  [40.42817101495977, 116.56756399877838]
];

var greatWallLine = L.polyline(greatWallLineCoords, {
  weight: 6,
  color: "#DB9CFF"
});

greatWallLine.bindPopup(greatwallPopup, customOptions);
greatWallLine.bindTooltip("Great Wall of China", { sticky: true });

// Zoom to full wall when clicked
greatWallLine.on("click", function () {
  map.fitBounds(greatWallLine.getBounds(), {
    padding: [50, 50]
  });
});

greatWallLine.addTo(lines);


/*LAYER CONTROL*/

var baseLayers = {
  "Street Map": Esri_WorldStreetMap,
  "Satellite Imagery": Esri_WorldImagery,
  "Topographic": Esri_WorldTopoMap
};

var overlays = {
  "Seven Wonders": landmarks,
  "Great Wall Line": lines
};

L.control.layers(baseLayers, overlays, {
  collapsed: false
}).addTo(map);