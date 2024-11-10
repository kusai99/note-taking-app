const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const logger = require("../utils/Logger");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const AuthService = {
  //Hash the password and then register the user information
  register: async (username, password, email) => {
    try {
      logger.log(
        `Registering user with username: ${username}, email: ${email}`
      );

      const hashedPassword = await bcrypt.hash(password, 10);
      logger.log(`Hashed password for ${username}`);

      return await UserRepository.createUser({
        username,
        password: hashedPassword,
        email,
      });
    } catch (error) {
      logger.log(`Error registering user ${username}: ${error.message}`);
      throw new Error(`Failed to register user ${username}: ${error.message}`);
    }
  },

  //User login and JWT token creation and returning
  login: async (username, password) => {
    try {
      logger.log(`Login attempt for username: ${username}`);

      const user = await UserRepository.findByUsername(username);
      if (!user) {
        logger.log(`User with username ${username} not found.`);
        throw new Error("Invalid credentials");
      }

      logger.log(`Comparing password for user: ${username}`);
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        logger.log(`User ${username} logged in successfully`);
        return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
      } else {
        logger.log(`Invalid password for user ${username}`);
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      logger.log(`Error during login for user ${username}: ${error.message}`);
      throw new Error(`Login failed: ${error.message}`);
    }
  },
};

module.exports = AuthService;
