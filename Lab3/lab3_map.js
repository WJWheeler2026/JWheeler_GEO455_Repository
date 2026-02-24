const map = L.map("map").setView([37.50398970138038, 22.25648543213865], 13);
var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 8,
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
}).addTo(map);

var myIcon1 = L.icon({
    iconUrl: "images/icon_1.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28]
});
var myIcon2 = L.icon({
    iconUrl: "images/icon_2.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28]
});
var myIcon3 = L.icon({
    iconUrl: "images/icon_3.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28]
});
var myIcon4 = L.icon({
    iconUrl: "images/icon_4.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28]
});
var myIcon5 = L.icon({
    iconUrl: "images/icon_5.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28]
});
var myIcon6 = L.icon({
    iconUrl: 'images/icon_6.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon7 = L.icon({
    iconUrl: 'images/icon_7.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon8 = L.icon({
    iconUrl: 'images/icon_8.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon9 = L.icon({
    iconUrl: 'images/icon_9.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon10 = L.icon({
    iconUrl: 'images/icon_10.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var athens = L.marker([37.98072101, 23.7303844], {icon: myIcon1}).bindPopup("<b>Athens - One of the world's oldest, still-standing cities. Combines a mixture of modernity and antiquity. Birthplace of Hellenistic Democracy, and foster of the arts, education, and philosophy.").addTo(map);
var corinth = L.marker([37.9375731,22.93139754], {icon: myIcon2}).bindPopup("<b>Corinth - A modern city located at the throat of the Pelopponese region of Greece, adopting the namesake of the long detroyed ancient city.").addTo(map);
var aigio = L.marker([38.25036002,22.08270479], {icon: myIcon3}).bindPopup("<b>Aigio - Second-largest city in Achaea, named after its ancient predecesor: Aegium. Comfortable seaside town along the Gulf of Corinth.").addTo(map);
var patras = L.marker([38.24718589,21.73915314], {icon: myIcon4}).bindPopup("<b>Patras - Regional capital of Western Greece and the largest city in Achaea. Serves as a major hub to the rest of Europe to the west, as well as a major scientific research center. Hosts one of Europe's largest carnivals every February, including balls and galas, floats and parades, and so on.").addTo(map);
var sami = L.marker([38.25151372,20.64742312], {icon: myIcon5}).bindPopup("<b>Sami - Comfortable seaside town with a great view of the Island of Ithaca, alleged home of the legendary figure, Odysseus.").addTo(map);
var zakinthos = L.marker([37.78426809,20.89443145], {icon: myIcon6}).bindPopup("<b>Zakinthos - Popular seaside destination in the Ionian Island chain. Alternately named: The Flower of the East.").addTo(map);
var kalamata = L.marker([37.0409113,22.11536187], {icon: myIcon7}).bindPopup("<b>Kalamata - Modern city with archaic remnants of old Kalamata, second largest city in the Pelopponese. Famous for dishes containing olives that share the name of the city.").addTo(map);
var sparti = L.marker([37.07417528,22.42988583], {icon: myIcon8}).bindPopup("<b>Sparti - A modern town built on the grounds where ancient Sparta existed. Small, quiet scene with a mountainous backdrop, nice for a simple, slow stay. Old ruins dot the hills around the town.").addTo(map);
var neapoli = L.marker([36.51332766,23.05880839], {icon: myIcon9}).bindPopup("<b>Neapoli Voion - Comfortable seaside town which provides easy access to islands south of the Pelopponese.").addTo(map);
var kithira = L.marker([36.25022804,22.99673301], {icon: myIcon10}).bindPopup("<b>Kithira Island - Located between the Pelopponese to its north and Crete to its south, Kithira serves as a quiet island destination that is easy to get to. Initially home to the Temple of Aphrodite.").addTo(map);
