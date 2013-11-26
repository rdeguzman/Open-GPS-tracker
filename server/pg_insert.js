var pg = require('pg');

var connectionString = "postgres://rupert@localhost/gpslogger_development";

pg.connect(connectionString, function(err, client, done) {
  if(err) {
    console.error('error fetching client from pool ', err);
  }
  else{
    var sqlStmt  = "INSERT INTO locations(gps_timestamp,";
        sqlStmt += "gps_latitude,";
        sqlStmt += "gps_longitude,";
        sqlStmt += "gps_speed,";
        sqlStmt += "gps_heading,";
        sqlStmt += "created_at,";
        sqlStmt += "updated_at)";
        sqlStmt += "VALUES ($1, $2, $3, $4, $5, Now(), Now())";

    var sqlParams = [1382762069119, -37.85609361, 145.23331579, 95.0, 145.0];

    var query = client.query(sqlStmt, sqlParams, function(err, result){
      if(err){
        console.error('error inserting ', err);
      }
      else{
        console.log(result);
      }

    });

    done();
  }
});