const map = L.map("map").setView([38.25193, 20.64651], 13);

L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 30,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
               '<a href="https://opentopomap.org">OpenTopoMap</a>'
}).addTo(map);

L.marker([38.25193, 20.64651])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>Welcome to Sami. Enjoy the beaches and vineyards! Η Ελλάδα σε καλωσορίζει!")
  .openPopup();
