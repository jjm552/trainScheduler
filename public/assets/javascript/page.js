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

     //User Authorization

     //get elements
     const txtEmail = document.getElementById("InputEmail");
     const txtPassword = document.getElementById("InputPassword");
     const btnLogin = document.getElementById("btnLogin");
     const btnSignUp = document.getElementById("btnSignUp");
     const btnLogout = document.getElementById("btnLogout");

     //add login event
     btnLogin.addEventListener('click', e => {
        //get email and pass
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();
        //sign in
        const promise = auth.signInWithEmailAndPassword(email,pass);
        promise.catch(e => console.log(e.message));
     });

     // add sign up event
     btnSignUp.addEventListener('click', e => {
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();
        //sign up
        const promise = auth.createUserWithEmailAndPassword(email,pass);
        promise.catch(e => console.log(e.message));
     });

     btnLogout,addEventListener('click', e =>{
        firebase.auth().signOut();
     });

     // add a real time listener
     firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser){
            console.log(firebaseUser);
            btnLogout.classList.remove('hide');
        } else {
            console.log('not logged in');
            btnLogout.classList.add('hide');
        }
     });



     //User input / database
     var database = firebase.database();

     var trainName = '';
     var destination = '';
     var firstTrainTime = '';
     var frequency = '';
     var nextrrival = '';
     var minutesAway = '';


     $("#submit-button").on("click", function() {

         event.preventDefault();

         trainName = $("#trainName-input").val().trim();
         destination = $("#destination-input").val().trim();
         firstTrainTime = $("#firstTrainTime-input").val().trim();
         frequency = $("#frequency-input").val().trim();


         var fttConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
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
         $('input').val('');
     });

     database.ref().on("child_added", function(childSnapShot) {

         var fttConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
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
