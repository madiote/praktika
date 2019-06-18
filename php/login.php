<?php
require("functions.php");
$notice = "";
$username = "";
$usernameError = "";
$passwordError = "";
if (isset($_POST["login"])) {
    if (isset($_POST["username"]) and !empty($_POST["username"])) {
        $username = test_input($_POST["username"]);
    } else {
        $usernameError = "Palun sisesta kasutajatunnus!";
    }

    if (!isset($_POST["password"]) or strlen($_POST["password"]) < 8) {
        $passwordError = "Palun sisesta parool!";
    }

    if (empty($usernameError) and empty($passwordError)) {
        $notice = signin($username, $_POST["password"]);
    } else {
        $notice = "Ei saa sisse logida!";
    }
}
?>
<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="../css/login.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="utf-8">
    <link rel="apple-touch-icon" sizes="180x180"
        href="https://www.tlu.ee/themes/tlu/images/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32"
        href="https://www.tlu.ee/themes/tlu/images/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16"
        href="https://www.tlu.ee/themes/tlu/images/favicons/favicon-16x16.png">
    <link rel="mask-icon" href="https://www.tlu.ee/themes/tlu/images/favicons/safari-pinned-tab.svg" color="#b71234">
    <link rel="shortcut icon" href="https://www.tlu.ee/themes/tlu/images/favicons/favicon.ico">

    <title>DTI</title>
</head>

<body>
    <div class="flex">
        <div>
            <form method="POST" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                <br><br><br><label>Kasutajatunnus:</label><br><br>
                <input type="name" name="username"
                    value="<?php echo $username; ?>">&nbsp;<br><br><span><?php echo $usernameError; ?></span>
                <br><br><label>Salasõna:</label><br><br>
                <input name="password" type="password">&nbsp;<br><br><span><?php echo $passwordError; ?></span>
                <br><br><input name="login" type="submit" value="Logi sisse">&nbsp;<br><br><span><?php echo $notice; ?>
            </form>
        </div>
    </div>
    <script src="../js/force-https.js"></script>
</body>

</html>