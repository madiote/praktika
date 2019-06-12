/* jshint esversion:6 */
let rooms = [];
let indoorLayer;
let map, levelControl;
let searchMarker;
let searchBool = false;

window.onload = function () {
    forceHttps();
    createMap();
    autocomplete(document.querySelector("#from"), rooms);
    autocomplete(document.querySelector("#to"), rooms);
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

    map = new L.Map('map', {
        layers: [osm],
        center: new L.LatLng(59.4391796, 24.7727852),
        zoom: 19
    });

    indoorLayer = new L.Indoor(geojson_data, {
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

            layer.bindPopup(roomInfo);
            layer.bindTooltip(replaceQuotes(JSON.stringify(feature.properties.tags.name))); //Lisab info

            rooms.push(replaceQuotes(JSON.stringify(feature.properties.tags.name)));
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

    levelControl = new L.Control.Level({
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
        let legendTxt = '<div class="autocomplete"><input type="text" id="from" placeholder="Algus"><br>' + 
                        '<img src="./images/swap.svg" alt="Vaheta lahtrit" id="swap" class="swap-thumb" style="width: 20px; transform: rotate(90deg);"onclick="swapNames()"></img>' +
                        '<input type="text" id ="to" placeholder="Lõpp"></div><br>' +
                        '<img src="./images/search.svg" alt="Otsi" id="search" class="legend-thumb" style="width: 20px;"onclick="searchRoom()"></img>' +
                        '<img src="./images/navigate.svg" alt="Navigeeri" id="swap" class="legend-thumb" style="width: 20px;"onclick="navigateToDestination()"></img>';
        let div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = legendTxt;
        return div;
    };
    legend.addTo(map);
    // Clicking on the map
    map.on('click', function (e) {
        let coordinates = '[' + e.latlng.lng + ', ' + e.latlng.lat + ']';
        console.log(coordinates);
        navigator.clipboard.writeText(coordinates); // kordinaatide copymine
    });
    // Embedded rotated image
    let topleft = L.latLng(59.439379, 24.770669);
    let topright = L.latLng(59.439830, 24.773490);
    let bottomleft = L.latLng(59.438515, 24.771007);

    let overlay = L.imageOverlay.rotated("./images/TLU.png", topleft, topright, bottomleft, {
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

function autocomplete(inp, arr) {
    let currentFocus;
    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function searchRoom() {
    let from = document.querySelector("#from").value;
    let to = document.querySelector("#to").value;
    if(from != "" || to != ""){
        if(from != "" && to != ""){
            searchRoomByName(from);
        } else {
            if(from != ""){
                searchRoomByName(from);
            } else {
                searchRoomByName(to);
            }
        }
    } else {
        //zoom out
        
    }
}
function searchRoomByName(tempName) {
    let index = -1;

    for (let i = 0; i < geojson_data.features.length; i++) {
        if(geojson_data.features[i].properties.tags.name == tempName){
            console.log("leidsin");
            index = i;
        } 
    }
    if(index == -1){
        console.log("Ruumi ei leitud");
        
    } else {
        let lati = geojson_data.features[index].geometry.coordinates[0][0][0];
        let long = geojson_data.features[index].geometry.coordinates[0][0][1];
        Object.keys(indoorLayer._map._layers).forEach(function (item) {
            
            if (indoorLayer._map._layers[item].feature) {
                console.log(indoorLayer._map._layers[item].feature);
                if(indoorLayer._map._layers[item].feature.properties.tags.name == tempName){
                    indoorLayer._map._layers[item].options.fillColor = "blue";
                }
                
            }

        });
        if(indoorLayer._level != geojson_data.features[index].properties.relations[0].reltags.level){
            levelControl.toggleLevel(geojson_data.features[index].properties.relations[0].reltags.level);
        } else {
            levelControl.toggleLevel(0);
            levelControl.toggleLevel(geojson_data.features[index].properties.relations[0].reltags.level);
        }
/*         if(searchBool == false){
            searchMarker = L.marker([long, lati]).addTo(map);
            searchBool = true;
        } else {
            map.removeLayer(searchMarker);
            searchMarker = L.marker([long, lati]).addTo(map);
        } */
    }
}

function swapNames() {
    indoorLayer._map._layers[59].options.fillColor = "blue";
    levelControl.toggleLevel(0);
    levelControl.toggleLevel(1);
    let from = document.querySelector("#from").value;
    let to = document.querySelector("#to").value;
    let temp = from;
    document.querySelector("#from").value = to;
    document.querySelector("#to").value = temp;
}
