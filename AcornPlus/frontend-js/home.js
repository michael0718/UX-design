'use strict';
var Home = Home || {};
var session;//global var for different session,0 for unselect,1 for fall, 2 for spring
var count;//total count for course
var list = [];//the list of courses add in the cart
var courselist=[];


//this will update the cart number
function update_cart(){
  var icon= document.createElement("i");
  icon.setAttribute("class","fa fa-shopping-cart w3-margin-right");

  document.getElementById("cart").innerHTML=count+"- Course";
    document.getElementById("cart").appendChild(icon);
}

//add onclick for generate button on home page
Home.generate_timetable =function(){

  document.getElementById("generate_but").onclick= function(){
    if(count == 0){
      alert("You don't have any courses");

    }
    else{
      var infoList=[];
      var ct=0;
      var filter=[];
      var deferreds = [];


      if(!document.getElementById("tool1").checked){
        var code ="morning";
        filter.push(code);
        deferreds.push(
        jQuery.ajax({
            url: "/courses?code="+code,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(response) {
              list.unshift(response.index);
              ct++;
            }
          }));

      }
      if(!document.getElementById("tool2").checked){
        var code ="afternoon";
        filter.push(code);
        deferreds.push(
        jQuery.ajax({
            url: "/courses?code="+code,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(response) {
              list.unshift(response.index);
              ct++;
            }
          }));
      }
      if(!document.getElementById("tool3").checked){
        var code ="evening";
        filter.push(code);
        deferreds.push(
          jQuery.ajax({
            url: "/courses?code="+code,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(response) {
              list.unshift(response.index);
              ct++;
            }
          }));
      }
      if(!document.getElementById("tool4").checked){
        var code ="night";
        filter.push(code);
        deferreds.push(
          jQuery.ajax({
            url: "/courses?code="+code,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(response) {
              list.unshift(response.index);
              ct++;
            }
          }));
      }
      var tmpdefer=[];
      jQuery.when.apply(null, deferreds).done(function() {
      jQuery.each(list, function (i, item) {
        tmpdefer.push(
        jQuery.ajax({
            url: "/course?index="+item,
            type: "GET",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(response) {
              infoList.push(response);
            }
          }));
      });

      jQuery.when.apply(null, tmpdefer).done(function() {
        jQuery.ajax({
            url: "/generate",
            type: "GET",
            dataType: "json",
            data: {"list":list} ,
            contentType: "application/json; charset=utf-8",
            success: function(response) {
              var output=response;
         if(output==null){
           alter("There is no possile timetable with selected courses.");
         }
         else{
          window.localStorage.setItem("username", "roc");
          window.localStorage.setItem("list", JSON.stringify(list));
          window.localStorage.setItem("infoList", JSON.stringify(infoList));
          window.localStorage.setItem("output", JSON.stringify(output));
          window.localStorage.setItem("count", ct);
          window.location.href = "/timetable.html";
      }
    }
  });
});});

    }
  }
}

function addSavedList(save){
  for(var i in save){
    var ele = document.createElement("div");
    ele.setAttribute("class","course w3-list-group-item");
    ele.setAttribute("id","save"+i);


    var course_link = document.createElement("a");
    course_link.setAttribute("target","_blank");
    course_link.setAttribute("id","i"+i);
    course_link.innerHTML=save[i].courses;
    course_link.onclick=function(){
      var place=this.id[1];
      var infoList =[];
      var savelist=[];
        var tmpdefer=[];
        jQuery.each(save[place].courses, function (i, item) {
          console.log(item);
          tmpdefer.push(
          jQuery.ajax({
              url: "/courses?code="+item,
              type: "GET",
              dataType: "json",
              contentType: "application/json; charset=utf-8",
              success: function(response) {
                console.log(response);
                infoList.push(response.info);
                savelist.push(response.index);
              }
            }));
        });
        console.log(infoList);
        jQuery.when.apply(null, tmpdefer).done(function() {
          console.log("hello");
          jQuery.ajax({
              url: "/generate",
              type: "GET",
              dataType: "json",
              data: {"list":savelist} ,
              contentType: "application/json; charset=utf-8",
              success: function(response) {
                var output=response;
           if(output==null){
             alter("There is no possile timetable with selected courses.");
           }
           else{
            window.localStorage.setItem("list", null);
            window.localStorage.setItem("infoList", JSON.stringify(infoList));
            window.localStorage.setItem("output", JSON.stringify(output));
            window.localStorage.setItem("count", 0);
            window.location.href = "/timetable.html";
        }
      }
    });
  });

};
  ele.appendChild(course_link)
  document.getElementById("savedcourse").appendChild(ele);
    };

}

function login(){

  //var usern = document.getElementById("username").value;
  //var passw = document.getElementById("password").value;
  var dt ={"username":"james","password":"123"}
  jQuery.ajax({
            url: "/login",
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(dt),
            success: function(response) {
              var res = response.coursesl
              //alert(res)
              addSavedList(res)
            }
          })

}

function sign(){
  var un = document.getElementById("un").value;
  var pw = document.getElementById("pw").value;
  var em = document.getElementById("ea").value;
  var data ={username:un,password:pw,email:em}
  var http = new XMLHttpRequest();
  //var params = "username=test&password=test";
  //http.open("POST", "/login", true);
  //http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //http.setRequestHeader("Content-type", "application/JSON");
  http.open("POST", "/signup", true);
  http.setRequestHeader("Content-type", "application/json");
  http.onreadystatechange = function() {
    //alert("her1");
    //alert(this.status);

  if (this.readyState == 4 && this.status == 403) {
          //var response = this.responseText;
          alert("username or email already exist")// use response in here.
      }else if (this.readyState == 4 && this.status == 200){
          alert("account created,please login on the home page");

      }else if(this.readyState == 4 && this.status == 400){
          alert("please provide username or email or password");

      }

  }
  http.send(JSON.stringify(data));
}

//add serached course in cart
function add_course (id){

    var input = document.getElementById("input"+id).value;
    var change = input.toUpperCase();
    //detect which session
    if(session ==-1){
      session=id;
    }
    if(id==0 )
      change = change + "H1F";
    else if(id == 1)
      change = change + "H1S";
    else
      change = change + "H1F";

    //session not been select
    if(session != id){
      alert("You can not select multipile session ");
    }
    //reach maximum workload
    else if(count>4){
      alert("You have reached maximum courseload")
    }
    else{

      var found ;
      var info;
      //send data
      jQuery.ajax({
          url: "/courses?code="+change,
          type: "GET",
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          success: function(response) {
              found =response.index;
              if(found != -1){
                info=response.info;
              }
              var found_sw = 0;
              //check if the course is already add to list
              for(var j=0; j<list.length;j++){
                if(list[j]==found)
                  found_sw=1;
              }

              if(found == -1){
                alert("Course name not found");
                if(count ==0)
                  session =-1;
              }
              else if(found_sw == 1){
                alert("Course already added");
              }
              else{
                //add the course in the list
                list.push(found);

                //add sort buttons
              /*  if(count == 0){
                  var tar = document.getElementById("sort_menu");

                  var sort_time = document.createElement("button");
                  sort_time.setAttribute("id","s_t");
                  sort_time.innerHTML="Sort by Time";

                  var sort_loc = document.createElement("button");
                  sort_loc.setAttribute("id","s_l");
                  sort_loc.innerHTML="Sort by Location";

                  var sort_prof = document.createElement("button");
                  sort_prof.setAttribute("id","s_p");
                  sort_prof.innerHTML="Sort by Professor";

                  tar.appendChild(sort_time);
                  tar.appendChild(sort_loc);
                  tar.appendChild(sort_prof);
                }*/

                //create the field for course
                var ele = document.createElement("div");
                ele.setAttribute("class","course w3-list-group-item");
                ele.setAttribute("id",found);


                var delete_but = document.createElement("button");
                delete_but.setAttribute("class","delet_button");
                var delete_img = document.createElement("img");
                delete_img.setAttribute("src","img/delete.png");
                delete_img.setAttribute("style","width:15px;height:15px");

                var course_link = document.createElement("a");
                course_link.setAttribute("href",info.link);
                course_link.setAttribute("target","_blank");
                course_link.innerHTML=info.code;
                delete_but.appendChild(delete_img);

                delete_but.onclick = function(){
                  var temp =[];
                  //remove the item from array list
                  for(var k=0; k<list.length;k++){
                    if(list[k] != ele.id)
                      temp.push(list[k]);
                  }

                 //remove the sort button
                  if(count ==1){
                  /*  document.getElementById("s_t").remove();
                    document.getElementById("s_l").remove();
                    document.getElementById("s_p").remove();*/
                    session -1;
                  }
                  list=temp;

                  ele.remove();
                  count--;
                  update_cart();
                }
                ele.appendChild(course_link);
                ele.appendChild(delete_but);
                document.getElementById("coursefeed").appendChild(ele);
                count++;
                update_cart();
              }

          }
      });


    }
}

//idetify different session
Home.id_season=function(){
    document.getElementById("add0").addEventListener("click",function(){
      add_course(0);
    })
    document.getElementById("add1").addEventListener("click",function(){
      add_course(1);
    })
    document.getElementById("add2").addEventListener("click",function(){
      add_course(2);
    })

}

//set up the page
Home.init = function(){
  session=-1;
  count=0;
  login();
  var tmp=[ { "_id": "58defc94734d1d01a23989ce",
    "username": "james",
    "courses": [ "CSC165H1F", "CSC207H1F", "CSC301H1F" ] },
  { "_id": "58df5055f36d2878e036ad9f",
    "username": "james",
    "courses": [ "CSC207H1F", "CSC301H1F" ] } ];
  //addSavedList(courselist);
  update_cart();
  this.id_season();
  this.generate_timetable();
}
//initializing home page
Home.init();
