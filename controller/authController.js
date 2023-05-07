const bcrypt = require("bcryptjs");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");

module.exports.registerUserCtrl = async (req, res) => {
  try {
    // validate user input using Joi schema
    const { error } = validateRegisterUser(req.body);

    // check for validation errors
    if (error) {
      // check if the error was due to a pattern validation failure
      if (error.details[0].type === "string.pattern.base") {
        // throw custom error message if pattern validation fails
        throw new Error(
          "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long"
        );
      } else {
        // throw the validation error message if it was not a pattern validation failure
        throw new Error(error.details[0].message);
      }
    }

    // check if user already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      // throw error message if user already exists
      throw new Error("User already exists");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // create a new user object with the validated and hashed user input
    const newUser = new User(req.body);

    // save the new user to the database
    await newUser.save();

    // send success response to the client
    res.status(201).json({
      message: "You have successfully registered, please log in.",
      newUser,
    });
  } catch (err) {
    // send error response to the client
    res.status(400).json({ message: err.message });
  }
};
module.exports.loginUserCtrl = async (req, res) => {
  try {
    // Validate user input using Joi schema
    const { error } = validateLoginUser(req.body);
    if (error) {
      // If validation fails, return a 400 error with the error message
      return res.status(400).json({ message: error.details[0].message });
    }

    // Find user by email in the database
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // If user doesn't exist, return a 401 error with a message
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the password input to the hashed password in the database using bcrypt
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      // If password doesn't match, return a 401 error with a message
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If email and password match, return the user object with a 200 status code
    res.status(200).json(user);
  } catch (error) {
    // If an error occurs, return a 400 error with the error message
    res.status(400).json({ message: error.message });
  }
};
