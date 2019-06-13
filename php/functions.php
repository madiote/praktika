<?php
require("config.php");
$database = "if18_kert_li_1";
//alustan sessiooni
session_start();
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
			if (password_verify($password, $passwordFromDb)) {
    			//kui salasõna klapib
				$notice = "Logisite sisse!";
				//määran sessioonimuutujad
				$_SESSION["userId"] = $idFromDb;
				$_SESSION["username"] = $username;
				//liigume kohe vaid sisselogitutele mõeldud pealehele
				$stmt->close();
				$mysqli->close();
				header("Location: ruumihaldus.php");
				exit();
			} else {
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

function signup($username, $password){
	$notice = "";
	$mysqli = new mysqli($GLOBALS["serverHost"], $GLOBALS["serverUsername"], $GLOBALS["serverPassword"], $GLOBALS["database"]);
	
	$stmt = $mysqli -> prepare("INSERT INTO Praktika_kasutajad (username, password) VALUES (?, ?)");
	echo $mysqli -> error;
	
	// Krüpteerime parooli
	$options = ["cost" => 12, // Mitu ms kulub krüpteerimisele, 10 tavaline ja 12 max
				"salt" => substr(sha1(mt_rand()), 0, 22)]; // Hash'i juhuslik sool, võta 22 märki
	$pwdhash = password_hash($password, PASSWORD_BCRYPT, $options); // Hangi parooli soolatud räsi bcrypt'ga
	  
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