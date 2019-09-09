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
<html lang="et">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link href="../css/jsoneditor.css" rel="stylesheet">
  <link href="../css/extra.css" rel="stylesheet">
  <script src="https://code.jquery.com/jquery-3.4.1.min.js"
    integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
  <script src="../js/jsoneditor.js"></script>
  <title>JSON editor</title>
</head>
<div>
  <div id="buttonHeader">
    <span>Laadi fail:</span>
    <button id="Cords" class="redButton">Koordinaadid "network"</button>
    <button id="Path" class="redButton">Navigatsioon "pathing"</button>
  </div>
  <div id="jsoneditor"></div>
  <div id="buttons">
    <span>Halda:</span>
    <button id="Save" class="redButton">Salvesta</button>
    <button id="Default" class="redButton">Laadi originaal</button>
  </div>
  <br>
  <div id="calculator">
    <h4>Vahemaa kalkulaator</h4>
    <label for="cord1">1. ruum:</label>
    <input type="text" id="cord1"><br>
    <label for="cord2">2. ruum:</label>
    <input type="text" id="cord2"><br>
    <button id="calc-room">Arvuta vahemaa</button><br>
    <p id="result"></p>
  </div>
  <script src="../js/editor.js"></script>
</div>

</html>
