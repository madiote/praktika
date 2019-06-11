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

function createMap() {
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

    let indoorLayer = new L.Indoor(geojson_data, {
        getLevel: function (feature) {
            if (feature.properties.relations.length === 0)
                return null;

            return feature.properties.relations[0].reltags.level;
        },
        onEachFeature: function (feature, layer) {
            let roomInfo = "";
            if (feature.properties.tags.name) {
                roomInfo += '<h1>' + replaceQuotes(JSON.stringify(feature.properties.tags.name)) + '</h1>';
            }
            if (feature.properties.purpose) {
                roomInfo += '<br><b>Eesmärk:</b> ' + replaceQuotes(JSON.stringify(feature.properties.purpose));
            }
            if (feature.properties.users) {
                roomInfo += '<br><b>Kasutajad:</b> ' + replaceQuotes(JSON.stringify(feature.properties.users));
            }
            if (feature.properties.seats) {
                roomInfo += '<br><b>Istekohti:</b> ' + replaceQuotes(JSON.stringify(feature.properties.seats));
            }
            if (feature.properties.meta) {
                roomInfo += '<br><b>Kommentaarid:</b> ' + replaceQuotes(JSON.stringify(feature.properties.meta));
            }

            layer.bindPopup(roomInfo); //Lisab info
        },
        style: function (feature) {
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


    let legend = L.control({
        position: 'topright'
    });

    legend.onAdd = function (map) {
        let d = 'TEKST TULEKUL';

        let div = L.DomUtil.create('div', 'info legend');

        div.appendChild(document.createTextNode(d));

        return div;
    };

    legend.addTo(map);

    // Embedded rotated image
    let topleft = L.latLng(59.439379, 24.770669);
    let topright = L.latLng(59.439830, 24.773490);
    let bottomleft = L.latLng(59.438515, 24.771007);

    let overlay = L.imageOverlay.rotated("./TLU.png", topleft, topright, bottomleft, {
        opacity: 1,
        attribution: "TLU"
    }).addTo(map);
}

function replaceQuotes(str) {
    if (str != undefined) {
        str = str.substring(1, str.length - 1);
    }
    return str;
}