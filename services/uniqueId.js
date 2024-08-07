const User = require("../model/user.model");

const generateUniqueUserId = async () => {
  const min = 100000000;
  const max = 999999999;
  let userId = Math.floor(Math.random() * (max - min + 1)) + min;
  let existingUserId = await User.findOne({ userId });
  while (existingUserId) {
    userId = await generateUniqueUserId();
    existingUserId = await User.findOne({ userId });
  }
  return userId;
};

module.exports = generateUniqueUserId;
