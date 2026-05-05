// === INITIALIZE MAP === //
const mymap = L.map('map', {
  center: [35.5, -79],
  zoom: 7
});

// === BASE LAYERS === //
const CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  subdomains: 'abcd',
  maxZoom: 20
}).addTo(mymap);

const Esri_WorldImagery = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles © Esri' }
);

// === MINIMAP === //
const miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");

new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false
}).addTo(mymap);

// === RESET VIEW === //
const fullExtent = [35.5, -79];
const fullZoom = 7;

L.easyButton(
  '<img src="./FPImages/globe_dark.svg" height="50%">',
  function () {
    mymap.flyTo(fullExtent, fullZoom, { duration: 2 });
  },
  "Return to world view"
).addTo(mymap);

// === COLOR FUNCTIONS === //
function getCapacityColor(mw) {
  if (!mw) return "#ccc";

  return mw > 80 ? '#084081' :
         mw > 40 ? '#2b8cbe' :
         mw > 20 ? '#4eb3d3' :
         mw > 5  ? '#a8ddb5' :
                    '#f0f9e8';
}

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

function getAspectColor(val) {
  const num = Number(val);
  if (isNaN(num)) return "#ccc";

  if (num === 1) return "#d7191c";
  if (num === 2) return "#fdae61";
  if (num === 3) return "#1a9641";

  return "#ccc";
}

function getSlopeColor(val) {
  const num = Number(val);
  if (isNaN(num)) return "#ccc";

  if (num === 1) return "#1a9641";
  if (num === 2) return "#fdae61";
  if (num === 3) return "#d7191c";

  return "#ccc";
}

// === CONTEXT LAYER: NC STATE BOUNDARY === //
const ncBoundary = L.geoJSON(null, {
  style: function () {
    return {
      color: "#ffffff",
      weight: 1,
      opacity: 1,
      fill: false
    };
  }
}).addTo(mymap);

const ncBoundaryHalo = L.geoJSON(null, {
  style: function () {
    return {
      color: "#d3d3d3",
      weight: 2,
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

// === OVERLAY #1: CAPACITY LAYER === //
const capacityPoints = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    const color = getCapacityColor(feature.properties.p_cap_ac);

    return L.circleMarker(latlng, {
      radius: 4,
      color: "#ffffff",
      weight: 1.0,
      fillColor: color,
      fillOpacity: 0.9
    });
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
          <b>Land Cover:</b> ${p.p_agrivolt || "N/A"}<br>
          <b>Type:</b> ${p.p_type || "N/A"}<br>
          <hr>
          <b>Capacity (AC):</b> ${p.p_cap_ac || "N/A"} MW<br>
          <b>Capacity (DC):</b> ${p.p_cap_dc || "N/A"} MW<br>
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  }
}).addTo(mymap);

fetch("./Data/uspvdb_Point.json")
  .then(res => res.json())
  .then(data => {
    capacityPoints.addData(data);
    capacityPoints.bringToFront();
  });

// === OVERLAY #2: NC DNI LAYER === //
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
});

fetch("./Data/NC_DNI.json")
  .then(res => res.json())
  .then(data => {
    ncDNI.addData(data);
  });

// === OVERLAY #3: ASPECT LAYER === //
const ncAspect = L.geoJSON(null, {
  style: function (feature) {
    const val = feature.id;
    return {
      color: "#333",
      weight: 1,
      fillOpacity: 0.75,
      fillColor: getAspectColor(val)
    };
  }
});

fetch("./Data/NC_Aspect.geojson")
  .then(res => res.json())
  .then(data => {
    ncAspect.addData(data);

    if (ncAspect.getBounds().isValid()) {
      map.fitBounds(ncAspect.getBounds());
    }
  });

// === OVERLAY #4: SLOPE LAYER === //
const ncSlope = L.geoJSON(null, {
  style: function (feature) {
    const val = feature.id;
    return {
      color: "#333",
      weight: 1,
      fillOpacity: 0.75,
      fillColor: getSlopeColor(val)
    };
  }
});

fetch("./Data/NC_Slope.geojson")
  .then(res => res.json())
  .then(data => {
    ncSlope.addData(data);

    if (ncSlope.getBounds().isValid()) {
      map.fitBounds(ncSlope.getBounds());
    }
  });

// === LAYER CONTROL === //
const baseMaps = {
  "Dark": CartoDB_DarkMatter,
  "Imagery": Esri_WorldImagery
};

const overlays = {
  "Existing Projects": capacityPoints,
  "Solar Resource (DNI)": ncDNI,
  "Aspect": ncAspect,
  "Slope": ncSlope
};

L.control.layers(baseMaps, overlays, { collapsed: false }).addTo(mymap);

// === LEGENDS === //
const capacityLegend = L.control({ position: "bottomright" });

capacityLegend.onAdd = function () {
  const div = L.DomUtil.create("div", "info legend");
  div.innerHTML += "<h4>Capacity (MW)</h4>";

  const breaks = [[0,5],[5,20],[20,40],[40,80]];

  breaks.forEach(b => {
    div.innerHTML +=
      '<i style="background:' + getCapacityColor(b[1]-0.01) +
      '; width:18px; height:18px; display:inline-block; margin-right:8px;"></i> ' +
      b[0] + '&ndash;' + b[1] + '<br>';
  });

  div.innerHTML +=
    '<i style="background:' + getCapacityColor(81) +
    '; width:18px; height:18px; display:inline-block; margin-right:8px;"></i> 80+';

  return div;
};

const dniLegend = L.control({ position: "bottomright" });

dniLegend.onAdd = function () {
  const div = L.DomUtil.create("div", "info legend");

  const grades = [3600,3800,4000,4200,4400,4600,4800];

  div.innerHTML += "<h4>Annual Avg DNI</h4>";

  for (let i=0;i<grades.length;i++){
    div.innerHTML +=
      '<i style="background:' + getDNIColor(grades[i]+1) +
      '; width:18px; height:18px; display:inline-block; margin-right:8px;"></i> ' +
      grades[i] + (grades[i+1] ? '&ndash;'+grades[i+1]+'<br>' : '+');
  }

  return div;
};

// === ASPECT LEGEND === //
const aspectLegend = L.control({ position: "bottomright" });

aspectLegend.onAdd = function () {
  const div = L.DomUtil.create("div", "info legend");

  div.innerHTML += "<h4>Aspect</h4>";

  div.innerHTML +=
    '<i style="background:#1a9641; width:18px; height:18px; display:inline-block; margin-right:8px;"></i> Ideal (S, SE)<br>' +
    '<i style="background:#fdae61; width:18px; height:18px; display:inline-block; margin-right:8px;"></i> Acceptable (E, NW, W, SW)<br>' +
    '<i style="background:#d7191c; width:18px; height:18px; display:inline-block; margin-right:8px;"></i> Avoid (N, NE)';

  return div;
};

// === SLOPE LEGEND === //
const slopeLegend = L.control({ position: "bottomright" });

slopeLegend.onAdd = function () {
  const div = L.DomUtil.create("div", "info legend");

  div.innerHTML += "<h4>Slope</h4>";

  div.innerHTML +=
    '<i style="background:#1a9641; width:18px; height:18px; display:inline-block; margin-right:8px;"></i> Ideal (0-5%<br>' +
    '<i style="background:#fdae61; width:18px; height:18px; display:inline-block; margin-right:8px;"></i> Acceptable (5-15%)<br>' +
    '<i style="background:#d7191c; width:18px; height:18px; display:inline-block; margin-right:8px;"></i> Avoid (15%+)';

  return div;
};

// DEFAULT LEGEND ON LOAD
capacityLegend.addTo(mymap);

// === LEGEND CONTROL === //
function clearLegends() {
  mymap.removeControl(capacityLegend);
  mymap.removeControl(dniLegend);
  mymap.removeControl(aspectLegend);
  mymap.removeControl(slopeLegend);
}

function removeOtherLayers(activeLayer) {
  const layers = [capacityPoints, ncDNI, ncAspect, ncSlope];

  layers.forEach(layer => {
    if (layer !== activeLayer && mymap.hasLayer(layer)) {
      mymap.removeLayer(layer);
    }
  });
}

mymap.on('overlayadd', function (e) {

  removeOtherLayers(e.layer);
  clearLegends();

  if (e.layer === capacityPoints) capacityLegend.addTo(mymap);
  if (e.layer === ncDNI) dniLegend.addTo(mymap);
  if (e.layer === ncAspect) aspectLegend.addTo(mymap);
  if (e.layer === ncSlope) slopeLegend.addTo(mymap);
});

mymap.on('overlayremove', function () {
  clearLegends();
});