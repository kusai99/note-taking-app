const User = require("../models/User");

//Class to handle data access
const UserRepository = {
  findByUsername: (username) => User.findOne({ where: { username } }),
  createUser: (userData) => User.create(userData),
};

module.exports = UserRepository;
