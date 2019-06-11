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
    let osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxNativeZoom: 19,
        maxZoom: 22,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
            
    let map = new L.Map('map', {
        layers: [osm],
        center: new L.LatLng(59.4391796, 24.7727852),
        zoom: 19
    });
    //Routing-machine navigation
    let control = L.Routing.control({
/*         waypoints: [
            L.latLng(59.437722, 24.766717),
            L.latLng(59.438817, 24.773088)
        ], */
        routeWhileDragging: true,
        geocoder: L.Control.Geocoder.nominatim(),
        reverseWaypoints: true
    }).addTo(map);
    // This example uses a GeoJSON FeatureCollection saved to a file
    // (data.json), see the other example (live/index.html) for details on
    // fetching data using the OverpassAPI (this is also how the data in
    // data.json was generated)

    let indoorLayer = new L.Indoor(geojson_data, {
        getLevel: function(feature) { 
            if (feature.properties.relations.length === 0)
                return null;

            return feature.properties.relations[0].reltags.level;
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(JSON.stringify(feature.properties, null, 4));
        },
        style: function(feature) {
            let fill = 'white';

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

    indoorLayer.setLevel("1");

    indoorLayer.addTo(map);

    let levelControl = new L.Control.Level({
        level: "1",
        levels: indoorLayer.getLevels()
    });

    // Connect the level control to the indoor layer
    levelControl.addEventListener("levelchange", indoorLayer.setLevel, indoorLayer);
    levelControl.addTo(map);


/*     let legend = L.control({position: 'topright'});

    legend.onAdd = function(map) {
        let d = "This Leaflet plugin makes it easier to create indoor " +
                "maps. This example pulls in the data for a particular " +
                "building, and then displays it on the map, you can " +
                "change the level displayed by using the selector at " +
                "the bottom right of the map."

        let div = L.DomUtil.create('div', 'info legend');

        div.appendChild(document.createTextNode(d));

        return div;
    };

    legend.addTo(map); */

    function createButton(label, container) {
        let btn = L.DomUtil.create('button', '', container);
        btn.setAttribute('type', 'button');
        btn.innerHTML = label;
        return btn;
    }
    // Clicking on the map
    map.on('click', function(e) {
        let container = L.DomUtil.create('div'),
            startBtn = createButton('Start from this location', container),
            destBtn = createButton('Go to this location', container);
    
        L.popup()
            .setContent(container)
            .setLatLng(e.latlng)
            .openOn(map);
    
    
        L.DomEvent.on(startBtn, 'click', function() {
            control.spliceWaypoints(0, 1, e.latlng);
            map.closePopup();
        });
    
        L.DomEvent.on(destBtn, 'click', function() {
            control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
            map.closePopup();
        });    
    });

    // Embedded rotated image
    let topleft    = L.latLng(59.439379, 24.770669);
    let topright   = L.latLng(59.439830, 24.773490);
    let bottomleft = L.latLng(59.438515, 24.771007);

    let overlay = L.imageOverlay.rotated("./TLU.png", topleft, topright, bottomleft, {
        opacity: 1,
        attribution: "TLU"
    }).addTo(map);
}

