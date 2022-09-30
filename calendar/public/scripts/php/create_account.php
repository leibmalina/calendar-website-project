<?php

require 'database.php'; // allow access to DB
require 'safety.php';

header("Content-Type: application/json"); // Sending JSON response

// get json from js fetch API
$json_str = file_get_contents('php://input');

// decode json, store the data into an associative array, get username and login
$json_obj = json_decode($json_str, true);
$username = $json_obj['username'];
$password = $json_obj['password'];

// prevent username or password in weird format or tremendous length
if (!check_username($username) || !check_password($password)) {
    echo json_encode(array(
        "success" => false,
        "message" => "Username or Password too long, too short or includes invalid characters"
    ));
    exit;
}

// ADD account to database

$check_prep = $mysqli->prepare("SELECT count(name) from accounts where name = ?");
if(!$check_prep)
{
    echo json_encode(array(
        "success" => false,
        "message" => "Account addition to database failed"
    ));
    exit;
}
$check_prep->bind_param('s', $username);
$check_prep->execute();
$check_prep->bind_result($count);
$check_prep->fetch();
$check_prep->close();
if ($count > 0) {
    echo json_encode(array(
        "success" => false,
        "message" => "User name exists"
    ));
    exit;
}

// create hashed password based on original password string
$passwordHash = password_hash($password, PASSWORD_BCRYPT); 

// prepared statement for db insertion
$prep = $mysqli->prepare("INSERT into accounts (name, password) values (?, ?)");
if(!$prep)
{
	echo json_encode(array(
        "success" => false,
        "message" => "Account addition to database failed"
    ));
	exit;
}

$prep->bind_param('ss', $username, $passwordHash);
$prep->execute();

// start session and set session variables:
ini_set("session.cookie_httponly", 1);
session_start();
$_SESSION['username'] = $username; // username inputted into form
$_SESSION['user_id'] = $prep->insert_id; // the auto-incremented user id for new inserted account
$_SESSION['token'] = bin2hex(random_bytes(32)); // CSRF token

$prep->close();

echo json_encode(array(
    "success" => true,
    "token" => $_SESSION['token'],
    "message" => ""
));
exit;
?>

