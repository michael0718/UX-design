var express = require('express');
var app = express();
app.use(express.static(__dirname + '/'));

// Enable CORS for the backend
// Don't do this if frontend and backend are on the same server
var cors = require('cors-express');
app.use(cors({}));

// MongoDB
var mongo = require('./backend-js/connectdb.js');
mongo.connectToServer(function(err) {
  // Database is ready; listen on port 3000
  app.listen(3000, function () {
    console.log('App listening on port 3000');
  });
});
app.get(['/', '/:file'],function(req, res, next) {
  if(req.params.file == 'courses' || req.params.file == 'generate' || req.params.file == 'course' || req.params.file =="save" || req.params.file =="login"|| req.params.file =="signup")
    next();
  else if (req.params.file)
    res.sendFile(__dirname + '/html/' + req.params.file);
  else {
    res.sendFile(__dirname + '/html/home.html');
  }
});
// MongoDB auto-increment
var autoIncrement = require("mongodb-autoincrement");

// Array intersect
var intersect = require('intersect');

// SHA1
var sha1 = require('sha1');

// Reads bearer authorization token
var bearerToken = require('express-bearer-token');
app.use(bearerToken());

// JSON web token
var jwt = require('jwt-simple');
var secret = 'QbSqjf3v1V2sMHyeo27W';

// Function for generating token
var generateToken = function (userID) {
  var date = new Date();
  var payload = {
    userID: userID,
    exp: date.setHours(date.getHours() + 17532)
  };
  return jwt.encode(payload, secret);
};

//parse the course
var parseCourse = function(course){
  var meeting =[];
  for(var i=0;i<course.meeting_sections.length;i++){
    meeting.push({
      start:course.meeting_sections[i].start,
      end:course.meeting_sections[i].end,
      section:course.meeting_sections[i].section,
      location:course.meeting_sections[i].location,
      day:course.meeting_sections[i].day
    });
  }
  return {
    link:course.link,
    code:course.code,
    meeting_sections:meeting
  };
};




// Parse JSON and make sure that it's not empty
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
app.use(bodyParser.json());
app.post('*', jsonParser, function (req, res, next) {
  if (!req.body) return res.sendStatus(400);
  next();
});

// Authentication
app.all('*', jsonParser, function (req, res, next) {
  if (req.token) {
    var decodedToken = jwt.decode(req.token, secret);
    if (decodedToken && new Date(decodedToken.exp) > new Date()) {
      // Check if user exists and is admin
      mongo.getDB().collection('users').find({
        _id: decodedToken.userID
      }).toArray(function(err, docs) {
        if (docs.length > 0) {
          req.userID = docs[0]._id;
          req.email = docs[0].email;
          req.userName = docs[0].userName;
        }
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

require('./backend-js/loadCourse.js')(app, mongo);
require('./backend-js/savedcourse.js')(app, mongo,autoIncrement,jsonParser);
require('./backend-js/users.js')(app, mongo,autoIncrement,generateToken);
