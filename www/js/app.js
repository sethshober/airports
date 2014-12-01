// FIRST TEST WITH FIREBASE...USING A PUBLIC DATA SET THEY HAVE ON AIRPORTS...IONIC TEST AS WELL

var air = angular.module('starter', ['ionic'])

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

});


//working on dynamic page header
// air.controller('airSelectController', function($scope) {
//   $scope.airTag = airportSelect;
// })


// example of grabbing airport data of child SFO (San Francisco)
// airportsRef.child("SFO").on("value", delayInfo);
// function delayInfo(snapshot) {
//   var airport = snapshot.val();
//   console.log("Delay: " + airport.delay + " reason: " + airport.status.reason);
// }


// CREATE FIREBASE REFERENCE FOR AIRPORT DELAY OPEN DATA SET
var airportsRef = new Firebase("https://publicdata-airports.firebaseio.com/");

// GLOBALS
var airportList = document.getElementById("airportList");
var airportCodes = [];
var airportSelect = airportList.options[airportList.selectedIndex].value;


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


// GRAB A SINGLE SNAPSHOT, WHICH IS DATA FROM FIREBASE
airportsRef.once('value', function(snapshot){
    // for each object (airport)
    snapshot.forEach(function(child){
    airportObj = child.val();
    // create array of airport codes (with thought to use for dynamically adding to Select)
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
airportsRef.child(airportSelect).on("value", airportInfo);

// RUNS ON SELECT OPTION CHANGE, GRABS SELECTED AIRPORT DATA, WILL PERSIST AND AUTOMATICALLY UPDATE ANY CHANGES 
function optionChange() {

  airportSelect = airportList.options[airportList.selectedIndex].value;

  console.log(airportSelect);//testing

  airportsRef.child(airportSelect).on("value", airportInfo);

  console.log(airportSelect);//testing
}

// GRAB AIPORT INFO AND WEATHER FROM PUBLIC DATA SET AND UPDATE DOM
function airportInfo(snapshot) {
  var airport = snapshot.val();//val will give nice object of child in snapshot data
  var temp = airport.weather.temp;

  //find index value of F from string of farenheit and celcius numbers
  var n = temp.indexOf("F");
  //starting at the beginning of C & F string take content up to where there is an F (this will grab the farenheit number)
  var tempF = temp.substring(0, n);

  var airportInfo = document.getElementById("airportInfo");
  var airportTag = document.getElementById('airportTag');
  var weather = document.getElementById('weather');
  var delay = document.getElementById('delay');
  
  console.log(snapshot.val());//testing

  airportTag.innerHTML = airport.IATA;
  
  weather.innerHTML = Math.round(tempF) + "&deg;";
  
  //show delay status and info
  if(airport.delay === false) {
    delay.innerHTML = "Things are running smoothly. You're good to go.";
    //set correct class as on or off
    delay.classList.toggle('delay-green', true);
    delay.classList.toggle('delay-red', false);
  } else {
    delay.innerHTML = "Delays are occurring due to " + airport.status.reason + ".";
    //set correct class as on or off
    delay.classList.toggle('delay-red', true);
    delay.classList.toggle('delay-green', false);
  }
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

 //$("#weather").attr("data-icon",icons[]);





