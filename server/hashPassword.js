// Run this script with: node hashPassword.js
// It will print the bcrypt hash for your admin password.

const bcrypt = require('bcryptjs');

const password = 'admin@123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) throw err;
  console.log('Bcrypt hash for "admin@123":', hash);
});
