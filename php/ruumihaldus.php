<?php
require("functions.php");
// Check if session exists and matches DB by ID
if (!isset($_SESSION["userId"]) || checkIfIdInDb($_SESSION["userId"]) == 0) {
  session_destroy();
  header("Location: login.php");
  exit();
}

// Signing out
if (isset($_GET["logout"])) {
  session_destroy();
  header("Location: login.php");
  exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <link rel="apple-touch-icon" sizes="180x180" href="https://www.tlu.ee/themes/tlu/images/favicons/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="https://www.tlu.ee/themes/tlu/images/favicons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="https://www.tlu.ee/themes/tlu/images/favicons/favicon-16x16.png">
  <link rel="mask-icon" href="https://www.tlu.ee/themes/tlu/images/favicons/safari-pinned-tab.svg" color="#b71234">
  <link rel="shortcut icon" href="https://www.tlu.ee/themes/tlu/images/favicons/favicon.ico">

  <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
  <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.css">
  <link rel="stylesheet" href="../css/ruumihaldus.css">
  <script src="https://code.jquery.com/jquery-3.4.1.min.js"
  			  integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  			  crossorigin="anonymous">
  </script>
  <script type="text/javascript">
    function reload() {
      setTimeout(function () {
        location.reload();
      }, 10);
    }
  </script>

  <script src="../js/force-https.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js" defer></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.js" defer></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js" defer></script>
  <script src="../js/ruumihaldus.js" defer></script>
  <title>Ruumihaldus</title>
</head>
<body>
  <!-- RUUMID -->
  <div data-role="page" id="rooms">
    <div class="ui-header ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="header"
      role="banner">
      <h1></h1>
    </div>
    <div class="ui-header ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="header"
      role="banner">
      <h1 class="ui-title" tabindex="0" role="heading" aria-level="1"></h1>
      <a href="#addUsers" data-icon="user">Lisa uus kasutaja</a>
      <a href="?logout=1" onclick="return reload();" data-icon="power">Logi välja</a>
    </div>
    <div data-role="navbar">
      <ul>
        <li><a href="#rooms" data-transition="none" data-icon="bars">Ruumid</a></li>
        <li><a href="#addRoom" data-transition="none" data-icon="plus">Lisa ruum</a></li>
        <li><a href="#corridors" data-transition="none" data-icon="bars">Koridorid</a></li>
      </ul>
    </div>
    <div data-role="content">
      <ul id="roomProperties" data-role="listview" data-filter="true" data-filter-placeholder="Otsi ruumi..." data-inset="true"></ul>
      <button id="downloadRoomsButton" data-theme="A">Laadi ruumid failina alla</button>
      <button id="downloadRoomsToFolder" data-theme="A">Laadi ruumid serveri kausta</button>
      <button id="deleteRoomsButton" data-theme="A">Kustuta kõik ruumide andmed</button>
      <div>
        <label for="uploadRoomsButton" class="buttonLabel">Lae fail üles, et sealt andmed lehele lugeda:</label>
        <input type="file" data-theme="A" id="uploadRoomsButton">
      </div>
    </div>
    <div class="ui-footer ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="footer"
      role="banner">
      <h1 class="ui-title" tabindex="0" role="heading" aria-level="1">DTI Ruumihaldus</h1>
    </div>
  </div>
  <!-- CORRIDORS -->
  <div data-role="page" id="corridors">
    <div class="ui-header ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="header"
      role="banner">
      <h1></h1>
    </div>
    <div class="ui-header ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="header"
      role="banner">
      <h1 class="ui-title" tabindex="0" role="heading" aria-level="1"></h1>
      <a href="#addUsers" data-icon="user">Lisa uus kasutaja</a>
      <a href="?logout=1" onclick="return reload();" data-icon="power">Logi välja</a>
    </div>
    <div data-role="navbar">
      <ul>
        <li><a href="#rooms" data-transition="none" data-icon="bars">Ruumid</a></li>
        <li><a href="#addRoom" data-transition="none" data-icon="plus">Lisa ruum</a></li>
        <li><a href="#corridors" data-transition="none" data-icon="bars">Koridorid</a></li>
      </ul>
    </div>

    <div class="corridorEditor">
      <iframe src="editor.php" class="iFrameEditor"></iframe>
      <iframe src="editor-instructions.php" class="iFrameEditor-instructions"></iframe>
    </div>
    <div class="ui-footer ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="footer"
      role="banner">
      <h1 class="ui-title" tabindex="0" role="heading" aria-level="1">DTI Ruumihaldus</h1>
    </div>
  </div>
  <!-- ADD ROOM PAGE -->
  <div data-role="page" id="addRoom">
    <div class="ui-header ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="header"
      role="banner">
      <h1></h1>
    </div>
    <div class="ui-header ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="header"
      role="banner">
      <h1 class="ui-title" tabindex="0" role="heading" aria-level="1"></h1>
      <a href="#addUsers" data-icon="user">Lisa uus kasutaja</a>
      <a href="?logout=1" onclick="return reload();" data-icon="power">Logi välja</a>
    </div>
    <div data-role="navbar">
      <ul>
        <li><a href="#rooms" data-transition="none" data-icon="bars">Ruumid</a></li>
        <li><a href="#addRoom" data-transition="none" data-icon="plus">Lisa ruum</a></li>
        <li><a href="#corridors" data-transition="none" data-icon="bars">Koridorid</a></li>
      </ul>
    </div>
    <div data-role="content">
      <form id="addForm">
        <label for="addClassCoordinates">Sisesta ruumi koordinaadid: <a href="#popupInfo" data-rel="popup" data-transition="pop"
        class="my-tooltip-btn ui-btn ui-alt-icon ui-nodisc-icon ui-btn-inline ui-icon-info ui-btn-icon-notext" title="Learn more">Learn more</a></label>
        <div data-role="popup" id="popupInfo" class="ui-content" data-theme="a" style="max-width:350px;">
          <p>Koordinaadid võid leida kaardi pealt, aktiveerides all vasakul nurgas olevast nupust koordinaatide kopeerimisrežiimi ning seejärel kleepides need enda soovitud sihtkohta</p>
          <p>Koordinaadipaaris eralda kaks elementi "&" sümboliga ning kui on mitu koordinaadipaari, eralda need "|" sümboliga (klahvikombinatsioon "Alt Gr + <")</p>
        </div>
        <input type="text" id="addClassCoordinates"
          placeholder="2727.73828125&1781.455078125|2728.23828125&1891.955078125" required>

        <label for="addClassRoom">Sisesta ruumi nimi: </label>
        <input type="text" id="addClassRoom" placeholder="A427" required>

        <label for="addClassPeople">Sisesta ruumiga seotud isikud: </label>
        <input type="text" id="addClassPeople" placeholder="Mari Maasikas">

        <label for="addClassPurpose">Sisesta ruumi eesmärk: </label>
        <input type="text" id="addClassPurpose" placeholder="Kabinet">

        <label for="addClassSeats">Sisesta ruumi kohtade arv: </label>
        <input type="number" id="addClassSeats" min="1" max="500" placeholder="35">

        <label for="addClassComments">Lisa kommentaare: </label>
        <input type="text" id="addClassComments" placeholder="+372 640 9355">

        <button id="submitAddRooms" class="ui-btn ui-corner-all">LISA</button>
      </form>
    </div>
    <div class="ui-footer ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="footer"
      role="banner">
      <h1 class="ui-title" tabindex="0" role="heading" aria-level="1">DTI Ruumihaldus</h1>
    </div>
  </div>
  <!-- EDIT ROOM PAGE -->
  <div data-role="page" id="editRoomPage">
    <div class="ui-header ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="header"
      role="banner">
      <h1></h1>
    </div>
    <div class="ui-header ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="header"
      role="banner">
      <h1 class="ui-title" tabindex="0" role="heading" aria-level="1"></h1>
      <a href="#addUsers" data-icon="user">Lisa uus kasutaja</a>
      <a href="?logout=1" onclick="return reload();" data-icon="power">Logi välja</a>
    </div>
    <div data-role="navbar">
      <ul>
        <li><a href="#rooms" data-transition="none" data-icon="bars">Ruumid</a></li>
        <li><a href="#addRoom" data-transition="none" data-icon="plus">Lisa ruum</a></li>
        <li><a href="#corridors" data-transition="none" data-icon="bars">Koridorid</a></li>
      </ul>
    </div>
    <div data-role="content">
      <form id="editRoomForm">
        <label for="editRoomCoordinates">Sisesta ruumi koordinaadid: <a href="#popupEditInfo" data-rel="popup" data-transition="pop"
        class="my-tooltip-btn ui-btn ui-alt-icon ui-nodisc-icon ui-btn-inline ui-icon-info ui-btn-icon-notext" title="Learn more">Learn more</a></label>
        <div data-role="popup" id="popupEditInfo" class="ui-content" data-theme="a" style="max-width:350px;">
          <p>Koordinaadid võid leida kaardi pealt, aktiveerides all vasakul nurgas olevast nupust koordinaatide kopeerimisrežiimi ning seejärel kleepides need enda soovitud sihtkohta</p>
          <p>Koordinaadipaaris eralda kaks elementi "&" sümboliga ning kui on mitu koordinaadipaari, eralda need "|" sümboliga (klahvikombinatsioon "Alt Gr + <")</p>
        </div>
        <input type="text" id="editRoomCoordinates">
        <label for="editRoom">Sisesta ruumi nimi: </label>
        <input type="text" id="editRoom">
        <label for="editPeople">Sisesta ruumiga seotud inimesed:</label>
        <input type="text" id="editPeople">
        <label for="editPurpose">Sisesta ruumiga eesmärk:</label>
        <input type="text" id="editPurpose">
        <label for="editSeats">Sisesta ruumi kohtade arv: </label>
        <input type="number" id="editSeats" min="1" max="500">
        <label for="editComments">Lisa kommentaare: </label>
        <input type="text" id="editComments">
        <button id="submitRoomEdit" class="ui-btn ui-corner-all">MUUDA</button>
      </form>
    </div>
    <div class="ui-footer ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="footer"
      role="banner">
      <h1 class="ui-title" tabindex="0" role="heading" aria-level="1">DTI Ruumihaldus</h1>
    </div>
  </div>
  <!-- NEW USER -->
  <div data-role="page" id="addUsers">
    <div class="ui-header ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="header"
      role="banner">
      <h1></h1>
    </div>
    <div class="ui-header ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="header"
      role="banner">
      <h1 class="ui-title" tabindex="0" role="heading" aria-level="1"></h1>
      <a href="#addUsers" data-transition="none" data-icon="user">Lisa uus kasutaja</a>
      <a href="?logout=1" onclick="return reload();" data-icon="power">Logi välja</a>
    </div>
    <div data-role="navbar">
      <ul>
        <li><a href="#rooms" data-transition="none" data-icon="bars">Ruumid</a></li>
        <li><a href="#addRoom" data-transition="none" data-icon="plus">Lisa ruum</a></li>
        <li><a href="#corridors" data-transition="none" data-icon="bars">Koridorid</a></li>
      </ul>
    </div>
    <div class="corridorEditor">
      <iframe src="signup.php" width="100%" height="600"></iframe>
    </div>
  </div>
  <div class="ui-footer ui-bar-a" data-swatch="a" data-theme="A" data-form="ui-bar-a" data-role="footer" role="banner">
    <h1 class="ui-title" tabindex="0" role="heading" aria-level="1">DTI Ruumihaldus</h1>
  </div>
</body>
</html>
