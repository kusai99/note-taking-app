const AuthService = require("../services/AuthService");
const AuthValidation = require("../validators/AuthValidation");
const { validationResult } = require("express-validator");

const AuthController = {
  //Validate the registration payload and register the new user
  register: [
    ...AuthValidation.register,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    async (req, res) => {
      try {
        const { username, password, email } = req.body;
        const user = await AuthService.register(username, password, email);
        res.status(201).json({
          message: "User registered successfully",
          userId: user.id,
        });
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  ],

  login: [
    //Validate the login  payload and register login

    ...AuthValidation.login,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
    async (req, res) => {
      try {
        const { username, password } = req.body;
        const token = await AuthService.login(username, password);
        res.json({ message: "Login successful", token });
      } catch (error) {
        res.status(401).json({ error: error.message });
      }
    },
  ],
};

module.exports = AuthController;