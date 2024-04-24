document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM content loaded");

  // Your web app's Firebase configuration
  const firebaseConfig = {
      apiKey: "AIzaSyCbmsGIvQ2ouzWR14RHqFsyoD14OE_c5B0",
      authDomain: "fir-ee0b4.firebaseapp.com",
      databaseURL: "https://fir-ee0b4-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "fir-ee0b4",
      storageBucket: "fir-ee0b4.appspot.com",
      messagingSenderId: "412761372358",
      appId: "1:412761372358:web:ade1d4747e0307f563c9c7",
      measurementId: "G-31DDE1MKCD"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize variables
  const auth = firebase.auth();
  const database = firebase.database();

  // Set up the register function
  function register() {
      console.log("Register button clicked");
      // Get all input fields
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      var full_name = document.getElementById('full_name').value;
      var role = document.getElementById('role').value;

      // Validate input fields
      if (!validate_email(email) || !validate_password(password)) {
          alert('Email or Password is invalid!');
          return;
      }
      if (!validate_field(full_name) || !validate_field(role)) {
          alert('One or More Extra Fields is invalid!');
          return;
      }

      // Move on with Auth
      auth.createUserWithEmailAndPassword(email, password)
          .then(function() {
              // Declare user variable
              var user = auth.currentUser;

              // Add this user to Firebase Database
              var database_ref = database.ref();

              // Create User data with both date and time
              var user_data = {
                  email: email,
                  full_name: full_name,
                  role: role,
                  last_login: new Date().toLocaleString() // Include both date and time
              };

              // Push to Firebase Database
              database_ref.child('users/' + user.uid).set(user_data);

              // Done
              alert('User Created!!');
          })
          .catch(function(error) {
              alert(error.message);
          });
  }

  // Set up the login function
  function login() {
      console.log("Login button clicked");
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;

      // Validate input fields
      if (!validate_email(email) || !validate_password(password)) {
          alert('Email or Password is invalid!');
          return;
      }

      auth.signInWithEmailAndPassword(email, password)
          .then(function() {
              var user = auth.currentUser;
              var database_ref = database.ref('users/' + user.uid);

              var options = {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
              };

              var user_data = {
                  last_login: new Date().toLocaleString('en-US', options)
              };

              database_ref.update(user_data)
                  .then(function() {
                      // Fetch user role from the database
                      database_ref.once('value', function(snapshot) {
                          var userData = snapshot.val();
                          var role = userData.role; // Fetch user role
                          // Redirect based on user role
                          if (role.toLowerCase() === 'doctor') {
                              // Redirect doctors to their schedule page
                              window.location.href = 'doctor_homepage.html';
                          } else if (role.toLowerCase() === 'patient') {
                              // Redirect patients to book appointment page
                              window.location.href = 'home.html';
                          } else {
                              // Handle invalid role
                              alert('Invalid role specified');
                          }
                      });
                  });
          })

      .catch(function(error) {
          alert(error.message);
      });
  }

  document.getElementById('loginButton').addEventListener('click', login);
  document.getElementById('registerButton').addEventListener('click', register);

  // Validate Functions
  function validate_email(email) {
      expression = /^[^@]+@\w+(\.\w+)+\w$/
      if (expression.test(email) == true) {
          return true
      } else {
          return false
      }
  }

  function validate_password(password) {
      if (password.length < 6) {
          return false
      } else {
          return true
      }
  }

  function validate_field(field) {
      if (field == null) {
          return false
      }
      if (field.length <= 0) {
          return false
      } else {
          return true
      }
  }
});