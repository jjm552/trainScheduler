 window.onload = function() {

 // Initialize Firebase
   var config = {
    apiKey: "AIzaSyBloxVQBhiVKGfywpyxeKsYEA5H7W2-rp0",
    authDomain: "jjm552-traintime.firebaseapp.com",
    databaseURL: "https://jjm552-traintime.firebaseio.com",
    storageBucket: "jjm552-traintime.appspot.com",
    messagingSenderId: "572645551642"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  var trainName = '';
  var destination = '';
  var firstTrainTime = '';
  var frequency = '';
  var nextrrival = '';
  var minutesAway = '';


  $("#submit-button").on("click", function(){

  	event.preventDefault();

  	trainName = $("#trainName-input").val().trim();
  	destination = $("#destination-input").val().trim();
  	firstTrainTime = $("#firstTrainTime-input").val().trim();
    frequency = $("#frequency-input").val().trim();
    
    
    var fttConverted = moment(firstTrainTime, "hh:mm").subtract(1,"years");
    console.log(fttConverted);
    
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm"));
    
    var diffTime = moment().diff(moment(fttConverted), "minutes");
    console.log("Difference in time: " + diffTime);

    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    var tMinuetsTillTrain = frequency - tRemainder;
    console.log("Minutes Till Train: " + tMinuetsTillTrain);

  	
    database.ref().push({
  		trainName: trainName,
  		destination: destination,
  		firstTrainTime: firstTrainTime,
      frequency: frequency,
      tMinuetsTillTrain: tMinuetsTillTrain
  	});
  });

  database.ref().on("child_added", function(childSnapShot){

    var fttConverted = moment(firstTrainTime, "hh:mm").subtract(1,"years");
    console.log(fttConverted);
    
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("hh:mm"));
    
    var diffTime = moment().diff(moment(fttConverted), "minutes");
    console.log("Difference in time: " + diffTime);

    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    var tMinuetsTillTrain = frequency - tRemainder;
    console.log("Minutes Till Train: " + tMinuetsTillTrain);

    var nextTrain = moment().add(tMinuetsTillTrain, "minutes");
    console.log("Arrival time: " + moment(nextTrain).format("hh:mm"));

    var tblRow = $('<tr>');

  	tblRow.append('<td>' + childSnapShot.val().trainName + '</td>');
  	tblRow.append('<td>' + childSnapShot.val().destination + '</td>');
  	tblRow.append('<td>' + childSnapShot.val().frequency + '</td>');
    tblRow.append('<td>' + moment(nextTrain).format("hh:mm") + '</td>');
  	tblRow.append('<td>' + childSnapShot.val().tMinuetsTillTrain + '</td>');

  	$(".table").append(tblRow);

  }, function(errorObj) {
  	console.log("Error: " + errorObj.code);
  });

 }