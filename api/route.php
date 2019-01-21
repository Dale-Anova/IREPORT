<?php
require 'connection.php';
require 'Slim/Slim.php';
require 'functions.php';

\Slim\Slim::registerAutoLoader();

$app = new \Slim\Slim();

$app->get("/", function(){
	echo "sample";
	sample();
});

$app->post("/signup/", function(){
	$username = $_POST['username'];
	$name	  = $_POST['name'];
	$course = $_POST['course'];
	$email	  = $_POST['email'];
	$password = $_POST['password'];
	create_table($username, $name, $course, $email, $password);
});

$app->post("/login/", function() {
	$username = $_POST["username"];
	$password = $_POST["password"];
	read_table($username, $password);	
});

$app->post("/blogpost/", function() {
	create_post();
});

$app->post("/update/", function() {
	$username    = $_POST["username"];
	$name        = $_POST["name"];
	$birthday    = $_POST["birthday"];
	$email       = $_POST["email"];
	$password    = $_POST["password"];
	update_table($username, $name, $birthday, $email, $password);
});

$app->run();
?>