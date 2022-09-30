<?php
ini_set("session.cookie_httponly", 1);
session_start();

header("Content-Type: application/json"); // Sending JSON response

echo json_encode(array(
    "success" => true
));

session_destroy();
exit;
?>