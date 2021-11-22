/**
 * Request handlers
 */

// Dependencies
const _data = require("../lib/data");
const helpers = require("./helpers");

const handlers = {};

handlers.users = (data, callback) => {
  const acceptableMethods = ["POST", "GET", "PUT", "DELETE"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

// USERS -----------------------------------------------------------------------
handlers._users = {};
/**
 * Requited data: firstName, lastName, email, password
 * Optional data: NONE
 */
handlers._users.POST = (data, callback) => {
  const { firstName, lastName, email, password } = data.payload;

  const validFirstName =
    typeof firstName === "string" && firstName.trim().length > 0
      ? firstName.trim()
      : null;

  const validLastName =
    typeof lastName === "string" && lastName.trim().length > 0
      ? lastName.trim()
      : null;

  const validEmail =
    typeof email === "string" && email.trim().length > 0 ? email.trim() : null;

  const validPassword =
    typeof password === "string" && password.length > 6 ? password : null;

  if (validFirstName && validLastName && validEmail && validPassword) {
    // make sure user doesn't exist
    _data.read("users", validEmail, (err, data) => {
      if (err) {
        // Hash password
        const hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          const userObject = {
            firstName: validFirstName,
            lastName: validLastName,
            email: validEmail,
            hashedPassword,
          };

          // Store user
          _data.create("users", validEmail, userObject, (err) => {
            if (!err) {
              callback(201, { message: "User created" });
            } else {
              console.log(982170, err);
              callback(500, { error: "Could not create user" });
            }
          });
        } else {
          callback(500, { error: "Error hashing password" });
        }
      } else {
        // user exists
        callback(400, { error: "Email already used" });
      }
    });
  } else {
    callback(400, { error: "Invalid or missing fields" });
  }
};

/**
 * Required data: email
 * Optional data: none
 * TODO only let an authed user access their object
 */
handlers._users.GET = (data, callback) => {};
handlers._users.PUT = (data, callback) => {};
handlers._users.DELETE = (data, callback) => {};
//------------------------------------------------------------------------------

handlers[""] = (_, callback) => {
  callback(200, { info: "API_V1" });
};

handlers.ping = (_, callback) => {
  callback(200);
};

handlers.notFound = (data, callback) => {
  console.log(98217, "error", data);
  callback(404, { message: "not found" });
};

module.exports = handlers;
