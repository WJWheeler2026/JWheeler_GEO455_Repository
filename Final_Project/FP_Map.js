// INITIALIZE MAP
const mymap = L.map('map', {
  center: [35.5, -79],
  zoom: 7
});

// BASE LAYERS
const Stadia_StamenTonerDark = L.tileLayer(
  'https://tiles.stadiamaps.com/tiles/stamen_toner_dark/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; Stadia Maps & Stamen Design & OpenStreetMap contributors',
    ext: 'png'
}).addTo(mymap);

const Esri_WorldImagery = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles © Esri' }
);

// MINIMAP
const miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");

new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false
}).addTo(mymap);

// RESET VIEW
const fullExtent = [35.5, -79];
const fullZoom = 7;

L.easyButton(
  '<img src="FPimages/Globe_icon.png" height="20px">',
  function () {
    mymap.flyTo(fullExtent, fullZoom, { duration: 2 });
  },
  "Return to world view"
).addTo(mymap);

// COLOR FUNCTIONS
// OVERLAY #1: USPVDB (Cool Palette)
function getCapacityColor(mw) {
  if (!mw) return "#ccc";

  return mw > 80 ? '#084081' :
         mw > 60 ? '#0868ac' :
         mw > 40 ? '#2b8cbe' :
         mw > 20 ? '#4eb3d3' :
         mw > 10 ? '#7bccc4' :
         mw > 5  ? '#a8ddb5' :
         mw > 1  ? '#ccebc5' :
                   '#f0f9e8';
}

// OVERLAY #2: DNI (Warm Palette)
function getDNIColor(value) {
  if (!value) return "#ccc";

  return value > 4800 ? '#7f0000' :
         value > 4600 ? '#b30000' :
         value > 4400 ? '#d7301f' :
         value > 4200 ? '#ef6548' :
         value > 4000 ? '#fc8d59' :
         value > 3800 ? '#fdbb84' :
         value > 3600 ? '#fdd49e' :
                         '#fff5eb';
}

// CONTEXT LAYER: NC STATE BOUNDARY
const ncBoundary = L.geoJSON(null, {
  style: function () {
    return {
      color: "#ffffff",
      weight: 2,
      opacity: 1,
      fill: false
    };
  }
}).addTo(mymap);

const ncBoundaryHalo = L.geoJSON(null, {
  style: function () {
    return {
      color: "#d3d3d3",
      weight: 3,
      opacity: 0.6,
      fill: false
    };
  }
}).addTo(mymap);

fetch("./Data/NC_Bound.json")
  .then(res => res.json())
  .then(data => {
    ncBoundaryHalo.addData(data);
    ncBoundary.addData(data);
  });

// OVERLAY #1: EXISTING PROJECTS LAYER
const currentProjects = L.geoJSON(null, {

  style: function (feature) {
    const color = getCapacityColor(feature.properties.p_cap_ac);

    return {
      color: color,
      weight: 3,
      fillOpacity: 0.9,
      fillColor: color
    };
  },

  onEachFeature: function (feature, layer) {
    const p = feature.properties;

    if (p) {
      const popupContent = `
        <div style="font-size:14px; line-height:1.4;">
          <h3>${p.p_name || "Unknown Project"}</h3>
          <b>County:</b> ${p.p_county || "N/A"}<br>
          <b>Latitude:</b> ${p.ylat || "N/A"}<br>
          <b>Longitude:</b> ${p.xlong || "N/A"}<br>
          <b>Axis Type:</b> ${p.p_axis || "N/A"}<br>
          <b>Azimuth:</b> ${p.p_azimuth || "N/A"}<br>
          <b>Capacity (AC):</b> ${p.p_cap_ac || "N/A"} MW<br>
          <b>Capacity (DC):</b> ${p.p_cap_dc || "N/A"} MW<br>
          <b>Land Cover:</b> ${p.p_agrivolt || "N/A"}<br>
          <b>Type:</b> ${p.p_type || "N/A"}
        </div>
      `;

      layer.bindPopup(popupContent);
    }
  }
}).addTo(mymap);

fetch("./Data/uspvdb_NC.geojson")
  .then(res => res.json())
  .then(data => {
    currentProjects.addData(data);
    mymap.fitBounds(currentProjects.getBounds());
  });

// OVERLAY #2: NC DNI LAYER
const ncDNI = L.geoJSON(null, {

  style: function (feature) {
    const val = feature.properties.ANNUAL_AVG;

    return {
      color: getDNIColor(val),
      weight: 1,
      fillOpacity: 0.75,
      fillColor: getDNIColor(val)
    };
  },

  onEachFeature: function (feature, layer) {
    const val = feature.properties.ANNUAL_AVG;

    layer.bindPopup(`
      <div style="font-size:14px;">
        <b>Annual Avg DNI:</b> ${val ? val.toFixed(0) : "N/A"}
      </div>
    `);
  }
}).addTo(mymap);

fetch("./Data/NC_DNI.json")
  .then(res => res.json())
  .then(data => {
    ncDNI.addData(data);
  });

// LAYER CONTROL
const baseMaps = {
  "Dark": Stadia_StamenTonerDark,
  "Imagery": Esri_WorldImagery
};

const overlays = {
  "Existing Projects": currentProjects,
  "Solar Resource (DNI)": ncDNI
};

L.control.layers(baseMaps, overlays, { collapsed: false }).addTo(mymap);


// LEGEND FUNCTIONS
// OVERLAY #1: CAPACITY LEGEND
const capacityLegend = L.control({ position: "bottomright" });

capacityLegend.onAdd = function () {
  const div = L.DomUtil.create("div", "info legend");
  const grades = [1, 5, 10, 20, 40, 60, 80];

  div.innerHTML += "<h4>Capacity (MW)</h4>";

  for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getCapacityColor(grades[i] + 1) +
      '; width:18px; height:18px; display:inline-block; margin-right:8px;"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

// OVERLAY #2: DNI LEGEND
const dniLegend = L.control({ position: "bottomright" });

dniLegend.onAdd = function () {
  const div = L.DomUtil.create("div", "info legend");

  const grades = [3600, 3800, 4000, 4200, 4400, 4600, 4800];

  div.innerHTML += "<h4>Annual Avg DNI</h4>";

  for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + getDNIColor(grades[i] + 1) +
      '; width:18px; height:18px; display:inline-block; margin-right:8px;"></i> ' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }

  return div;
};

// DEFAULT LEGEND
capacityLegend.addTo(mymap);

// MUTUAL EXCLUSION LOGIC <--- Needs work, does not function properly
mymap.on('overlayadd', function (e) {

  if (e.layer === currentProjects) {
    mymap.removeLayer(ncDNI);
    mymap.removeControl(dniLegend);
    capacityLegend.addTo(mymap);
  }

  if (e.layer === ncDNI) {
    mymap.removeLayer(currentProjects);
    mymap.removeControl(capacityLegend);
    dniLegend.addTo(mymap);
  }
});

mymap.on('overlayremove', function (e) {

  if (e.layer === currentProjects) {
    mymap.removeControl(capacityLegend);
  }

  if (e.layer === ncDNI) {
    mymap.removeControl(dniLegend);
  }
});