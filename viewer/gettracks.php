<?php

//no  cache headers 
header("Expires: Mon, 26 Jul 12012 05:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

header('Content-Type:application/json');

require_once '../library.php';

db_connect();

$link = '';

$output = array(
    'compname' => COMP_NAME
);

if(isset($_GET['state'])){

    // getting only the latest point from every runner in the database
    if($_GET['state'] == 'latest') {
        db_connect();

        $query =    'SELECT runnerid, lat, lon, speed
                    FROM latest
                    ORDER BY runnerid';

        $result = mysqli_query($link, $query);

        $runners = array();

        while($r = mysqli_fetch_assoc($result)) {
            $runners[] = $r;
        }

        $output['data'] = "latest";
        $output['runners'] = $runners;
        
        echo json_encode($output);
    }

    // getting all lat/lon-data from the database
    elseif($_GET['state'] == 'all') {
        db_connect();

        $query =    "SELECT runnerid,
                    GROUP_CONCAT(lat ORDER BY pointid DESC SEPARATOR ',') AS lat,
                    GROUP_CONCAT(lon ORDER BY pointid DESC SEPARATOR ',') AS lon,
                    GROUP_CONCAT(speed ORDER BY pointid DESC SEPARATOR ',') AS speed
                    FROM tracks
                    GROUP BY runnerid
                    ORDER BY runnerid";

        $result = mysqli_query($link, $query);

        $runners = array();

        while($r = mysqli_fetch_assoc($result)) {
            $runners[] = $r;
        }

        $output['data'] = "all";
        $output['runners'] = $runners;

        echo json_encode($output);
    }
}
else{
    echo 'Error';
}

?>