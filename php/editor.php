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
$notice = "";
$username = "";
$usernameError = "";
$passwordError = "";
$passwordError2 = "";
if (isset($_POST["submitUserData"])) { // Don't check before sending the form
  if (isset($_POST["username"]) and !empty($_POST["username"])) {
    $username = test_input($_POST["username"]);
  } else {
    $usernameError = "Palun sisesta oma kasutajanimi!";
  }

  if (isset($_POST["password"]) and !empty($_POST["password"])) {
    $password = test_input($_POST["password"]);
    if (strlen($password) < 8) {
      $passwordError = "Palun sisesta piisavalt pikk parool!";
    }
  } else {
    $passwordError = "Palun sisesta oma parool!";
  }

  if (isset($_POST["passwordconfirm"]) and !empty($_POST["passwordconfirm"])) {
    $password = test_input($_POST["password"]);
    if ($_POST["passwordconfirm"] != $_POST["password"]) {
      $passwordError2 = "Palun sisesta samad paroolid!";
    }
  } else {
    $passwordError2 = "Palun kinnita ka oma parooli!";
  }
  // Check if errors are empty
  if (empty($usernameError) and empty($passwordError) and empty($passwordError2)) {
    $notice = signup($username, $_POST["password"]);
  }
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
