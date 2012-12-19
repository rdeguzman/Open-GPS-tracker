<?php

require_once 'library.php';

db_connect();

$runnerId = mysqli_real_escape_string($link, $_GET['file']);
$lat = mysqli_real_escape_string($link, $_GET['lat']);
$lon = mysqli_real_escape_string($link, $_GET['lon']);
$time = mysqli_real_escape_string($link, $_GET['time']);
$speed = mysqli_real_escape_string($link, $_GET['speed']);

$latestquery = mysqli_query($link,
    "REPLACE INTO latest
    SET runnerid='$runnerId', lat='$lat', lon='$lon', time='$time', speed='$speed' 
    ");

$trackquery = mysqli_query($link,
    "INSERT INTO tracks
    SET runnerid='$runnerId', lat='$lat', lon='$lon', time='$time', speed='$speed'
    ");

?>