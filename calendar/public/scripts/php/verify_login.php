<?php
ini_set("session.cookie_httponly", 1);
session_start();

// what if user have already logged in
if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
	echo json_encode(array(
		"success" => true,
		"token" => $_SESSION['token']
	));
	exit;
}

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
        "message" => "Incorrect Username or Password"
    ));
    exit;
}

// CHECK to see if the username and password are valid
$validLogin = false; 
// prepared statement for db query
$stmt = $mysqli->prepare("SELECT COUNT(*), uid, password FROM accounts WHERE name=?");

// Bind the parameter
$stmt->bind_param('s', $username);
$stmt->execute();

// Bind the results
$stmt->bind_result($cnt, $user_id, $pwd_hash);
$stmt->fetch();

// Compare the submitted password from the form to the actual password hash
if($cnt == 1 && password_verify($password, $pwd_hash)){
	// Login succeeded!
	$validLogin = true;
} else{
	// $validLogin = false (this is the default so do nothing)
}

if($validLogin){
    // login credentials are valid - start session and return true
	$_SESSION['username'] = $username;
	$_SESSION['user_id'] = $user_id;
	$_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32)); // CSRF token for user session

	echo json_encode(array(
		"success" => true,
		"token" => $_SESSION['token']
	));
	exit;
} else{
    // login attempt failed
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
	exit;
}
?>

