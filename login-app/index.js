const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { Logtail } = require('@logtail/node'); // Import Logtail

const app = express();
const PORT = process.env.PORT || 3000;
const logtail = new Logtail('d2vYYBFukv6rYV1sKeufn87f'); // Initialize Logtail with your source token

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Simple user data for demonstration
const users = {
  user1: 'password1',
  user2: 'password2',
};

// Middleware to log login attempts
function logAttempt(username, success) {
  const message = `Login attempt: username=${username}, success=${success}`;
  console.log(message);

  // Append to a local log file
  fs.appendFileSync('login.log', `${message}\n`);

  // Send log to Better Stack using Logtail
  logtail.info(message).catch((error) => {
    console.error('Error sending log to Better Stack:', error);
  });
}

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username] === password) {
    logAttempt(username, true);
    res.send(`Welcome ${username}!`);
  } else {
    logAttempt(username, false);
    res.status(401).send('Invalid credentials');
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  res.send('You have been logged out');
});

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
