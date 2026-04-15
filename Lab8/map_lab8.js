var Stadia_StamenTonerBlacklite = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_blacklite/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

var mymap = L.map('map', {
    center: [43.09157730670122, -89.41174811804763],
    zoom: 7,
    layers: Stadia_StamenTonerBlacklite,
});  


var migrationLayer = new L.migrationLayer({
    map: mymap,
    data: data,
    pulseRadius:25,
    pulseBorderWidth:1,
    arcWidth:1,
    arcLabel:false,
    arcLabelFont:'14px sans-serif',
    maxWidth:10
});

migrationLayer.addTo(mymap);


var cities = L.geoJson(loc, {
     style: function (feature) {
        return { color: '#DCBDFF', weight: 0.7, opacity: 0.7};
    },
    onEachFeature: function(feature, featureLayer) {
        featureLayer.bindTooltip(feature.properties.NAME, {permanent: false, direction: 'right'});
    }
}).addTo(mymap);
    
mymap.fitBounds(cities.getBounds());



function hide(){
    migrationLayer.hide();
}
function show(){
    migrationLayer.show();
}
function play(){
    migrationLayer.play();
}
function pause(){
    migrationLayer.pause();
}