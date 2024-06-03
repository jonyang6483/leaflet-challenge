//Set variables for tile layer
var streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var tGraph = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

//Only one base layer can be shown at a time.
var baseMap = {
    Street: streetMap,
    Topographic: tGraph
};

// Creating the map object
var quakeMaps = L.map("map", {
    center: [39.7875, -111.9826667],
    zoom: 5,
    layers: streetMap
});

// Set variable for url for GeoJSON data
var url1 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Pull GeoJSON data
var poly = L.geoJson().addTo(quakeMaps);

d3.json(url1).then(function(data) {
    
    poly.addData(data.features);
    poly.setStyle({color: "yellow", fill: 0})
});

var url2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Create color legend
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

legend.addTo(quakeMaps)

// Create function to set parameters for color range
function cfillcolor (data) {
    let cfillColor = ''
    if (data <= 10 & data > -10) {
        cfillColor = '#FEB24C';
        }
    else if (data <= 30 & data > 10) {
        cfillColor = '#FD8D3C';
        }
    else if (data <= 50 & data > 30) {
        cfillColor = '#FC4E2A';
        }
    else if (data <= 70 & data > 50) {
        cfillColor = '#E31A1C';
        }
    else if (data <= 90 & data > 70) {
        cfillColor = '#BD0026';
        }
    else if (data > 90) {
        cfillColor = '#7a0177';
    };
    return cfillColor
}

var clayers = L.geoJson(null, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: feature.properties.mag^10,  
            fillColor: cfillcolor(feature.geometry.coordinates[2]), 
            color: cfillcolor(feature.geometry.coordinates[2]),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup('<p>'+"Magnitude: "+feature.properties.mag+'</p>'
                        + '<p>'+ "Coordinates: "+feature.geometry.coordinates+'</p>');
    }
})




d3.json(url2).then(function(data) {

        clayers.addData(data.features);
})

var overlays = {
    Tectonic_Plates: poly,
    Earthquakes: clayers,
    
};

L.control.layers(baseMap, overlays, {
    collapsed: false
  }).addTo(quakeMaps);