/**
 * Request handlers
 */

// Dependencies

const handlers = {};

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
