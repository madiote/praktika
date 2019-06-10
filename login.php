<?php
  require("functions.php");
  $notice = "";
  $username = "";
  $usernameError = "";
  $passwordError = "";

  if(isset($_POST["login"])){
	if (isset($_POST["username"]) and !empty($_POST["username"])){
	    $username = test_input($_POST["username"]);
    } else {
	     $usernameError = "Palun sisesta kasutajatunnus!";
    }

    if (!isset($_POST["password"]) or strlen($_POST["password"]) < 8){
	     $passwordError = "Palun sisesta parool, vähemalt 8 märki!";
    }

  if(empty($usernameError) and empty($passwordError)){
	   $notice = signin($username, $_POST["password"]);
	 } else {
	   $notice = "Ei saa sisse logida!";
  }
  }
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
	<title>DTI</title>
  </head>
  <body>
	<form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
	  <label>Kasutajatunnus:</label><br>
	  <input type="name" name="username" value="<?php echo $username; ?>">&nbsp;<span><?php echo $usernameError; ?></span><br>
	  <label>Salasõna:</label><br>
	  <input name="password" type="password">&nbsp;<span><?php echo $passwordError; ?></span><br>
	  <input name="login" type="submit" value="Logi sisse">&nbsp;<span><?php echo $notice; ?>
	</form>
  </body>
