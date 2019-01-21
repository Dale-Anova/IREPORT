<?php
require_once 'idiorm.php';
// $servername = "localhost";
// $username = "root";
// $password = "root";
// $dbname = "blog_dale";

// // Create connection
// $conn = mysqli_connect($servername, $username, $password, $dbname);

// // Check connection
// if (!$conn) {
//     die("Connection failed: " . mysqli_connect_error());
// } 
// //echo "Connected successfully";
ORM::configure('sqlite:./example.db');
ORM::configure('mysql:host=localhost;dbname=ireport');
ORM::configure('username', 'root');
ORM::configure('password', '');
?>