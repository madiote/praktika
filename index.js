/* jshint esversion:6 */

window.onload = function () {
    forceHttps();
    createMap();
};

function forceHttps() {
    if (window.location.href.indexOf("greeny.cs.tlu.ee") != -1 || window.location.href.indexOf("www.tlu.ee") != -1) {
        if (location.protocol == 'http:') {
            location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
        }
    }
}
function createMap(){

    // Create the map
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxNativeZoom: 19,
        maxZoom: 22,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
            
    var map = new L.Map('map', {
        layers: [osm],
        center: new L.LatLng(59.4391796, 24.7727852),
        zoom: 19
    });

    // This example uses a GeoJSON FeatureCollection saved to a file
    // (data.json), see the other example (live/index.html) for details on
    // fetching data using the OverpassAPI (this is also how the data in
    // data.json was generated)

    var indoorLayer = new L.Indoor(geojson_data, {
        getLevel: function(feature) { 
            if (feature.properties.relations.length === 0)
                return null;

            return feature.properties.relations[0].reltags.level;
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(JSON.stringify(feature.properties, null, 4));
        },
        style: function(feature) {
            var fill = 'white';

            if (feature.properties.tags.buildingpart === 'corridor') {
                fill = '#169EC6';
            } else if (feature.properties.tags.buildingpart === 'verticalpassage') {
                fill = '#0A485B';
            }

            return {
                fillColor: fill,
                weight: 1,
                color: '#666',
                fillOpacity: 1
            };
        }
    });

    indoorLayer.setLevel("0");

    indoorLayer.addTo(map);

    var levelControl = new L.Control.Level({
        level: "0",
        levels: indoorLayer.getLevels()
    });

    // Connect the level control to the indoor layer
    levelControl.addEventListener("levelchange", indoorLayer.setLevel, indoorLayer);

    levelControl.addTo(map);


    var legend = L.control({position: 'topright'});

    legend.onAdd = function(map) {
        var d = "This Leaflet plugin makes it easier to create indoor " +
                "maps. This example pulls in the data for a particular " +
                "building, and then displays it on the map, you can " +
                "change the level displayed by using the selector at " +
                "the bottom right of the map."

        var div = L.DomUtil.create('div', 'info legend');

        div.appendChild(document.createTextNode(d));

        return div;
    };

    legend.addTo(map);
}

