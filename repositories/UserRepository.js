const User = require("../models/User");

// Find a user by username
async function findByUsername(username) {
  try {
    return await User.findOne({ where: { username } });
  } catch (error) {
    throw new Error(`Error in findByUsername: ${error.message}`);
  }
}

// Create a new user
async function createUser(userData) {
  try {
    return await User.create(userData);
  } catch (error) {
    throw new Error(`Error in createUser: ${error.message}`);
  }
}

// Export the functions
module.exports = {
  findByUsername,
  createUser,
};
