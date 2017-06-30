module.exports = function (app, mongo,autoIncrement,jsonParser) {


  //to save user's TimeTable
  app.get('/save', function (req, res, next) {

      //add 1 to current numbers of tables in order to specify id for delete
      // Insert into database

      autoIncrement.getNextSequence(mongo.getDB(), 'SavedTable', function (err, autoIndex) {
                    mongo.getDB().collection('SavedTable').insert({
                          _id: autoIndex,
                          username: req.query.username,
                          courses: req.query.course
                  });
                  res.sendStatus(200);
      });


  });

//to search user saved TimeTable
  app.get('/search', function (req, res, next) {
    // Endpoint for getting all the course

    mongo.getDB().collection('SavedTable').find().count({

    }, function(err, count) {
      if (count == 0) {
         return res.sendStatus(403);
      }
      //load all the course from the database;
      var course = mongo.getDB().collection('SavedTable').find({"username":req.quary.username}).toArray(function(err, docs){
            if(docs.length == 0){
              return res.sendStatus(403);
            }
            var result = docs[0];
            //debuging:
            //console.log(result);
            //sned back the result
            res.send(docs);

        });




      });

});

  //Delete user with specify userid
  app.get('/user/uid?', function (req, res) {
    // Check if uid is valid first
    mongo.getDB().collection('SavedTable').find().count({
        id:req.query.uid
    }, function(err, count) {
      if (count == 0) {
        return res.sendStatus(403);
      }
      //delete this user from mongodb
      mongo.getDB().collection('SavedTable').remove({"id":req.query.uid});



      });

});



}
