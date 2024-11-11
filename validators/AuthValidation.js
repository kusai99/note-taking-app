const { body } = require("express-validator");
const AuthValidation = {
  register: [
    body("username")
      .isLength({ min: 4, max: 16 })
      .withMessage("Username must be between 4 and 16 characters."),
    body("password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .withMessage(
        "Password must contain at least one uppercase, one lowercase, one number, and one special character."
      ),
    body("username").notEmpty().withMessage("Username is required."),
    body("password").notEmpty().withMessage("Password is required."),
    body("email").isEmail().withMessage("Email is invalid."),
  ],
  login: [
    body("username").notEmpty().withMessage("Username is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
};

module.exports = AuthValidation;
