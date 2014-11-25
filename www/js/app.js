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

// GRAB AIPORT INFO AND WEATHER FROM PUBLIC DATA SET
function airportInfo(snapshot) {
  var airport = snapshot.val();
  console.log("Delay: " + airport.delay + " reason: " + airport.status.reason);

  var temp = airport.weather.temp;
  var n = temp.indexOf("F");
  var tempF = temp.substring(0, n);
  var airportInfo = document.getElementById("airportInfo");
  airportInfo.innerHTML = airport.name + " Airport - " + airport.IATA + "<br/>Location: " + airport.city + ", " + airport.state + "<br/>Delay: " + airport.delay + "<br/>Reason: " + airport.status.reason + "<br/>Weather in " + airport.city + ": " + tempF + " &deg;F " + airport.weather.weather;
}