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

  <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css">
  <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.5/jquery.mobile.min.css">
  <link rel="stylesheet" href="../css/ruumihaldus.css">
  <script src="https://code.jquery.com/jquery-3.4.1.min.js"
    integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
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
  <title>DTI Ruumihaldus</title>
</head>

<body>
  <div data-role="content">
    <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
      <label>Kasutajanimi: </label>
      <input type="text" name="username" value="<?php echo $username; ?>"><span><?php echo $usernameError; ?></span>
      <label>Salasõna: </label>
      <input type="password" name="password" value=""><span><?php echo $passwordError; ?></span>
      <label>Salasõna uuesti: </label>
      <input type="password" name="passwordconfirm" value=""><span><?php echo $passwordError2; ?></span>
      <input type="submit" name="submitUserData" value="Loo kasutaja" target="_blank">
      <p><?php echo $notice; ?></p>
    </form>
  </div>
</body>

</html>
