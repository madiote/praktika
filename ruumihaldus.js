/*jshint esversion: 6*/
$(document).one('pageinit', function () {
  let properties;
  showProperties();
  $('#submitAdd').on('tap', addRoomProperties);
  $('#properties').on('tap', '#editLink', setCurrent);
  $('#submitEdit').on('tap', editProperties);
  $('#properties').on('tap', '#deleteLink', deleteProperties);

  $('#downloadButton').on('tap', redirect);
  $('#deleteButton').on('tap', deleteAll);
  $('#uploadButton').on('change', showFile);

  //document.getElementById('uploadButton').addEventListener('change', getFile);

  function myfunction() {
    console.log(this.fileContent);
  }
  /*  NÄITA FAILI */

  function showFile() {
    let file = document.querySelector('input[type=file]').files[0];
    let reader = new FileReader();
    let textFile = /text.*/;

    if (file) {
      reader.onload = function (event) {
        //let fileContent = event.target.result;
        let file = event.target.result;
        let allLines = file.split(/\r\n|\n/);

        allLines.forEach((line) => {
          if (line != "") {
            eachElement = line.split(";");
            let coordinates = eachElement[0];
            let room = eachElement[1];
            let people = eachElement[2];
            let purpose = eachElement[3];
            let seats = eachElement[4];
            let comments = eachElement[5];


            let property = {
              coordinates: coordinates,
              room: room,
              people: people,
              purpose: purpose,
              seats: seats,
              comments: comments
            };
            //properties =[];
            properties = getRoomProperties();
            properties.push(property);
            localStorage.setItem('properties', JSON.stringify(properties));
            //window.location.href = "ruumihaldus.html";
            return false;
          }

        });
      };
    }
    window.location.href = "ruumihaldus.html";
    reader.readAsText(file);
  }

  /* SALVESTA FAIL*/

  function download(blob, name) {
    let url = URL.createObjectURL(blob),
      anch = document.createElement("a");
    anch.href = url;
    anch.download = name;
    let ev = new MouseEvent("click", {});
    anch.dispatchEvent(ev);
  }

  function redirect() {
    // muuda nii et laed alla kogu info mis on kuvatud nagu ta oli selles todo kodutöös
    let classCoordinates;
    let classRoom;
    let classPeople;
    let classPurpose;
    let classSeats;
    let classComments;
    let data = "\n";

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    if (properties != "" && properties != null) {

      for (let i = 0; i < properties.length; i++) {
        let p = properties[i];
        data += String(p.coordinates) + "; " + String(p.room) + "; " + String(p.people) + "; " + String(p.purpose) +
          "; " + String(p.seats) + "; " + String(p.comments) + "; " + "\n";
      }
    } else {
      console.log("Tühi");
    }
    let blob = new Blob([data], {
      type: "text/plain"
    });
    download(blob, "" + '' + today + '' + ".txt");
    window.location.href = "ruumihaldus.html";
    alert("Laed alla tekstifaili sisuga " + data);
  }

  /* KUSTUTA */
  function deleteAll() {
    if (confirm("Kas oled kindel, et soovid kõik ruumid kustutada?\n(Enne kustutamist soovitame alla laadida hetke ruumid!)") == true) {
      localStorage.clear();
      window.location.href = "ruumihaldus.html";
    }
  }

  function deleteProperties() {
    localStorage.setItem('currentCoordinates', $(this).data('coordinates'));
    localStorage.setItem('currentRoom', $(this).data('room'));
    localStorage.setItem('currentPeople', $(this).data('people'));
    localStorage.setItem('currentPurpose', $(this).data('purpose'));
    localStorage.setItem('currentSeats', $(this).data('seats'));
    localStorage.setItem('currentComments', $(this).data('comments'));


    let currentCoordinates = localStorage.getItem('currentCoordinates');
    let currentRoom = localStorage.getItem('currentRoom');
    let currentPurpose = localStorage.getItem('currentPurpose');
    let currentPeople = localStorage.getItem('currentPeople');
    let currentSeats = localStorage.getItem('currentSeats');
    let currentComments = localStorage.getItem('currentComments');

    for (let i = 0; i < properties.length; i++) {
      let p = properties[i];
      if (p.coordinates == currentCoordinates && p.room == currentRoom && p.purpose == currentPurpose && p.people == currentPeople && p.seats == currentSeats && p.comments == currentComments) {
        properties.splice(i, 1);
        console.log("deleted");
      }
      localStorage.setItem('properties', JSON.stringify(properties));
    }

    alert("Ruum kustutatud!");

    window.location.href = "ruumihaldus.html";
    return false;
  }

  /* MUUDA */

  function editProperties() {
    let currentCoordinates = localStorage.getItem('currentCoordinates');
    let currentRoom = localStorage.getItem('currentRoom');
    let currentPurpose = localStorage.getItem('currentPurpose');
    let currentPeople = localStorage.getItem('currentPeople');
    let currentSeats = localStorage.getItem('currentSeats');
    let currentComments = localStorage.getItem('currentComments');

    for (let i = 0; i < properties.length; i++) {
      let p = properties[i];
      if (p.coordinates == currentCoordinates && p.room == currentRoom && p.purpose == currentPurpose && p.people == currentPeople && p.seats == currentSeats && p.comments == currentComments) {
        properties.splice(i, 1);
      }
      localStorage.setItem('properties', JSON.stringify(properties));
    }
    let coordinates = $('#editCoordinates').val();
    let room = $('#editRoom').val();
    let people = $('#editPeople').val();
    let purpose = $('#editPurpose').val();
    let seats = $('#editSeats').val();
    let comments = $('#editComments').val();

    let update_property = {
      coordinates: coordinates,
      room: room,
      people: people,
      purpose: purpose,
      seats: seats,
      comments: comments
    };
    properties.push(update_property);
    alert("Ruum muudetud!");
    localStorage.setItem('properties', JSON.stringify(properties));
    window.location.href = "ruumihaldus.html";
    return false;
  }

  function setCurrent() {
    localStorage.setItem('currentCoordinates', $(this).data('coordinates'));
    localStorage.setItem('currentRoom', $(this).data('room'));
    localStorage.setItem('currentPeople', $(this).data('people'));
    localStorage.setItem('currentPurpose', $(this).data('purpose'));
    localStorage.setItem('currentSeats', $(this).data('seats'));
    localStorage.setItem('currentComments', $(this).data('comments'));

    $('#editCoordinates').val(localStorage.getItem('currentCoordinates'));
    $('#editRoom').val(localStorage.getItem('currentRoom'));
    $('#editPeople').val(localStorage.getItem('currentPeople'));
    $('#editPurpose').val(localStorage.getItem('currentPurpose'));
    $('#editSeats').val(localStorage.getItem('currentSeats'));
    $('#editComments').val(localStorage.getItem('currentComments'));


  }

  /* RUUMI OMADUSED */

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
    properties = [];
    properties = getRoomProperties();

    properties.push(property);
    alert("Ruum lisatud");
    localStorage.setItem('properties', JSON.stringify(properties));

    window.location.href = "ruumihaldus.html";
    return false;
  }

  /* KÜSI RUUMI OMADUSED */

  function getRoomProperties() {
    let currentProperties = localStorage.getItem('properties');

    if (currentProperties != null) {
      properties = JSON.parse(currentProperties);
    } else {
      properties = [];
    }

    if (properties != null) {
      return properties.sort();
    }

  }

  /* NÄITA RUUME */

  function showProperties() {
    properties = getRoomProperties();

    if (properties != "" && properties != null) {

      for (let i = 0; i < properties.length; i++) {
        let p = properties[i];
        $("#properties").append('<li class="ui-body-inherit ui-li-static">' + p.coordinates + '<br>' + p.room +
          '<br>' + p.people + '<br>' + p.purpose + '<br>' + p.seats + '<br>' + p.comments +
          /*EDIT */
          '<div class="controls"><a href="#edit" id="editLink" data-coordinates="' + p.coordinates + '"data-room="' + p.room +
          '" data-people="' + p.people + '" data-purpose="' + p.purpose + '" data-seats="' + p.seats + '" data-comments="' + p.comments +
          /* DELETE */
          '">Muuda</a> | <a href="#" id="deleteLink" data-coordinates="' + p.coordinates + '"data-room="' + p.room +
          '" data-people="' + p.people + '"data-purpose="' + p.purpose + '" data-seats="' + p.seats + '" data-comments="' + p.comments +
          '" onclick="return confirm(\'Kas oled kindel?\')">Kustuta</a></div></li>');
      }
    }
  }
});