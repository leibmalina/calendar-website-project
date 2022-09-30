<?php
// functions for safety checks

// user's name should be 3-15 characters long and only contain alphabets (upper ans lower cases), numbers and underline
function check_username($name) {
    return preg_match('/^\w{3,15}$/', $name);
}

// when setting the password, it should be 8-30 characters long and only contain alphabets (upper ans lower cases), numbers and underline
function check_password($pwd) {
    return preg_match('/^\w{8,30}$/', $pwd);
}