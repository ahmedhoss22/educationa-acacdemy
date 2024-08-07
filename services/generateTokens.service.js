const crypto = require('crypto')
exports.generateToken = () => {
    return crypto.randomBytes(20).toString('hex');
  };