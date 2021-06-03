// Create initial map object
// Set longitude, latitude, and zoom level
var myMap = L.map("mapid", {
    center: [40.76, -111.89],
    zoom: 5
  });
  
  // Add a tile layer (the background map image) to the map
  // Use the addTo method to add objects to our map
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  }).addTo(myMap);

// Create URL variable
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform D3 Json request to the URL
d3.json(URL).then(function(data) {
  function markerSize(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3;
}
  // Function to Determine Style of Marker Based on the Magnitude of the Earthquake
  function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: chooseColor(feature.properties.mag),
        color: "#000000",
        radius: markerSize(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
  }
  // Function to Determine Color of Marker Based on the Magnitude of the Earthquake
  function chooseColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#ea2c2c";
      case magnitude > 4:
        return "#ea822c";
      case magnitude > 3:
        return "#ee9c00";
      case magnitude > 2:
        return "#eecc00";
      case magnitude > 1:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }
  // Create a GeoJSON Layer Containing the Features Array on the data
  L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
      },
      style: styleInfo,

      onEachFeature: function(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }
  // Add data to myMap 
  }).addTo(myMap);
  
    // Set Up Legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        magnitudeLevels = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3>Magnitude</h3>"

        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + chooseColor(magnitudeLevels[i] + 1) + '"></i> ' +
                magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add Legend to the Map
    legend.addTo(myMap);
});