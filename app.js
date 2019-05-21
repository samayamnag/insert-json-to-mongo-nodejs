const config = require("./config");
const fs = require('fs');
const mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://' + config.mongodb.username + ':' + config.mongodb.password + '@' + config.mongodb.host + ':' + config.mongodb.port + '/' + config.mongodb.db_name;
console.log(mongoDB);
mongoose.connect(mongoDB, { useNewUrlParser: true, useCreateIndex: true });


mongoose.set('debug', config.debug);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var Road = require('./models/Road');

// Save road into DB
function saveRoad(segment) {
  var segmentProps = segment.properties;
  var segmentId = segmentProps.id;
  var roadId = segmentProps.road_id;
  var roadName = segmentProps.road_name;
  var roadStartPoint = [segmentProps.r_st_lng, segmentProps.r_st_lat];
  var roadEndPoint = [segmentProps.r_end_lng, segmentProps.r_end_lat];
  var roadLength = segmentProps.length_m;
  var roadWards = [
    {
      "id": segmentProps.ward_id,
      "number": segmentProps.ward_no,
      "name": segmentProps.ward_name,
    }
  ];
  var cityId = segmentProps.city_id;
  var cityName = segmentProps.city_name;
  var segment = {
    "segment_id": segmentId,
    "start_point": [segmentProps.s_st_lng, segmentProps.s_st_lat],
    "end_point": [segmentProps.s_ed_lng, segmentProps.s_end_lat],
    "length_in_mts": segmentProps.seg_lenght_in_mts,
    "wards": [
      {
        "id": segmentProps.ward_id,
        "number": segmentProps.ward_no,
        "name": segmentProps.ward_name,
      }
    ],
    "geometry": {
      "type": segment.geometry.type,
      "coordinates": segment.geometry.coordinates
    },
  };

  Road.findOne({ road_id: roadId }, function (err, road) {
    if (err) {
      throw new Error(err);
    }
    if (!road) {
      road = new Road();
      road.road_id = roadId;
      road.name = roadName;
      road.start_point = roadStartPoint;
      road.end_point = roadEndPoint;
      road.total_length_in_mts = roadLength;
      road.no_of_segments = 1;
      road.two_sided = false;
      road.wards = roadWards;
      road.city_id = cityId;
      road.city_name = cityName;
      road.obstruction_percentage = 0.0;
      road.segments = [segment];
    } else {
      var dbSegments = road.segments;
      var dbRoadSegmentCnt = dbSegments.length;
      var segmentIds = [];

      for (var i = 0; i < dbRoadSegmentCnt; i++) {
        segmentIds.push(dbSegments[i].segment_id);
      }
      // If segment Id not there then only push
      if (segmentIds.indexOf(segmentId) == -1) {
        road.segments.push(segment);
      }

    }

    // Update number of segments
    road.no_of_segments = road.segments.length;

    // Save road
    road.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        road.save();
        console.log("Road saved successfully ");
      }
    });
  });
}

// Read JSON file
fs.readFile('./road_segments.json', 'utf8', (err, data) => {
  if (err) throw err;
  let roadInput = JSON.parse(data);
  roadInput['segments'].forEach(segment => {
    saveRoad(segment);
  });
});