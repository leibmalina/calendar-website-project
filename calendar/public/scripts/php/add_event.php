<?php
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php'; // allow access to DB

header("Content-Type: application/json"); // Sending JSON response

// get json from js fetch API
$json_str = file_get_contents('php://input');

// get currently logged in user info from session
$user_id = $_SESSION['user_id'];
$session_token = $_SESSION['token'];

// decode json and store values from fetch
$json_obj = json_decode($json_str, true);
$title = $json_obj['title'];
$dateString = $json_obj['date'];
$time = $json_obj['time'];
$tags = $json_obj['tags'];
$group_name = $json_obj['group'];
$post_token = $json_obj['token'];

// verify csrf token valid
if(!hash_equals($session_token, $post_token)){
	echo json_encode(array(
        "success" => false
    ));
    exit;
}

// determine whether group name was specified (if not, group name is "none")
$has_group = strcmp($group_name, "none") !== 0 ? true : false;

// convert date to proper format for mysql datetime, get group id:
$date = date('Y-m-d', strtotime($dateString));
if($has_group) { // don't get group id if group name not entered
    $group_id = getGroupID($group_name);
}

// get the group id number from the group name 
function getGroupID($group_name) {
    require 'database.php'; // include when calling function (otherwise php scope error)

    $stmt = $mysqli->prepare("SELECT COUNT(*), gid from user_groups where name = ?");
    $stmt->bind_param('s', $group_name);
    $stmt->execute();
    $stmt->bind_result($cnt, $group_id);
    $stmt->fetch();

    // if there's one group with the given name, return the group id
    if($cnt == 1) {
        return $group_id;
    } else {
        return "error";
    }
}

// insert into events database (based on whether there was a group name specified or not):
if($has_group) {
    $insertEvents = $mysqli->prepare("INSERT into events (owner_uid, group_id, title, date, time, tags) values (?, ?, ?, ?, ?, ?)");
    $insertEvents->bind_param('iissss', $user_id, $group_id, $title, $date, $time, $tags); // bind params specified above
    $insertEvents->execute();
} else { // don't include grup id in insertion
    $insertEvents = $mysqli->prepare("INSERT into events (owner_uid, title, date, time, tags) values (?, ?, ?, ?, ?)");
    $insertEvents->bind_param('issss', $user_id, $title, $date, $time, $tags); // bind params specified above
    $insertEvents->execute();
}


// get the autoincremented new event id (just added)
$event_id = $insertEvents->insert_id; 

$insertEvents->close(); // end query execution

echo json_encode(array(
    "success" => true
));
exit;

?>