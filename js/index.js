/* jshint esversion:6 */
let roomColor = "transparent";
let roomBorderColor = "#b91233";
let foundRoomBorderColor = "#12b998";


let rooms = [];
let indoorLayer;
let map;
let levelControl;
let previouslyFoundRoom = 0;
let previouslyFoundRoomLevel = 0;

let defaultZoom = -3;
let clickToCopy = false; // Set to true to copy coordinates when clicked on the map
let dataFile = null;
let overlayImage;
let imageBounds;
loadJson("data.json");
createMap();
autocomplete(document.querySelector("#from"), rooms);
autocomplete(document.querySelector("#to"), rooms);
$('#toggleToCopy').on('click', toggleCopy);
levelControl.addEventListener("levelchange", function () {
  changeMap();
});

function loadJson(fileName) {
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
  }).setView([2500, 2500], defaultZoom);

  indoorLayer = new L.Indoor(dataFile, {
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
      return {
        fillColor: roomColor,
        weight: 2,
        color: roomBorderColor,
        fillOpacity: 1
      };
    }
  });

  indoorLayer.setLevel("4");
  indoorLayer.addTo(map);

  levelControl = new L.Control.Level({
    level: "4",
    levels: indoorLayer.getLevels()
  });

  // Connect the level control to the indoor layer
  levelControl.addEventListener("levelchange", indoorLayer.setLevel, indoorLayer);
  levelControl.addTo(map);
  map.doubleClickZoom.disable(); // Double click to zoom can be misleading - disabling it

  // Embedded image
  imageBounds = [[0, 0],[5000, 5000]];
  overlayImage = L.imageOverlay("./images/TLU_" + indoorLayer.getLevel() + ".jpg", imageBounds).addTo(map);
  map.fitBounds(imageBounds);
  // Clicking on the map to copy coordinates - enable checkbox on the map
  map.on('click', function (e) {
    if (clickToCopy == true) {
      let coordinates = e.latlng.lng + '&' + e.latlng.lat + '|';
      console.log(coordinates);
      navigator.clipboard.writeText(coordinates);
    }
  });
}

function toggleCopy() {
  let checkBox = document.getElementById("toggleToCopy");
  if (checkBox.checked == true) {
    if (confirm("Kas oled kindel, et soovid aktiveerida koordinaatide kopeerimisrežiimi?") == true) {
      clickToCopy = true;
    } else {
      checkBox.checked = false;
    }
  } else {
    clickToCopy = false;
  }
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
    overwriteLastLayerBorder();
    map.setView([2500, 2500], defaultZoom);
  }
}

function searchRoomByName(tempName) {
    let index = -1;
    if(previouslyFoundRoom != 0){
        overwriteLastLayerBorder();
    }
    for (let i = 0; i < dataFile.features.length; i++) {
        if (dataFile.features[i].properties.tags.name == tempName) {
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
            map._layers[previouslyFoundRoom].options.color = roomBorderColor;
        }
        setResultFloor(index);
        Object.keys(map._layers).forEach(function (item) { // Look for the room by search
            if (map._layers[item].feature) {

                if (map._layers[item].feature.properties.tags.name == tempName) {
                    previouslyFoundRoom = item;
                    previouslyFoundRoomLevel = map._layers[item].feature.properties.relations[0].reltags.level;
                    map._layers[item].options.color = foundRoomBorderColor;

                } else {
                    if (map._layers[item].options.color == foundRoomBorderColor) {
                        map._layers[item].options.color = roomBorderColor;
                    }
                }
            }
        });
        setResultFloor(index);
    }
}

function overwriteLastLayerBorder() {
  if (previouslyFoundRoom != 0) {
    let floor = indoorLayer.getLevel();
    if (floor != previouslyFoundRoomLevel) {
      indoorLayer.setLevel(previouslyFoundRoomLevel);
      map._layers[previouslyFoundRoom].options.color = roomBorderColor;
      indoorLayer.setLevel(floor);
    } else {
      map._layers[previouslyFoundRoom].options.color = roomBorderColor;
      indoorLayer.setLevel(indoorLayer.getLevels[0]);
      indoorLayer.setLevel(floor);
    }
    previouslyFoundRoom = 0;
    previouslyFoundRoomLevel = 0;
  }
}

function changeColorBlack(id) {
  document.querySelector(id).style.color = "black";
  document.querySelector(id).removeEventListener('click', function () {});
}

function setResultFloor(index) {
  if (indoorLayer._level != dataFile.features[index].properties.relations[0].reltags.level) {
    levelControl.toggleLevel(dataFile.features[index].properties.relations[0].reltags.level);
  } else {
    levelControl.toggleLevel(indoorLayer.getLevels()[0]);
    levelControl.toggleLevel(dataFile.features[index].properties.relations[0].reltags.level);
  }
}

function swapNames() {
  let from = document.querySelector("#from").value;
  let to = document.querySelector("#to").value;
  let temp = from;
  document.querySelector("#from").value = to;
  document.querySelector("#to").value = temp;
}

function changeMap() {
  let picFloor = indoorLayer.getLevel();
  map.removeLayer(overlayImage);
  if (picFloor == null) {
    overlayImage = L.imageOverlay("./images/TLU.jpg", imageBounds).addTo(map);
  } else {
    overlayImage = L.imageOverlay("./images/TLU_" + picFloor + ".jpg", imageBounds).addTo(map);
  }
}
