/*jshint esversion: 6*/

let coordinates_2 = [];
let coordinates;

// Numbers are needed for moving across the array structure
let reltags;
let relations_2;
let relations;
let tags;
let properties_1;
let geometry_1;
let allArrays;
let features;
let geojson;

let roomRegex = RegExp("^[A-Z]+(\\d)\\d+$");

$(document).one('pageinit', function () {
  let roomProperties;
  showProperties();
  $('#submitAddRooms').on('tap', addRoomProperties);
  $('#roomProperties').on('tap', '#editRoomLink', setCurrentRooms);
  $('#submitRoomEdit').on('tap', editRoomProperties);
  $('#roomProperties').on('tap', '#deleteRoomLink', deleteRoomProperties);
  $('#deleteRoomsButton').on('tap', deleteAllRooms);
  $('#downloadRoomsButton').on('tap', defineRoomData);
  $('#uploadRoomsButton').on('change', showRoomFile);
  $('#downloadRoomsToFolder').on('tap', uploadRoomsToFolder);


  // Parse the file
  function showRoomFile() {
    let file = document.querySelector('#uploadRoomsButton').files[0];
    let reader = new FileReader();
    let textFile = /text.*/;
    let coordinates;
    let room;
    let people;
    let purpose;
    let seats;
    let comments;
    let property = {};

    if (file) {
      reader.onload = function (event) {
        let file = event.target.result;
        file = JSON.parse(file);
        roomProperties = getRoomProperties();
        for (let i = 0; i < file.features.length; i++) {
          coordinates = "";
          for (let j = 0; j < file.features[i].geometry.coordinates[0].length; j++) {
            if(j!=0){ coordinates+="|";}
            coordinates += file.features[i].geometry.coordinates[0][j][0] + "&" + file.features[i].geometry.coordinates[0][j][1];
            console.log(coordinates);
          }
          room = file.features[i].properties.tags.name;
          people = file.features[i].properties.users;
          purpose = file.features[i].properties.purpose;
          seats = file.features[i].properties.seats;
          comments = file.features[i].properties.meta;

          property = {
            coordinates: coordinates,
            room: room,
            people: people,
            purpose: purpose,
            seats: seats,
            comments: comments
          };
          roomProperties.push(property);
        }
        localStorage.setItem('roomProperties', JSON.stringify(roomProperties));
        console.log(roomProperties);

        return false;
      };
      window.location.href = "ruumihaldus.php";
      reader.readAsText(file);
    }
  }
  // Download the file
  function download(blob, name) {
    let url = URL.createObjectURL(blob),
    anch = document.createElement("a");
    anch.href = url;
    anch.download = name;
    let ev = new MouseEvent("click", {});
    anch.dispatchEvent(ev);
  }
  function defineJSON(){
    let data = "";

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    if (roomProperties != "" && roomProperties != null) {
      features = [allArrays];
      geojson = {
        type: "FeatureCollection",
        features
      };
      let coordinates_3;
      let pairOfCoordinates;
      for (let i = 0; i < roomProperties.length; i++) {

        let p = roomProperties[i];
        let regexArray = roomRegex.exec(p.room);
        reltags = {
          level: regexArray[1],
          type: "level"
        };
        relations_2 = {
          role: "buildingpart",
          reltags: reltags
        };
        relations = [relations_2];
        tags = {
          buildingpart: "room",
          name: p.room
        };
        properties_1 = {
          type: "Feature",
          id: i,
          floor: regexArray[1],
          meta: p.comments,
          purpose: p.purpose,
          users: p.people,
          seats: p.seats,
          tags: tags,
          relations: relations
        };
        allArrays = {
          geometry: geometry_1,
          properties: properties_1
        };
        let amountOfCoordinates = p.coordinates.split("|");
        coordinates_2 = [];
        for (let j = 0; j < amountOfCoordinates.length; j++) {
          pairOfCoordinates = amountOfCoordinates[j].split("&");
          coordinates_3 = [Number.parseFloat(pairOfCoordinates[0]), Number.parseFloat(pairOfCoordinates[1])];
          coordinates_2.push(coordinates_3);
        }
        coordinates = [coordinates_2];
        geometry_1 = {
          type: "Polygon",
          coordinates: coordinates
        };
        let test = {
          geometry: geometry_1,
          properties: properties_1,
          type: "Feature"
        };
        features.push(test);
      }
      geojson.features.shift();
      data += JSON.stringify(geojson);
    }
    return data;
  }
  function uploadRoomsToFolder(){
    let data = defineJSON();
    if (confirm("Kas oled kindel, et soovid kõik ruumide andmed avaliku serveri kaardil üle kirjutada?") == true){
      $.post("../php/upload.php", {json : data, path : 'data.json'});
      window.location.href = "ruumihaldus.php";
    }
  }
  function defineRoomData() {
    let data = defineJSON();
    let blob = new Blob([data], {
      type: "text/plain"
    });
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    download(blob, today + '_RUUMID' + ".json");
    window.location.href = "ruumihaldus.php";
    alert("Laed alla tekstifaili sisuga " + data);
  }
  /* DELETE */
  function deleteAllRooms() {
    if (confirm("Kas oled kindel, et soovid kõik ruumide andmed kustutada?\n(Enne kustutamist soovitame alla laadida hetke ruumid!)") == true) {
      localStorage.removeItem("roomProperties");
      window.location.href = "ruumihaldus.php";
      setTimeout(function () {
        location.reload();
      }, 10);
    }
  }
  function deleteRoomProperties() {
    if(confirm("Kas oled kindel?")==true){
      let l = localStorage;
      l.setItem('currentRoomCoordinates', $(this).data('coordinates'));
      l.setItem('currentRoom', $(this).data('room'));
      l.setItem('currentPeople', $(this).data('people'));
      l.setItem('currentPurpose', $(this).data('purpose'));
      l.setItem('currentSeats', $(this).data('seats'));
      l.setItem('currentComments', $(this).data('comments'));

      let currentRoomCoordinates = l.getItem('currentRoomCoordinates');
      let currentRoom = l.getItem('currentRoom');
      let currentPurpose = l.getItem('currentPurpose');
      let currentPeople = l.getItem('currentPeople');
      let currentSeats = l.getItem('currentSeats');
      let currentComments = l.getItem('currentComments');

      for (let i = 0; i < roomProperties.length; i++) {
        let p = roomProperties[i];
        if (p.coordinates == currentRoomCoordinates && p.room == currentRoom && p.purpose == currentPurpose && p.people == currentPeople && p.seats == currentSeats && p.comments == currentComments) {
          roomProperties.splice(i, 1);
        }
        l.setItem('roomProperties', JSON.stringify(roomProperties));
      }
      alert("Ruum kustutatud!");
      window.location.href = "ruumihaldus.php";
      return false;
    }else{
      alert("Ruumi ei kustutatud!");
    }
  }
  // Edit properties - room and set the properties in the editing window
  function editRoomProperties() {
    let l = localStorage;
    let currentRoomCoordinates = l.getItem('currentRoomCoordinates');
    let currentRoom = l.getItem('currentRoom');
    let currentPurpose = l.getItem('currentPurpose');
    let currentPeople = l.getItem('currentPeople');
    let currentSeats = l.getItem('currentSeats');
    let currentComments = l.getItem('currentComments');

    for (let i = 0; i < roomProperties.length; i++) {
      let p = roomProperties[i];
      if (p.coordinates == currentRoomCoordinates && p.room == currentRoom && p.purpose == currentPurpose && p.people == currentPeople && p.seats == currentSeats && p.comments == currentComments) {
        roomProperties.splice(i, 1);
      }
      localStorage.setItem('roomProperties', JSON.stringify(roomProperties));
    }
    let coordinates = $('#editRoomCoordinates').val();
    let room = $('#editRoom').val();
    let people = $('#editPeople').val();
    let purpose = $('#editPurpose').val();
    let seats = $('#editSeats').val();
    let comments = $('#editComments').val();

    let update_RoomProperty = {
      coordinates: coordinates,
      room: room,
      people: people,
      purpose: purpose,
      seats: seats,
      comments: comments
    };
    roomProperties.push(update_RoomProperty);
    alert("Ruum muudetud!");
    localStorage.setItem('roomProperties', JSON.stringify(roomProperties));
    window.location.href = "ruumihaldus.php";
    return false;
  }
  function setCurrentRooms() {
    let l = localStorage;
    l.setItem('currentRoomCoordinates', $(this).data('coordinates'));
    l.setItem('currentRoom', $(this).data('room'));
    l.setItem('currentPeople', $(this).data('people'));
    l.setItem('currentPurpose', $(this).data('purpose'));
    l.setItem('currentSeats', $(this).data('seats'));
    l.setItem('currentComments', $(this).data('comments'));

    $('#editRoomCoordinates').val(l.getItem('currentRoomCoordinates'));
    $('#editRoom').val(l.getItem('currentRoom'));
    $('#editPeople').val(l.getItem('currentPeople'));
    $('#editPurpose').val(l.getItem('currentPurpose'));
    $('#editSeats').val(l.getItem('currentSeats'));
    $('#editComments').val(l.getItem('currentComments'));
  }
  // Add properties - room
  function addRoomProperties() {
    let coordinates = $('#addClassCoordinates').val();
    let room = $('#addClassRoom').val();
    let people = $('#addClassPeople').val();
    let purpose = $('#addClassPurpose').val();
    let seats = $('#addClassSeats').val();
    let comments = $('#addClassComments').val();

    let property = {
      coordinates: coordinates,
      room: room,
      people: people,
      purpose: purpose,
      seats: seats,
      comments: comments
    };

    roomProperties = [];
    roomProperties = getRoomProperties();

    if(!roomRegex.test(room)){
      alert("Ruum ei vasta tingimustele! (Üks täht ja numbrid)");
      window.location.href = "ruumihaldus.php#addRoom";
    }
    else {
      roomProperties.push(property);
      alert("Ruum lisatud");
      localStorage.setItem('roomProperties', JSON.stringify(roomProperties));
  
      window.location.href = "ruumihaldus.php";
      return false;
    }
  }
  // Ask for properties - room
  function getRoomProperties() {
    let currentRoomProperties = localStorage.getItem('roomProperties');

    if (currentRoomProperties != null) {
      roomProperties = JSON.parse(currentRoomProperties);
    } else {
      roomProperties = [];
    }
    if (roomProperties != null) {
      return roomProperties.sort();
    }
  }
  // Show properties - room
  function showProperties() {
    roomProperties = getRoomProperties();
    if (roomProperties != "" && roomProperties != null) {
      for (let i = 0; i < roomProperties.length; i++) {
        let p = roomProperties[i];
        $("#roomProperties").append('<li class="ui-body-inherit ui-li-static">' + p.coordinates + '<br>' + p.room +
          '<br>' + p.people + '<br>' + p.purpose + '<br>' + p.seats + '<br>' + p.comments +
          /*EDIT */
          '<div class="controls"><a href="#editRoomPage" id="editRoomLink" data-coordinates="' + p.coordinates + '"data-room="' + p.room +
          '" data-people="' + p.people + '" data-purpose="' + p.purpose + '" data-seats="' + p.seats + '" data-comments="' + p.comments +
          /* DELETE */
          '">Muuda</a> | <a href="#" id="deleteRoomLink" data-coordinates="' + p.coordinates + '"data-room="' + p.room +
          '" data-people="' + p.people + '"data-purpose="' + p.purpose + '" data-seats="' + p.seats + '" data-comments="' + p.comments +
          '">Kustuta</a></div></li>');
      }
    }
  }
});

