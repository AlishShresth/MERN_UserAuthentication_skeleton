import User from "../models/user.model";
import extend from "lodash/extend"; // lodash is a JavaScript library that provides utility functions for common programming tasks, including the manipulation of arrays and objects
import errorHandler from "./error.controller";
import { Typography } from "@material-ui/core";

// definitions of the controller methods

// creates a new user with the user JSOn object that's received in the POST request from the frontend within req.body
const create = async (req, res) => {
  // asynchronous function
  const user = new User(req.body);
  try {
    await user.save(); // attempts to save the new user in the database after Mongoose performs a validation check on the data. An error or success response is returned to the requesting client
    // await returns a promise
    // causes the async function to wait until the returned Promise resolves, before the next lines of code are executed. If the Promise rejects, an error is thrown and caught in the catch block.
    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// finds all the users from the database, populates only the name, email, created, and updated fields in the resulting user list, and then returns this list of users as JSON objects in an array to the requesting client
const list = async (req, res) => {
  try {
    let users = await User.find().select("name email updated created");
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status("400").json({
        error: "User not found",
      });
    req.profile = user; // if a matching user is found in the database, the user object is appended to the request object in the profile key
    next(); // to propagate control to the next relevant controller function
    // For example, if the original request was to read a user profile, the next() call in userByID would go to the read controller function
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve user",
    });
  }
};

// When the Express app gets a GET request at '/api/users/:userId', it executes the userByID controller function to load the user by the userId value, followed by the read controller function
// The read function retrieves the user details from req.profile and removes sensitive information, such as the hashed_password and salt values, before sending the user object in the response to the requesting client.
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

// When the Express app gets a PUT request at '/api/users/:userId', similar to read, it loads the user with the :userId parameter value before executing the update controller function.
const update = async (req, res) => {
  try {
    let user = req.profile;
    user = extend(user, req.body); // extend and merge the changes that came in the request body to update the user data
    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined; // remove sensitive data before sending the user object in the response to the requesting client
    res.json(user);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// When the Express app gets a DELETE request at '/api/users/:userId', similar to read and update, it loads the user by ID and then the remove controller function is executed.
const remove = async (req, res) => {
  try {
    let user = req.profile;
    let deletedUser = await user.remove();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

export default { create, userByID, read, list, remove, update };
