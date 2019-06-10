<?php
require("config.php");
$database = "if18_kert_li_1";
//alustan sessiooni
session_start();
/*function allusers () {
	$notice = "";
	$mysqli = new mysqli($GLOBALS["serverHost"], $GLOBALS["serverUsername"], $GLOBALS["serverPassword"], $GLOBALS["database"]);
	$stmt = $mysqli->prepare("SELECT firstname, lastname, username FROM Praktika_kasutajad WHERE id !=". $_SESSION['userId']."");
	$stmt->bind_result($firstname, $lastname, $username);
	$stmt->execute();
	while($stmt->fetch()){
		$notice .= "<li>".$firstname ." ". $lastname." " . $username ."</li> \n";
	}
	$stmt->close();
	$mysqli->close();
	return $notice;
}*/

function signin($username, $password) {
	$notice = "";
	$mysqli = new mysqli($GLOBALS["serverHost"], $GLOBALS["serverUsername"], $GLOBALS["serverPassword"], $GLOBALS["database"]);
	$stmt = $mysqli->prepare("SELECT id, password FROM Praktika_kasutajad WHERE username=?");
	echo $mysqli->error;
	$stmt->bind_param("s", $username);
	$stmt->bind_result($idFromDb, $passwordFromDb);
	if($stmt->execute()){
		//kui päring õnnestus
		if($stmt->fetch()) {
			//kasutaja on olemas
			//password_verify($password, $passwordFromDb)
			if($password == $passwordFromDb){
				//kui salasõna klapib
				$notice = "Logisite sisse!";
				//määran sessioonimuutujad
				$_SESSION["userId"] = $idFromDb;
				$_SESSION["username"] = $usernameFromDb;
				//liigume kohe vaid sisselogitutele mõeldud pealehele
				$stmt->close();
				$mysqli->close();
				header("Location: ruumihaldus.php");
				exit();
			}else {
				$notice = "Vale salasõna!". $password. " ". $passwordFromDb;

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
}//sisselogimine lõppeb
function test_input($data) {
	$data = trim($data);
	$data = stripslashes($data);
	$data = htmlspecialchars($data);
	return $data;
}
?>
