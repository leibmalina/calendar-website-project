<?php
ini_set("session.cookie_httponly", 1);
session_start();
require 'database.php';

header("Content-Type: application/json"); // Sending JSON response

// get json from js fetch API
$json_str = file_get_contents('php://input');

// decode json, store the data into an associative array, get username and login
$json_obj = json_decode($json_str, true);
$month = $json_obj['month'];
$month = $month + 1;
$year = $json_obj['year'];

// if not logged in, return an empty array
if (!isset($_SESSION['user_id'])) {
    echo json_encode(array());
    exit;
}

// get session variables
$user_id = $_SESSION['user_id'];

// prepared statement to find all events for given month and year
$stmt = $mysqli->prepare("SELECT eid, title, day(date), tags from events left join user_groups on (events.group_id = user_groups.gid) where owner_uid = ? AND year(date) = ? and month(date) = ?");

// catch error
if (!$stmt) {
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}

// bind parameters to query and execute
$stmt->bind_param('iii', $user_id, $year, $month);
$stmt->execute();
$stmt->bind_result($event_id, $event_title, $event_day, $event_tags);

// intialize empty array to store json data
$events_array = array();

// this creates a json string with all of the events for the given month
while ($stmt->fetch()) {
    // create a json element then add it to a larger array
    $events = array(
        "day" => $event_day,
        "eid" => $event_id,
        "title" => htmlentities($event_title),
        "tags" => htmlentities($event_tags)
    );
    array_push($events_array, $events); // add new event entry to json array
}

$stmt->close();

// now return the final encoded json array to js file:
echo json_encode($events_array);
exit;

?>