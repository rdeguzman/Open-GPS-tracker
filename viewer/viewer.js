var getterInterval;

$(document).ready(function () {
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    map.mapTypes.set('osm', osm);
    map.setOptions({
    mapTypeControlOptions: {
        mapTypeIds:
            ['osm',
            google.maps.MapTypeId.ROADMAP,
            // google.maps.MapTypeId.TERRAIN,
            google.maps.MapTypeId.SATELLITE],
            // google.maps.MapTypeId.HYBRID],
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
        }
    });

    $('#startstop').on('click', toggleTimer);
    getData('all');
    getterInterval = setInterval(getData, 5000);
});

var map;
var runners = [];
var tailLength = 60/5;
var mapOptions = {
    center: new google.maps.LatLng(63.845224,20.073608),
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    streetViewControl: false,
    panControl: false
};
var osm = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
        return "http://tile.openstreetmap.org/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
    },
    tileSize: new google.maps.Size(256, 256),
    isPng: true,
    maxZoom: 18,
    name: "OSM",
    alt: "OpenStreetMap"
});

var runners = [];

function runner(json,id) {
    var data = [];
    var path = new google.maps.MVCArray();
    var poly;
    var polySymbol;
    var colors =    ["red", "hotpink", "blue", "magenta", "orange", "lime",
                    "salmon", "aqua", "#ADFF2F", "#00FF7F"];
    var runnerColour = colors[Math.floor(Math.random()*colors.length)];
    var r = {};

    $('[data-id="'+id+'"]').css('color', runnerColour);

    if(!data.length){ populate(); }

    function populate(){
        var lats = json.runners[id].lat.split(",");
        var lons = json.runners[id].lon.split(",");
        var speeds = json.runners[id].speed.split(",");

        for (var j = lons.length - 1; j >= 0; j--) {
            var p = new google.maps.LatLng(lats[j], lons[j]);
            p.speed = speeds[j];
            data.unshift(p);
        }

        map.panTo(data[0]);
        makePath(tailLength);
    }

    function makePath(length){
        path.clear();

        // prevents trying to access out of range points
        if(data.length < length){
            length = data.length;
        }

        for (var i = length - 1; i >= 0; i--) {
            path.push(data[i]);
        }

        makePoly();
    }

    // makes polygon, first load only
    function makePoly(){
        polySymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            strokeColor: "black",
            fillColor: runnerColour,
            fillOpacity: 1,
            strokeWeight: 2,
            scale: 6
        };

        poly = new google.maps.Polyline({
            path: path,
            strokeColor: runnerColour,
            strokeOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            map: map,
            icons: [{icon: polySymbol, offset: '100%'}]
        });
    }

    function pop(){
        if(path.getLength() > 2){
            path.removeAt(0);
        }
    }

    r.update = function(json){
        var newLat = json.runners[id].lat;
        var newLon = json.runners[id].lon;
        var newSpeed = json.runners[id].speed;

        // movement found, add new point to data[] and MVCArray
        if(newLat != data[0].Ya && newLon != data[0].Za) {
            $('[data-id="'+id+'"] .pace').html(getPace(newSpeed)+' min/km');
            var p = new google.maps.LatLng(newLat, newLon);
            p.speed = newSpeed;
            data.unshift(p);
            path.push(p);
            console.log("movement detected");

            if(path.getLength() > tailLength){
                pop();
            }
        }
        else{
            console.log("no movement detected");
            pop();
        }
    };

    r.getInfo = function() {
        var info = {};
        info.pace = getPace(data[0].speed);
        info.name = json.runners[id].runnerid;
        return info;
    };

    return r;
}

function getData() {
    var state = "";
    if(!runners.length){ state = "all"; }
    else{ state = "latest"; }

    $.ajax({
        type: "GET",
        cache: false,
        url: 'gettracks.php?state='+state,
        dataType: 'json',
        success: function(json) {
            if(state == "latest") {
                updateRunners(json);
            }
            else {
                makeRunners(json);
            }
        }
    });
}

function makeRunners(json){
    if(json.runners.length == 0){
        alert('No runners recieved');
        toggleTimer();
    }

    for (var i = json.runners.length - 1; i >= 0; i--) {
        lastspeed = json.runners[i].speed.split(",");
        $('#runners').append('<li data-id='+i+'>'+json.runners[i].runnerid+'<span class="pace">'+getPace(lastspeed[0])+' min/km</span></li>');
        runners.push(runner(json,i));
    }
}

function updateRunners(json){
    for (var i = json.runners.length - 1; i >= 0; i--) {
        runners[i].update(json);
    }
}

function toggleTimer() {
    if(getterInterval){
        clearInterval(getterInterval);
        getterInterval = null;
        $('#startstop').removeClass('started').addClass('stopped');
        $('#startstop').text("Start");
    }
    else{
        getData();
        getterInterval = setInterval(getData, 5000);
        $('#startstop').removeClass('stopped').addClass('started');
        $('#startstop').text("Stop");
    }
}

function getPace(pace) {
    if (pace == 0 || isNaN(pace)) {
        return "N/A";
    } 
    else {
        var onemin = pace * 60;
        var x = 1000 / onemin;
        var time = 60 * x;
        var minutes = Math.floor(time / 60);
        var seconds = ((Math.round(time - minutes * 60)).toString());
        if (seconds.length == 1) { seconds = "0" + seconds; }
        return minutes + ":" + seconds;
    }
}