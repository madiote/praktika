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
    <link href="../css/jsoneditor.css" rel="stylesheet">
    <link href="../css/extra.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"
			  integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
			  crossorigin="anonymous"></script>
    <script src="../js/jsoneditor.js"></script>
    <title>JSON editor</title>
</head>
<div>
    <div id="jsoneditor"></div>
    <br>
    <div id="buttons">
        <button id="Cords">Koordinaadid</button>
        <button id="Path">Navigatsioon</button>
        <button id="Save">Salvesta</button>
        <button id="Default">Lae default</button>
    </div>
    <br>
    <div id="calculator">
        <p>Esimene koordinaat</p>
        <input type="text" id="cord1">
        <p>Teine koordinaat:</p>
        <input type="text" id="cord2">
        <br>
        <button id="calc">Cords</button>
        <br>
        <button id="calc-room">Room</button>
        <br>
        <a id="result"></a>
    </div>
    <script src="../js/editor.js"></script>
</div>
</html>
