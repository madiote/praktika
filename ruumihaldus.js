/*jshint esversion: 6*/
$(document).one('pageinit', function () {
  let properties;

  showProperties();
  $('#submitAdd').on('tap', addRoomProperties);
  $('#properties').on('tap', '#editLink', setCurrent);
  $('#submitEdit').on('tap', editProperties);
  $('#properties').on('tap', '#deleteLink', deleteProperties);

  $('#downloadButton').on('tap', redirect);
  $('#uploadButton').on('change', showFile);

  //document.getElementById('uploadButton').addEventListener('change', getFile);

  function myfunction() {
    console.log(this.fileContent);
  }

  /*function combineRoomProperties(){
	  properties = getRoomProperties();
	  if(properties != null){
		  for(i = 1; i < properties.length; i++){
			  //console.log("Vähemalt seegi");
			  let firstRoom = properties[i - 1];
			  let secondRoom = properties[i];
			  console.log(firstRoom.purpose);
			  console.log(secondRoom.purpose);
			  if(firstRoom.room == secondRoom.room && firstRoom.purpose == secondRoom.purpose){
				  //console.log("klapib");
				  console.log(firstRoom.people.concat(", "+secondRoom.people));
			  }else{
				  console.log("ei klapi");
			  }			 
		  }
		  
	  }
	  
  }*/

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
            //console.log(line);
            //console.log(eachElement);
            /*console.log(eachElement[0]);
            console.log(eachElement[1]);
            console.log(eachElement[2]);*/
            let room = eachElement[0];
            let people = eachElement[1];
            let purpose = eachElement[2];


            let property = {
              room: room,
              people: people,
              purpose: purpose
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
    //reader.readAsText(file);
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
    let classRoom;
    let classPeople;
    let classPurpose;
    let data = "\n";

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;

    if (properties != "" && properties != null) {
      for (let i = 0; i < properties.length; i++) {
        data += String(properties[i].room) + "; " + String(properties[i].people) + "; " + String(properties[i].purpose) + "\n";
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

  function deleteProperties() {
    localStorage.setItem('currentRoom', $(this).data('room'));
    localStorage.setItem('currentPeople', $(this).data('people'));
    localStorage.setItem('currentPurpose', $(this).data('purpose'));

    let currentRoom = localStorage.getItem('currentRoom');
    let currentPurpose = localStorage.getItem('currentPurpose');
    let currentPeople = localStorage.getItem('currentPeople');

    for (let i = 0; i < properties.length; i++) {
      if (properties[i].room == currentRoom && properties[i].purpose == currentPurpose && properties[i].people == currentPeople) {
        properties.splice(i, 1);
      }
      localStorage.setItem('properties', JSON.stringify(properties));
    }

    alert("Ruum kustutatud!");

    window.location.href = "ruumihaldus.html";
    return false;
  }

  /* MUUDA */

  function editProperties() {
    let currentRoom = localStorage.getItem('currentRoom');
    let currentPurpose = localStorage.getItem('currentPurpose');
    let currentPeople = localStorage.getItem('currentPeople');

    for (let i = 0; i < properties.length; i++) {
      if (properties[i].room == currentRoom && properties[i].purpose == currentPurpose && properties[i].people == currentPeople) {
        properties.splice(i, 1);
      }
      localStorage.setItem('properties', JSON.stringify(properties));
    }
    let room = $('#editRoom').val();
    let people = $('#editPeople').val();
    let purpose = $('#editPurpose').val();
    let update_property = {
      room: room,
      people: people,
      purpose: purpose
    };
    properties.push(update_property);
    alert("Ruum muudetud!");
    localStorage.setItem('properties', JSON.stringify(properties));
    window.location.href = "ruumihaldus.html";
    return false;
  }

  function setCurrent() {
    localStorage.setItem('currentRoom', $(this).data('room'));
    localStorage.setItem('currentPeople', $(this).data('people'));
    localStorage.setItem('currentPurpose', $(this).data('purpose'));

    $('#editRoom').val(localStorage.getItem('currentRoom'));
    $('#editPeople').val(localStorage.getItem('currentPeople'));
    $('#editPurpose').val(localStorage.getItem('currentPurpose'));
  }

  /* RUUMI OMADUSED */

  function addRoomProperties() {
    let room = $('#addClassRoom').val();
    let people = $('#addClassPeople').val();
    let purpose = $('#addClassPurpose').val();


    let property = {
      room: room,
      people: people,
      purpose: purpose
    };
    properties = [];
    properties = getRoomProperties();

    //console.log(properties);
    //console.log(property);
    properties.push(property);
    //console.log(properties);

    alert("Ruum lisatud");
    localStorage.setItem('properties', JSON.stringify(properties));

    window.location.href = "ruumihaldus.html";
    return false;
  }

  /* KÜSI RUUMI OMADUSED */

  function getRoomProperties() {
    let currentProperties = localStorage.getItem('properties');

    if (currentProperties != null) {
      /*console.log(currentProperties);*/
      properties = JSON.parse(currentProperties);
      /*console.log(properties);
      console.log(properties.length);*/
      for (i = 1; i < properties.length; i++) {
        let firstRoom = properties[i - 1];
        let secondRoom = properties[i];
        /*console.log(firstRoom.purpose);
        console.log(secondRoom.purpose);*/
        if (firstRoom.room == secondRoom.room && firstRoom.purpose == secondRoom.purpose) {
          /*console.log(firstRoom.people.concat(", " + secondRoom.people));*/
          firstRoom.people.concat(", " + secondRoom.people);
        } else {
          //console.log("ei klapi");
        }
      }
      //console.log(properties.room);
      //console.log("aga siin toda");
    } else {
      properties = [];
      //console.log("Siin teeb seda");
    }

    if (properties != null) {}
    return properties.sort();
  }

  /* NÄITA RUUME */

  function showProperties() {
    properties = getRoomProperties();

    if (properties != "" && properties != null) {
      for (let i = 0; i < properties.length; i++) {
        $("#properties").append('<li class="ui-body-inherit ui-li-static">' + properties[i].room +
          '<br>' + properties[i].people + '<br>' + properties[i].purpose +
          '<div class="controls"><a href="#edit" id="editLink" data-room="' + properties[i].room +
          '" data-people="' + properties[i].people + '" data-purpose="' + properties[i].purpose +
          '">Muuda</a> | <a href="#" id="deleteLink" data-room="' + properties[i].room +
          '" data-people="' + properties[i].people + '"data-purpose="' + properties[i].purpose +
          '" onclick="return confirm(\'Kas oled kindel?\')">Kustuta</a></div></li>');
      }
    }
  }



});