const crypto = require('crypto');

function generateTokenKey(length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

const tokenKey = generateTokenKey(32); // Generate a 32-character token key

console.log(tokenKey); // Output the generated token key
