<?php

// TODO: fill in proper values for user name, password, and the name of the database on the instance
$mysqli = new mysqli('localhost', 'calendar_acc', 'adIdc27ca', 'calendar');

if($mysqli->connect_errno) {
	printf("Connection Failed: %s\n", $mysqli->connect_error);
	exit;
}
?>