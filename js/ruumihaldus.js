/*jshint esversion: 6*/
$(document).one('pageinit', function () {
  let roomProperties;
  showProperties();
  showCorridorProperties();
  $('#submitAdd').on('tap', addRoomProperties);
  $('#roomProperties').on('tap', '#editLink', setCurrentRooms);
  $('#submitEdit').on('tap', editRoomProperties);
  $('#roomProperties').on('tap', '#deleteLink', deleteRoomProperties);

  $('#submitAddCorridors').on('tap', addCorridorProperties);
  $('#corridorProperties').on('tap', '#editCorridorLink', setCurrentCorridors);
  $('#submitCorridorEdit').on('tap', editCorridorProperties);
  $('#corridorProperties').on('tap', '#deleteCorridorLink', deleteCorridorProperties);

  $('#downloadButton').on('tap', redirect);
  $('#uploadButton').on('change', showFile);

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
            //let firstCoordinate = eachElement[0].split("&");
            let room = eachElement[1];
            let people = eachElement[2];
            let purpose = eachElement[3];
            let seats = eachElement[4];
            let comments = eachElement[5];
            //console.log(firstCoordinate);

            let property = {
              coordinates: coordinates,
              room: room,
              people: people,
              purpose: purpose,
              seats: seats,
              comments: comments
            };
            roomProperties = getRoomProperties();
            roomProperties.push(property);
            localStorage.setItem('roomProperties', JSON.stringify(roomProperties));
            return false;
          }
        });
      };
    }
    window.location.href = "ruumihaldus.php";
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

    if (roomProperties != "" && roomProperties != null) {
      for (let i = 0; i < roomProperties.length; i++) {
        let p = roomProperties[i];
        data += String(p.coordinates) + "; " + String(p.room) + "; " + String(p.people) + "; " + String(p.purpose) +
          "; " + String(p.seats) + "; " + String(p.comments) + "; " + "\n";
          console.log(p.coordinates.split("&"));
      }
    } else {
      console.log("Tühi");
    }
    let blob = new Blob([data], {
      type: "text/plain"
    });
    download(blob, "" + '' + today + '' + ".txt");
    window.location.href = "ruumihaldus.php";
    alert("Laed alla tekstifaili sisuga " + data);
  }

  /* KUSTUTA */

  function deleteAll() {
    if (confirm("Kas oled kindel, et soovid kõik kustutada?\n(Enne kustutamist soovitame alla laadida hetke ruumid!)") == true) {
      localStorage.clear();
      window.location.href = "ruumihaldus.php";
    }
  }

  function deleteCorridorProperties(){
    if(confirm("Kas oled kindel?")==true){
      localStorage.setItem('currentCorridorCoordinates', $(this).data('corridorcoordinates'));
      localStorage.setItem('currentCorridorName', $(this).data('corridorname'));

      let currentCorridorCoordinates = localStorage.getItem('currentCorridorCoordinates');
      let currentCorridorName = localStorage.getItem('currentCorridorName');

      for (let i = 0; i < corridorProperties.length; i++) {
        let p = corridorProperties[i];
        if (p.corridorCoordinates == currentCorridorCoordinates && p.corridorName == currentCorridorName) {
          corridorProperties.splice(i, 1);
          console.log("deleted");
        }
        localStorage.setItem('corridorProperties', JSON.stringify(corridorProperties));
      }
      alert("Koridor kustutatud");
      window.location.href = "ruumihaldus.php#corridors";
      setTimeout(function(){location.reload();},10);
      return false;
    }else{
      alert("Koridori ei kustutatud!");
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
          console.log("deleted");
        }
        localStorage.setItem('roomProperties', JSON.stringify(roomProperties));
      }
      alert("Ruum kustutatud!");
      window.location.href = "ruumihaldus.php";
      return false;
    }else{
      alert("Ruumi ei kustutatud!");
    }

  }

  /* MUUDA */

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

  function editCorridorProperties(){
    let currentCorridorCoordinates = localStorage.getItem('currentCorridorCoordinates');
    let currentCorridorName = localStorage.getItem('currentCorridorName');
    console.log(localStorage.getItem('currentCorridorName'));
    console.log(localStorage.getItem('currentCorridorCoordinates'));

    for (let i = 0; i < corridorProperties.length; i++) {
      let p = corridorProperties[i];
      if (p.corridorCoordinates == currentCorridorCoordinates && p.corridorName == currentCorridorName) {
        corridorProperties.splice(i, 1);
      }
      localStorage.setItem('corridorProperties', JSON.stringify(corridorProperties));
    }
    let corridorCoordinates = $('#editCorridorCoordinates').val();
    let corridorName = $('#editCorridorName').val();

    let update_CorridorProperty = {
      corridorCoordinates: corridorCoordinates,
      corridorName: corridorName
    };
    corridorProperties.push(update_CorridorProperty);
    alert("Koridor muudetud!");
    localStorage.setItem('corridorProperties', JSON.stringify(corridorProperties));
    window.location.href = "ruumihaldus.php#corridors";
    setTimeout(function(){location.reload();},10);
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

  //set Item teeb kõik muutujad lowercase-ks
  function setCurrentCorridors(){
    localStorage.setItem('currentCorridorCoordinates', $(this).data('corridorcoordinates'));
    localStorage.setItem('currentCorridorName', $(this).data('corridorname'));

    $('#editCorridorCoordinates').val(localStorage.getItem('currentCorridorCoordinates'));
    $('#editCorridorName').val(localStorage.getItem('currentCorridorName'));
  }

  /* OMADUSED */

  function addCorridorProperties(){
    let corridorCoordinates = $('#addCorridorCoordinates').val();
    let corridorName = $('#addCorridorName').val();

    let corridorProperty = {
      corridorCoordinates: corridorCoordinates,
      corridorName: corridorName
    };
    corridorProperties = getCorridorProperties();

    corridorProperties.push(corridorProperty);
    alert("Koridor lisatud");
    localStorage.setItem('corridorProperties', JSON.stringify(corridorProperties));

    window.location.href = "ruumihaldus.php#corridors";
    setTimeout(function(){location.reload();},10);
    return false;
  }

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

    roomProperties.push(property);
    alert("Ruum lisatud");
    localStorage.setItem('roomProperties', JSON.stringify(roomProperties));

    window.location.href = "ruumihaldus.php";
    return false;
  }

    /* KÜSI OMADUSED */

  function getCorridorProperties(){
    let currentCorridorProperties = localStorage.getItem('corridorProperties');
    if(currentCorridorProperties != null){
      corridorProperties = JSON.parse(currentCorridorProperties);
    }else{
      corridorProperties = [];
    }

    if(corridorProperties != null){
      return corridorProperties.sort();
    }
  }  

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

  /* NÄITA RUUME */

  function showCorridorProperties() {
    corridorProperties = getCorridorProperties();

    if(corridorProperties != "" && corridorProperties != null){
      console.log(corridorProperties);
      for (let i = 0; i < corridorProperties.length; i++){
        let p = corridorProperties[i];
        $('#corridorProperties').append('<li class="ui-body-inherit ui-li-static">' + p.corridorCoordinates +'<br>' + p.corridorName +
        '<div class="controls"><a href="#editCorridor" id="editCorridorLink" data-corridorCoordinates="' + p.corridorCoordinates + '"data-corridorName="' + p.corridorName +
        '">Muuda</a> | <a href="#" id="deleteCorridorLink" data-corridorCoordinates="' + p.corridorCoordinates + '"data-corridorName="' + p.corridorName +
        '" >Kustuta</a></div></li>');
      }
    }
  }


  function showProperties() {
    roomProperties = getRoomProperties();

    if (roomProperties != "" && roomProperties != null) {

      for (let i = 0; i < roomProperties.length; i++) {
        let p = roomProperties[i];
        $("#roomProperties").append('<li class="ui-body-inherit ui-li-static">' + p.coordinates + '<br>' + p.room +
          '<br>' + p.people + '<br>' + p.purpose + '<br>' + p.seats + '<br>' + p.comments +
          /*EDIT */
          '<div class="controls"><a href="#edit" id="editLink" data-coordinates="' + p.coordinates + '"data-room="' + p.room +
          '" data-people="' + p.people + '" data-purpose="' + p.purpose + '" data-seats="' + p.seats + '" data-comments="' + p.comments +
          /* DELETE */
          '">Muuda</a> | <a href="#" id="deleteLink" data-coordinates="' + p.coordinates + '"data-room="' + p.room +
          '" data-people="' + p.people + '"data-purpose="' + p.purpose + '" data-seats="' + p.seats + '" data-comments="' + p.comments +
          '">Kustuta</a></div></li>');
      }
    }
  }
});

