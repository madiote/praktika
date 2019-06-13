<?php
require("config.php");
$database = "if18_kert_li_1";
// Starting the session
session_start();
function signin($username, $password) {
	$notice = "";
	$mysqli = new mysqli($GLOBALS["serverHost"], $GLOBALS["serverUsername"], $GLOBALS["serverPassword"], $GLOBALS["database"]);
	$stmt = $mysqli->prepare("SELECT id, password FROM Praktika_kasutajad WHERE username=?");
	echo $mysqli->error;
	$stmt->bind_param("s", $username);
	$stmt->bind_result($idFromDb, $passwordFromDb);
	if($stmt->execute()){
		// If the query succeeded
		if($stmt->fetch()) {
			if (password_verify($password, $passwordFromDb)) {
    			// If the password matches
				$notice = "Logisite sisse!";
				// Assign session variables
				$_SESSION["userId"] = $idFromDb;
				$_SESSION["username"] = $username;
				// Navigate to the room management page
				$stmt->close();
				$mysqli->close();
				header("Location: ruumihaldus.php");
				exit();
			} else {
				$notice = "Vale salasõna!";
			}
		} else {
			$notice = "Sellist kasutajat (" .$username .") ei leitud!";
		}
	}else {
		$notice= "Sisselogimisel tekkis tehniline viga!".$stmt->error;
	}
	$stmt->close();
	$mysqli->close();
	return $notice;
}// End of login function
function test_input($data) {
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}

function signup($username, $password){
	$notice = "";
	$mysqli = new mysqli($GLOBALS["serverHost"], $GLOBALS["serverUsername"], $GLOBALS["serverPassword"], $GLOBALS["database"]);

	$stmt = $mysqli -> prepare("INSERT INTO Praktika_kasutajad (username, password) VALUES (?, ?)");
	echo $mysqli -> error;

	// Encrypt the pass
	$options = ["cost" => 12, // Encrypt time in ms - 10 usual, 12 max
				"salt" => substr(sha1(mt_rand()), 0, 22)]; // Hash salt, using 22 first characters
	$pwdhash = password_hash($password, PASSWORD_BCRYPT, $options); // Get the password's salted hash using bcrypt

	$stmt -> bind_param("ss", $username, $pwdhash);
	if($stmt -> execute()){
		$notice = "Kasutaja loomine õnnestus!";
	} else {
		$notice = "Kasutaja loomisel esines tõrge: " . $stmt -> error;
	}

	$stmt -> close();
	$mysqli -> close();

	return $notice;
}
?>
