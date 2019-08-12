<?php
	// Improve session security - https://stackoverflow.com/a/10165602
	ini_set('session.use_strict_mode', true);
	ini_set('session.use_only_cookies', true);
	ini_set('session.use_trans_sid', false);

	$serverHost = "localhost";
	$serverUsername = "";
	$serverPassword = "";
	$database = "if18_kert_li_1";
	$loginTable = "Praktika_kasutajad";
?>