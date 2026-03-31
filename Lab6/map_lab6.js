// Create Map
const mymap = L.map("map", {
  center: [51.4888, -0.1029],
  zoom: 10
});

// Base Tile Layer
const Esri_WorldStreetMap = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
).addTo(mymap);

// MiniMap
const miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
new L.Control.MiniMap(miniLayer, { toggleDisplay: true, minimized: false }).addTo(mymap);

// Color Palettes
function getColorDensity(value) {
  return value > 139 ? '#7a0177' :
         value > 87  ? '#c51b8a' :
         value > 53  ? '#f768a1' :
         value > 32  ? '#fbb4b9' :
                        '#feebe2';
}

function getColorLang(value) {
  return value > 5.37 ? '#b30000' :
         value > 4.52 ? '#e34a33' :
         value > 2.80 ? '#fc8d59' :
         value > 1.61 ? '#fdbb84' :
         value > 0.88 ? '#fdd49e' :
                        '#fef0d9';
}

// Style Functions
function styleDensity(feature){
    return {
        fillColor: getColorDensity(feature.properties.pop_den),   
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
} 

function styleLanguage(feature){
    return {
        fillColor: getColorLang(feature.properties.af8_Dens),
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
}

// Highlight Functions
function highlightFeature(e) {
  const layer = e.target;
  layer.setStyle({
    weight: 5,
    color: '#666',
    fillOpacity: 0.7
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

function resetDensityHighlight(e) {
  densitylayer.resetStyle(e.target);
  e.target.closePopup();
}

function resetLanguageHighlight(e) {
  languagelayer.resetStyle(e.target);
  e.target.closePopup();
}

// Interactive Popups
function onEachDensityFeature(feature, layer) {
  layer.bindPopup(
    '<strong>' + feature.properties.NAME + '</strong><br>' + 
    '<span style="color:purple">' + feature.properties.pop_den + ' people/hectares</span>'
  );
  
  layer.on({
    mouseover: function (e) {
      highlightFeature(e);
      e.target.openPopup();
    },
    mouseout: resetDensityHighlight
  });
}

function onEachLanguageFeature(feature, layer) {
  layer.bindPopup(
    '<strong>' + feature.properties.name + '</strong><br>' + 
    '<span style="color:blue">' + feature.properties.af8_Dens.toFixed(2) + ' partial English speakers/hectare</span>'
  );
  
  layer.on({
    mouseover: function (e) {
      highlightFeature(e);
      e.target.openPopup();
    },
    mouseout: resetLanguageHighlight
  });
}

// Add Layers
const densitylayer = L.geoJSON(data, { style: styleDensity, onEachFeature: onEachDensityFeature }).addTo(mymap);
const languagelayer = L.geoJSON(partden, { style: styleLanguage, onEachFeature: onEachLanguageFeature });

// Legends
function buildLegendHTML(title, grades, colorFunction) {
  var html = '<div class="legend-title">' + title + '</div>';
  
  for (var i = 0; i < grades.length; i++) {
    var from = grades[i];
    var to = grades[i + 1];
    
    html +=
      '<div class="legend-box">' + 
        '<span class="legend-color" style="background:' + colorFunction(from + 0.5) + '""></span>' + 
        '<span>' + from + (to ? '&ndash;' + to : '+') + '</span>' + 
        '</div>';
  }
  
  return html;
}

// Insert legends
var densityLegendDiv = document.getElementById('density-legend');
if (densityLegendDiv) {
  densityLegendDiv.innerHTML = buildLegendHTML(
    'Population Density',
    [0, 32, 53, 87, 139],
    getColorDensity
  );
}

var languageLegendDiv = document.getElementById('language-legend');
if (languageLegendDiv) {
  languageLegendDiv.innerHTML = buildLegendHTML(
    'Non-English Speaker Density',
    [0, 0.88, 1.61, 2.80, 4.52, 5.37],
    getColorLang
  );
}

// Radio Button Layer Controls
var baseLayers = {
  "Population Density": densitylayer,
  "Partial English Speaker Density": languagelayer
};

var overlays = {};

L.control.layers(baseLayers, overlays, { collapsed: false }).addTo(mymap);