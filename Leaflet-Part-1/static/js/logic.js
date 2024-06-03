// Create the object for the map
var earthQuake = L.map("map", {
    center: [39.7875, -111.9826667],
    zoom: 6
  });
  
  // Add tile layer to map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(earthQuake);
  
  // Set variable for url as constant
  const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  
  // Create function using url and iterate through rows of data
  d3.json(url).then(function(data) {
  
      for (let i = 0; i < data.features.length; i++) {
  
          var quake_lan = data.features[i].geometry.coordinates[1];
          var quake_lon = data.features[i].geometry.coordinates[0];
          var quake_mag = data.features[i].properties.mag;
          var quake_depth = data.features[i].geometry.coordinates[2]
  
          var cfillColor = [];
          var cradius = 10000 * quake_mag;
  
          if (quake_depth <= 10 & quake_depth > -10) {
              cfillColor = '#FFFF33';
              }
          else if (quake_depth <= 30 & quake_depth > 10) {
              cfillColor = '#FFA500';
              }
          else if (quake_depth <= 50 & quake_depth > 30) {
              cfillColor = '#FF6700';
              }
          else if (quake_depth <= 70 & quake_depth > 50) {
              cfillColor = '#F62217';
              }
          else if (quake_depth <= 90 & quake_depth > 70) {
              cfillColor = '#C21E56';
              }
          else if (quake_depth > 90) {
              cfillColor = '#2E1A47';
          };
  
          var bub = L.circle([quake_lan, quake_lon], {
              color: cfillColor,
              weight: 1,
              fillColor: cfillColor,
              fillOpacity: 0.7,
              radius: cradius,
          }).addTo(earthQuake);
  
          var graph = '<p>' + "Magnitude: " + quake_mag +'</p>'
                  + '<p>'+ "Coordinates: " + quake_lan + "," + quake_lon + '</p>'
                  + '<p>'+ "Earthquake Depth: " + quake_depth + "km" + '</p>';
  
          bub.bindPopup(graph);
      };
  });
  
  // Create color legend for map
  
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
      var div = L.DomUtil.create('div', 'legend');
      div.innerHTML += "Earthquake<br>";
      div.innerHTML += "Depth(km)<br>";
      div.innerHTML += '<i style="background: #FFFF33"></i><span>-10-10</span><br>';
      div.innerHTML += '<i style="background: #FFA500"></i><span>10-30</span><br>';
      div.innerHTML += '<i style="background: #FF6700"></i><span>30-50</span><br>';
      div.innerHTML += '<i style="background: #F62217"></i><span>50-70</span><br>';
      div.innerHTML += '<i style="background: #C21E56"></i><span>70-90</span><br>';
      div.innerHTML += '<i style="background: #2E1A47"></i><span>90+</span><br>'
      return div;
  };
  
  legend.addTo(earthQuake)