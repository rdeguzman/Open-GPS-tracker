Open GPS-tracker
========

Open GPS-tracker is a GPS-tracking-thing written in JavaScript and some PHP. It is primarily built for tracking running events, but may be modified to track anything. It uses a MySQL database to save tracking data.

##Files

###Tracking app:

Make a Phonegap app of the tracking html/js for tracking with the screen turned off. Tested on Android. 

`gps.htm` & `gps.js` - the tracking app, to be run on a GPS-enabled device. Sends location data on a set interval to:

`save.php` - recieves tracking data and puts it in the database.

###Viewer:

`gettracks.php` - reads tracking data and returns it in a format readable by the viewer.

`/viewer/viewer.php` & `/viewer/viewer.js` - reads `serve.php` repeatedly and puts its contents on the map.

##Instructions

What you need: a web server with PHP-support and a MySQL database.

###Installation:
1.	Upload the files to your server.
2.	Edit `config.php` with your setup.
3.	Create tables as per database.sql

###Tracking:
1.	Browse to `gps.htm` on your GPS-enabled device. Enter an ID and start tracking.

###Viewing tracking:
Go to /viewer/viewer.php and enjoy the tracking goodness.