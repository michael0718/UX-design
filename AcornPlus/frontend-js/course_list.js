'use strict';
var Course = Course || {};
var $savedcourse = $('#savedcourse');
var list =[];

//random color for each div
function ran_col() {
  var color = '#';
  var letters = ['f25945','6e4dbb','1d996d','fd8f26','24cccd','ffbfcd'];
  color += letters[Math.floor(Math.random() * letters.length)];
  document.getElementById('post').style.background = color;
  document.getElementById('blog').style.background = color;
}

function find_date(day){
  if(day=="MO")
    return "monday";
  else if(day=="TU")
    return "tuesday";
  else if (day=="WE")
    return "wednesday";
  else if (day=="TH")
    return "thursday"
  else
    return "friday";
}

function add_timetable(info,section){
  var name = info.code;
  var time = info.meeting_sections;
  console.log("hihi");
  for(var i=0; i<time.length;i++){
    if(time[i].section == section){
      var target = find_date(time[i].day);
      console.log(time[i]);
      var ele = document.createElement("li");
      ele.setAttribute("class","single-event");
      ele.setAttribute("data-start",time[i].start);
      ele.setAttribute("data-end",time[i].end);
      ele.setAttribute("data-content","event-abs-circuit");
      ele.setAttribute("data-event","event-1");

      var link =document.createElement("a");
      link.setAttribute("href","");

      var tag = document.createElement("em");
      tag.setAttribute("class","event-name");
      tag.innerHTML = name+" "+section;
      link.appendChild(tag);
      ele.appendChild(link);
      console.log("ele");
      document.getElementById(target).appendChild(ele);
    }

  }
}


//create the field for each course
Course.create_list = function(id,section,time){

  var field =document.createElement("div");
  field.setAttribute("class","course");

  var name = document.createElement("P");
  name.setAttribute("class","course_name");
  name.innerHTML=id;

  var sec = document.createElement("P");
  sec.setAttribute("class","course_section");
  sec.innerHTML=section;

  var ti = document.createElement("div");
  ti.setAttribute("class","course_time")

  for(var i=0; i<time.length;i++){

    if(time[i].section == section){
      var ele = document.createElement("P");
      ele.innerHTML=time[i].day +"  "+time[i].start + " - " +time[i].end + "       "+time[i].location;
      ti.appendChild(ele);
    }

  }
  field.appendChild(name);
  field.appendChild(sec);
  field.appendChild(ti);
  document.getElementById("course_list").appendChild(field);


}

//set up the theme function
Course.Theme=function(){

  var divl = document.getElementsByClassName("events tcolor-l");
  var divs = document.getElementsByClassName("tcolor-s");
  var i;

    document.getElementById('theme_0').addEventListener('click',function(){
        document.body.style.backgroundImage = "none";
    })
    document.getElementById('theme_1').addEventListener('click',function(){
        document.body.style.backgroundImage = "url('../img/theme_img/background1.png')";
    })
    document.getElementById('theme_2').addEventListener('click',function(){
        document.body.style.backgroundImage = "url('../img/theme_img/background2.png')";
    })
    document.getElementById('theme_3').addEventListener('click',function(){
        document.body.style.backgroundImage = "url('../img/theme_img/background3.png')";
    })
    document.getElementById('theme_4').addEventListener('click',function(){
        document.body.style.backgroundImage = "url('../img/theme_img/background4.png')";
    })

    //change different timetable colors depending on user choices
    document.getElementById('color_0').addEventListener('click',function(){
        divl[0].style.backgroundColor="#F6F6F6";
        for (i = 0; i < divs.length; i++) {
          divs[i].style.backgroundColor = "#E8E9E9";
        }
    })
    document.getElementById('color_1').addEventListener('click',function(){
        divl[0].style.backgroundColor = "#ffe9c7";
        divl[0].style.opacity = 0.7;
        for (i = 0; i < divs.length; i++) {
          divs[i].style.backgroundColor = "#FFBC67";
        }
    })
    document.getElementById('color_2').addEventListener('click',function(){
        divl[0].style.backgroundColor = "#ffe1d0";
        divl[0].style.opacity = 0.7;
        for (i = 0; i < divs.length; i++) {
          divs[i].style.backgroundColor = "#ffb4ac";
        }
    })
    document.getElementById('color_3').addEventListener('click',function(){
        divl[0].style.backgroundColor = "#d9ffff";
        divl[0].style.opacity = 0.7;
        for (i = 0; i < divs.length; i++) {
          divs[i].style.backgroundColor = "#54D0ED";
        }
    })

    document.getElementById('save').addEventListener('click',function(){
      //var send={};
      var list = JSON.parse(window.localStorage.getItem("list"));
      var infoList = JSON.parse(window.localStorage.getItem("infoList"));
      var output = JSON.parse(window.localStorage.getItem("output"));
      var outList=change(infoList);
      console.log(outList);
      var send={};
      send["course"]=outList;
      send["username"]="test";
      //send data

      $.get('/save', { username: "james", course : outList},
          function(returnedData){
               alert("Saved");
      }).fail(function(){
            alert("Error from saving");
      });

    });

    }

    //output only the code of all the course
    function change(infoList){
      var li=[];
      for(var i in infoList){
        li.push(infoList[i].code);
      }
      return li;
    }

//initialize the web page
Course.init = function(){

  this.Theme();
  //set the on click function for back button
  document.getElementById("back").onclick = function(){
    window.location.href = "/";
  }
  var list = JSON.parse(window.localStorage.getItem("list"));
  var infoList = JSON.parse(window.localStorage.getItem("infoList"));
  var output = JSON.parse(window.localStorage.getItem("output"));

  console.log(infoList);
  console.log(output);
  for(var i=0;i<infoList.length;i++){
    if(infoList[i].code!="morning"&&infoList[i].code!="afternoon"&&infoList[i].code!="evening"&&infoList[i].code!="night"){
      add_timetable(infoList[i],output[i]);
    }
  }


}

//set up the page
Course.init();
