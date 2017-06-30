module.exports = function (app, mongo,autoIncrement,generateToken) {


  //connect to mongo db
  // Retrieve
  var bodyParser = require('body-parser');
  var jsonParser = bodyParser.json();
  //create new user


//login the user with username and password
app.post('/login',function(req,res){
console.log(req.body.username);
console.log(req.body.password);
  var result = {token:0,coursesl:[]}
  mongo.getDB().collection('UserInfo').find({username:req.body.username, password:req.body.password}).toArray(function(err, docs) {
      if (docs.length == 0) {
        return res.sendStatus(403);
      }
      var token = generateToken(docs[0]._id);
      result["token"] =token
      //res.json({
      //  userID: docs[0]._id,
      //  token: token
      //});
    });
  mongo.getDB().collection('SavedTable').find({username:req.body.username}).toArray(function(err, doc){
          if (doc.length > 0) {
             result["coursesl"]=doc;
             console.log(result);
          return res.send(result);
          }
      //console.log(result);
      //console.log(result.coursesl)
      //return res.json(result);
  });
});

//update user with new email address
app.put('/users/:uid', function (req, res, next) {
  // Change email, if specified
  if (req.query.email) {
    // Query database
    mongo.getDB().collection('UserInfo').count({
      email: req.query.email
    }, function(err, count) {
      if (count > 0) {
        // Email already exists
        return res.sendStatus(403);
      } else {
        mongo.getDB().collection('UserInfo').updateOne({
          _id:req.params.uid
        }, {
          $set: {email: req.query.email}
        }, function(err, result) {
          next();
        });
      }
    });
  } else {
    next();
  }
});

//update user with password
app.put('/users/:uid', function (req, res) {
  // Change password, if specified
  if (req.query.password) {
    // Query database
    // Update password
    mongo.getDB().collection('UserInfo').updateOne({
      _id:req.params.uid
    }, {
      $set: {password:req.query.password}
    }, function(err, result) {
      res.sendStatus(200);
    });
  } else {
    res.sendStatus(200);
  }
});
 app.post('/signup',function(req,res){
            console.log("signed")

             // Insert into database
            var tempname = req.query.username;
            var tempemail = req.query.email;
            var temppassword = req.query.password;
            if (!tempname || !tempemail || !temppassword)
              return res.sendStatus(400);
            // Query database: first, check if email or username already exists
            mongo.getDB().collection('UserInfo').count({
              $or: [{username: tempname,email: tempemail}]
            }, function(err, count) {
              if (count > 0) {
                // Email or username already exists
                return res.sendStatus(403);
              }
            autoIncrement.getNextSequence(mongo.getDB(), 'UserInfo', function (err, autoIndex) {
                    mongo.getDB().collection('UserInfo').insert({
                          _id: autoIndex,
                          username: tempname,
                          email: tempemail,
                          password: temppassword
            });

          });

      });

});

}
