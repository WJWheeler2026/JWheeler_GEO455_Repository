// Initialize map
var mymap = L.map('map', {
  center: [35.5, -79],
  zoom: 7
});

// Base layers
var Esri_WorldStreetMap = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles © Esri' }
).addTo(mymap);

var Esri_WorldImagery = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles © Esri' }
);

// MiniMap
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");

new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false
}).addTo(mymap);

// Full extent
var fullExtent = [35.5, -79];
var fullZoom = 7;

// Button to reset view
L.easyButton(
  '<img src="FPimages/Globe_icon.png" height="20px">',
  function() {
    mymap.flyTo(fullExtent, fullZoom, { duration: 2 });
  },
  "Return to world view"
).addTo(mymap);

// Color function
function getColor(agrivolt) {
  if (!agrivolt) return "#95a5a6";

  var val = agrivolt.toString().trim().toLowerCase();

  if (val === "agrivoltaic") return "#2ecc71";
  if (val === "non-agrivoltaic") return "#e74c3c";

  return "#95a5a6";
}

// Layer
var currentProjects = L.geoJSON(null, {

  style: function (feature) {
    return {
      color: "Orange",
      weight: 3,
      fillOpacity: 0.9,
      fillColor: getColor(feature.properties.p_agrivolt)
    };
  },

  onEachFeature: function (feature, layer) {
    var p = feature.properties;

    if (p) {
      var popupContent = `
        <div style="font-size:14px; line-height:1.4;">
          <h3>${p.p_name || "Unknown Project"}</h3>
          <b>County:</b> ${p.p_county || "N/A"}<br>
          <b>Latitude:</b> ${p.ylat || "N/A"}<br>
          <b>Longitude:</b> ${p.xlong || "N/A"}<br>
          <b>Axis Type:</b> ${p.p_axis || "N/A"}<br>
          <b>Azimuth:</b> ${p.p_azimuth || "N/A"}<br>
          <b>Capacity (AC):</b> ${p.p_cap_ac || "N/A"} MW<br>
          <b>Capacity (DC):</b> ${p.p_cap_dc || "N/A"} MW<br>
          <b>Land Cover:</b> ${p.p_agrivolt || "N/A"}
        </div>
      `;

      layer.bindPopup(popupContent);
    }
  }
}).addTo(mymap);

// Load data
fetch("./Data/uspvdb_NC.geojson")
  .then(function(response) {
    if (!response.ok) {
      throw new Error("HTTP error! status: " + response.status);
    }
    return response.json();
  })
  .then(function(data) {
    currentProjects.addData(data);
    mymap.fitBounds(currentProjects.getBounds());
  })
  .catch(function(error) {
    console.error("Error loading GeoJSON:", error);
  });

// Layer control
var baseMaps = {
  "Streets": Esri_WorldStreetMap,
  "Imagery": Esri_WorldImagery
};

var overlays = {
  "Existing Projects": currentProjects
};

L.control.layers(baseMaps, overlays, { collapsed: false }).addTo(mymap);

// Legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  var div = L.DomUtil.create("div", "info legend");

  var categories = [
    { label: "Agrivoltaic", value: "agrivoltaic" },
    { label: "Non-Agrivoltaic", value: "non-agrivoltaic" },
    { label: "Unknown", value: null }
  ];

  div.innerHTML += "<h4>Agrivoltaics</h4>";

  categories.forEach(function(cat) {
    div.innerHTML +=
      '<i style="background:' + getColor(cat.value) + '; width:18px; height:18px; display:inline-block; margin-right:8px;"></i>' +
      cat.label + "<br>";
  });

  return div;
};

// Add legend initially
legend.addTo(mymap);

// Toggle legend with layer
mymap.on('overlayadd', function(e) {
  if (e.layer === currentProjects) {
    legend.addTo(mymap);
  }
});

mymap.on('overlayremove', function(e) {
  if (e.layer === currentProjects) {
    mymap.removeControl(legend);
  }
});

// NSRDB Solar Radiation Database API <-- Work on .shp!
