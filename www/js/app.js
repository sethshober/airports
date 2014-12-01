// FIRST TEST WITH FIREBASE...USING A PUBLIC DATA SET THEY HAVE ON AIRPORTS...IONIC TEST AS WELL

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})




// CREATE FIREBASE REFERENCE FOR AIRPORT DELAY OPEN DATA SET
var airportsRef = new Firebase("https://publicdata-airports.firebaseio.com/");

// GLOBALS
var airportList = document.getElementById("airportList");
var airportCodes = [];
var initialAirport = airportList.options[airportList.selectedIndex].value;


 // LOCALSTORAGE
// Wait for device API libraries to load
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available

function onDeviceReady() {
    window.localStorage.setItem("key", "value");
    
    var keyname = window.localStorage.key(0);
    // keyname is now equal to "key"
    var value = window.localStorage.getItem("key");
    // value is now equal to "value"
    console.log(keyname);
    console.log(value);
    // window.localStorage.removeItem("key");
    // window.localStorage.setItem("key2", "value2");
    // window.localStorage.clear();
    // localStorage is now empty
}


// EXAMPLE OF GRABBING SINGLE AIRPORT DATA
// airportsRef.child("SFO").on("value", airportInfo);
// function airportInfo(snapshot) {
//   var airport = snapshot.val();
//   console.log("Delay: " + airport.delay + " reason: " + airport.status.reason);
// }




// GRAB A SINGLE SNAPSHOT
airportsRef.once('value', function(snapshot){
  // for each object (airport)
    snapshot.forEach(function(child){
    airportObj = child.val();
    // create array of airport codes
    if(typeof airportObj.IATA == 'string'){
      airportCodes.push(airportObj.IATA);  
    }
  })
  console.log(airportCodes); //testing
})

// TRYING TO DYNAMICALLY ADD AIRPORTS TO SELECT
// function addAirportCodes(){
//  var option = document.createElement("option");
//  for(var i = 0; i < airportCodes.length; i ++) {
//      option.value = airportObj.IATA;
//      option.text = airportObj.IATA;
//      airportList.add(option);
//  }
// }

// function addOption() {
//  var option = document.createElement("option");
//  option.value = "test";
//  option.text = "test";
//  airportList.add(option);
// }

// addOption();


// GRAB AIRPORT INFO ON INITIAL SELECTED OPTION, WILL PERSIST AND AUTOMATICALLY UPDATE ANY CHANGES
airportsRef.child(initialAirport).on("value", airportInfo);

// RUNS ON SELECT OPTION CHANGE, GRABS SELECTED AIRPORT DATA, WILL PERSIST AND AUTOMATICALLY UPDATE ANY CHANGES 
function optionChange() {
  //var airportList = document.getElementById("airportList");
  var airportSelect = airportList.options[airportList.selectedIndex].value;

  console.log(airportSelect);

  airportsRef.child(airportSelect).on("value", airportInfo);

  console.log(airportSelect);
}

// GRAB AIPORT INFO AND WEATHER FROM PUBLIC DATA SET AND UPDATE DOM
function airportInfo(snapshot) {
  var airport = snapshot.val();
  var temp = airport.weather.temp;
  var n = temp.indexOf("F");
  var tempF = temp.substring(0, n);
  var airportInfo = document.getElementById("airportInfo");
  var airportTag = document.getElementById('airportTag');
  var weather = document.getElementById('weather');
  var delay = document.getElementById('delay');
  
  console.log(snapshot.val());


  //$("#weather").attr("data-icon",icons[]);



  airportTag.innerHTML = airport.name + " Airport - " + "<span>" + airport.IATA + "</span>";
  
  weather.innerHTML = Math.round(tempF) + "&deg;";
  
  if(airport.delay === false) {
    delay.innerHTML = "Things are running smoothly. You're good to go.";
  } else {
    delay.innerHTML = "Delays are occurring due to " + airport.status.reason + ".";
  }

  //airportInfo.innerHTML = airport.name + " Airport - " + airport.IATA + "<br/>Location: " + airport.city + ", " + airport.state + "<br/>Delay: " + airport.delay + "<br/>Reason: " + airport.status.reason + "<br/>Weather in " + airport.city + ": " + tempF + " &deg;F " + airport.weather.weather;
}




// ICONS OBJECT FOR WEATHER (NOT ACTUALLY WORKING...JUST PLACEHOLDER)
var icons = { "clear-day" : "B", 
            "clear-night" : "C", 
            "rain" : "R", 
            "snow" : "G", 
            "sleet" : "X", 
            "wind" : "S", 
            "fog" :"N", 
            "cloudy" : "Y",
            "partly-cloudy-day" : "H", 
            "partly-cloudy-night" : "I"
          };





