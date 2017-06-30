module.exports = function (app, mongo) {

 var data;//global variable for all the data from course list

//giving the index of the class in db
//return the class info
  app.get('/course',function(req,res){
    mongo.getDB().collection('CourseList').find().toArray(function(err,docs){
      if(docs.length == 0){
          //double check the number of courses on the db
        return res.sendStatus(403);
      }
      return res.status(200).send(docs[req.query.index]);
    })
  });


  // query giving the code of the course
  //return the index of the course in db
  app.get('/courses', function (req, res) {

    console.log(req.query.code);
      //find the course from the database;
      mongo.getDB().collection('CourseList').find().toArray(function(err, docs){
            if(docs.length == 0){
                //double check the number of courses on the db
              return res.sendStatus(403);
            }

            for(var i in docs){
              if(docs[i].code==req.query.code){
                return res.send({"index":i,"info":docs[i]});
              }
            }

            return res.send({"index":-1,});


      });

  });

  //given a list of course's index in db
  //return the possible timetable output
  app.get('/generate', function (req, res){
    var list = req.query.list;
    mongo.getDB().collection('CourseList').find().toArray(function(err, docs){
          if(docs.length == 0){
              //double check the number of courses on the db
            return res.sendStatus(403);
          }
          data = docs;
          var out=[];
          var start=0;
          var output=generateVaildTable(list,out,start);
          return res.status(200).send(output);
        });
  });


//filter the time with user given input
  function filterData(filter){
    var morning=0;
    var afternoon=0;
    var evening=0;
    var night=0;

    if(filter.includes("morning")){
      morning =1;
    }
    if(filter.includes("afternoon")){
      afternoon =1;
    }
    if(filter.includes("evening")){
      evening =1;
    }
    if(filter.includes("night")){
      night =1;
    }

    for(var i in data){
      var length=data[i].meeting_sections.length;
      for(var j=0;j<length;j++){
        var time=data[i].meeting_sections;
        var sw=0;
        if(morning==1&&sw==0){
          if(timefilter(data[i].meeting_sections[j],9,12) == 1){
            time.splice(j, 1);
            data[i].meeting_sections=time;
            j--;
            length--;
            sw=1;
          }
        }
        if(afternoon==1&&sw==0){
          if(timefilter(data[i].meeting_sections[j],12,15) == 1){
            time.splice(j, 1);
            data[i].meeting_sections=time;
            j--;
            length--;
            sw=1;
          }
        }
        if(evening==1&&sw==0){
          if(timefilter(data[i].meeting_sections[j],15,18) == 1){
            time.splice(j, 1);
            data[i].meeting_sections=time;
            j--;
            length--;
            sw=1;
          }
        }
        if(night==1&&sw==0){
          if(timefilter(data[i].meeting_sections[j],18,21) == 1){
            time.splice(j, 1);
            data[i].meeting_sections=time;
            j--;
            length--;
            sw=1;
          }
        }
      }
    }
  }

  //function to test if the meeting time is within the range
  function timefilter(time,start,end){
    //same begining time
    var st =time.start.split(":");
    var ed=time.end.split(":");
    if(parseInt(st[0])==start){
      return 1;
    }
    //a start before start and end after start
    if(parseInt(st[0])>start){
      if(parseInt(st[0])<end){
        return 1;
      }
    }
    //start before a start and end after a start
    if(parseInt(ed[0])>start){
      if(parseInt(ed[0])<end){
        return 1;
      }
    }

    return 2;
  }

  //generate the confilct free table
  function generateVaildTable(list,output,i){
      if(i==list.length){
        return output;
      }
      var lectureCode=[];
      var course = data[list[i]];
      //add all possible course code
      for(var j=0;j<course.meeting_sections.length;j++){
        //check if the lecture code exist in the list
        if(!lectureCode.includes(course.meeting_sections[j].section)){
          lectureCode.push(course.meeting_sections[j].section);
        }
      }
      var possible=[];
      //test if the added course is confilt with the existing table
      for (var k=0;k<lectureCode.length;k++){
        if(testVaild(list,output,lectureCode[k])==1){
          possible.push(lectureCode[k]);
        }
      }
      //no possible solution for this path
      if(possible.length==0){
        return null;
      }

      //add the vaild course in the output list, call this function with the new output
      for(var l=0;l<possible.length;l++){
        var tmpOut=output.slice();
        tmpOut.push(possible[l]);
        console.log(tmpOut);
        var res = generateVaildTable(list,tmpOut,i+1);
        if (res!=null){
          return res;
        }
      }
      return null;
  }

  //test if the course adding is casuing conflict to the existing table
  function testVaild(list,output,code){
    //if the list is empty
    if(output.length==0){
      return 1;
    }
    var target= data[list[output.length]];
    var sw=1;
    //test all the existing coourse in the list
    for(var i=0;i<output.length;i++){
      //test each section of the course in the list
      for(var j=0;j<data[list[i]].meeting_sections.length;j++){
        if(data[list[i]].meeting_sections[j].section==output[i]){
          //compare the course added with the existing list
          for(var k=0;k<target.meeting_sections.length;k++){
            if(target.meeting_sections[k].section==code){
              var tmp=compareMeetingSection(data[list[i]].meeting_sections[j],target.meeting_sections[k]);
              if(tmp==1){
                return 2;
              }
            }
          }
        }
      }
    }
    return 1;

  }

  //compare two meeting section for confilct
  //a and b are course meeting section
  function compareMeetingSection(a,b){
    //same date
    if(a.day==b.day){
      //same begining time
      if(a.start==b.start){
        return 1;
      }
      //a start before b and end after b start
      if(a.start>b.start){
        if(b.end>a.start){
          return 1;
        }
      }
      //b start before a and end after a start
      if(a.start<b.start){
        if(a.end>b.start){
          return 1;
        }
      }
    }
    //they are not confilct
    return 2;
  }



}
