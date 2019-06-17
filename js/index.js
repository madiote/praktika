/* jshint esversion:6 */
let roomColor = "white";
let corridorColor = "#169EC6";
let foundColor = "blue";

let rooms = [];
let indoorLayer;
let map;
let levelControl;
let previouslyFoundRoom = 0;

let defaultZoom = -3;

let clickToCopy = false; // Set to true to copy coordinates when clicked on the map

let dataFile = null;

window.onload = function () {
    loadJson("data.json");
    createMap();
    autocomplete(document.querySelector("#from"), rooms);
    autocomplete(document.querySelector("#to"), rooms);
};
function loadJson(fileName){
    $.ajax({
        dataType: "json",
        async: false,
        url: "./json/" + fileName,
        'success': function (json) {
            dataFile = json;
        }
    });
}
function createMap() {
    // Create the map
    map = new L.Map('map', {
        minZoom: -3,
        maxZoom: 1,
        crs: L.CRS.Simple // Use non-geographical coordinates
    }).setView([2500, 2500], dataFile);

    indoorLayer = new L.Indoor(geojson_data, {
        getLevel: function (feature) {
            if (feature.properties.relations.length === 0)
                return null;

            return feature.properties.relations[0].reltags.level;
        },
        onEachFeature: function (feature, layer) {
            let roomInfo = "";
            if (feature.properties.tags.name != "") {
                roomInfo += '<h1>' + replaceQuotes(JSON.stringify(feature.properties.tags.name)) + '</h1>';
            }
            if (feature.properties.purpose != "") {
                roomInfo += '<br><b>Eesmärk:</b> ' + replaceQuotes(JSON.stringify(feature.properties.purpose));
            }
            if (feature.properties.users != "") {
                roomInfo += '<br><b>Kasutajad:</b> ' + replaceQuotes(JSON.stringify(feature.properties.users));
            }
            if (feature.properties.seats != "") {
                roomInfo += '<br><b>Istekohti:</b> ' + replaceQuotes(JSON.stringify(feature.properties.seats));
            }
            if (feature.properties.meta != "") {
                roomInfo += '<br><b>Kommentaarid:</b> ' + replaceQuotes(JSON.stringify(feature.properties.meta));
            }

            layer.bindPopup(roomInfo);
            layer.bindTooltip(replaceQuotes(JSON.stringify(feature.properties.tags.name))); //Shows tooltip on hover

            rooms.push(replaceQuotes(JSON.stringify(feature.properties.tags.name)));
        },
        style: function (feature) {
            let fill = roomColor;

            if (feature.properties.tags.buildingpart === 'corridor') {
                fill = corridorColor;
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
            '<img src="./images/swap.png" alt="Vaheta lahtrit" id="swap" class="swap-thumb" style="width: 20px; transform: rotate(90deg);"onclick="swapNames()"></img>' +
            '<input type="text" id ="to" placeholder="Lõpp"></div><br>' +
            '<img src="./images/search.png" alt="Otsi" id="search" class="legend-thumb" style="width: 20px;"onclick="searchRoom()"></img>' +
            '<img src="./images/navigate.png" alt="Navigeeri" id="swap" class="legend-thumb" style="width: 20px;"onclick="navigateToDestination()"></img>';
        let div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = legendTxt;
        return div;
    };
    legend.addTo(map);
    map.doubleClickZoom.disable(); // Double click to zoom can be misleading - disabling it

    // Clicking on the map to copy coordinates - enable boolean on the top
    map.on('click', function (e) {
        if (clickToCopy == true) {
            let coordinates = '[' + e.latlng.lng + ', ' + e.latlng.lat + ']';
            console.log(coordinates);
            navigator.clipboard.writeText(coordinates);
        }
    });

    // Embedded image
    let imageBounds = [[0, 0], [5000, 5000]];
    let overlayImage = L.imageOverlay("./images/TLU_14_06.jpg", imageBounds).addTo(map);
    map.fitBounds(imageBounds);
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
    if (from != "" || to != "") {
        if (from != "" && to != "") {
            document.querySelector("#to").value = "";
            searchRoomByName(from);
        } else {
            if (from != "") {
                searchRoomByName(from);
            } else {
                searchRoomByName(to);
            }
        }
    } else {
        map.setView([2500, 2500], defaultZoom);
    }
}

function searchRoomByName(tempName) {
    let index = -1;

    for (let i = 0; i < geojson_data.features.length; i++) {
        if (geojson_data.features[i].properties.tags.name == tempName) {
            index = i;
        }
    }
    if (index == -1) {
        let from = document.querySelector('#from');
        let to = document.querySelector('#to');
        if (from.value != "" && to.value == "") {
            from.style.color = "red";
            document.querySelector('#from').addEventListener('click', function () {
                changeColorBlack('#from');
            });
        } else if (to.value != "" && from.value == "") {
            to.style.color = "red";
            document.querySelector('#to').addEventListener('click', function () {
                changeColorBlack('#to');
            });
        } else if (to.value != "" && from.value != "") {
            from.style.color = "red";
            to.value = "";
            from.addEventListener('click', function () {
                changeColorBlack('#from');
            });
        }
    } else {
        if (previouslyFoundRoom != 0) { // Remove the color from previously found room
            map._layers[previouslyFoundRoom].options.fillColor = roomColor;
        }
        setResultFloor(index);
        Object.keys(map._layers).forEach(function (item) { // Look for the room by search
            if (map._layers[item].feature) {

                if (map._layers[item].feature.properties.tags.name == tempName) {
                    previouslyFoundRoom = item;
                    map._layers[item].options.fillColor = foundColor;

                } else {
                    if (map._layers[item].options.fillColor == foundColor) {
                        map._layers[item].options.fillColor = roomColor;
                    }
                }
            }
        });
        setResultFloor(index);
    }
}

function changeColorBlack(id) {
    document.querySelector(id).style.color = "black";
    document.querySelector(id).removeEventListener('click', function () {});
}

function setResultFloor(index) {
    if (indoorLayer._level != geojson_data.features[index].properties.relations[0].reltags.level) {
        levelControl.toggleLevel(geojson_data.features[index].properties.relations[0].reltags.level);
    } else {
        levelControl.toggleLevel(0);
        levelControl.toggleLevel(geojson_data.features[index].properties.relations[0].reltags.level);
    }
}

function swapNames() {
    let from = document.querySelector("#from").value;
    let to = document.querySelector("#to").value;
    let temp = from;
    document.querySelector("#from").value = to;
    document.querySelector("#to").value = temp;
}