<?php
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';

// TODO: Add CSRF tokens

header("Content-Type: application/json"); // Sending JSON response

// get json from js fetch API
$json_str = file_get_contents('php://input');

// decode json, store the data into an associative array, get username and login
$json_obj = json_decode($json_str, true);
$eid = $json_obj['eid'];
$post_token = $json_obj['token'];

// if not logged in, return an empty object
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array(
        "success" => false
    ));
    exit;
}

if(!hash_equals($_SESSION['token'], $post_token)){
    echo json_encode(array(
        "success" => false
    ));
    exit;
}

// get session variables
$user_id = $_SESSION['user_id'];

// prepared statement to find all events for given month and year
$stmt = $mysqli->prepare("delete from events where eid = ? and owner_uid = ?");

// catch error
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

// bind parameters to query and execute
$stmt->bind_param('ii', $eid, $_SESSION['user_id']);
$stmt->execute();
$stmt->close();

// now return the final encoded json array to js file:
echo json_encode(array(
    "success" => true
));
exit;

?>