/**
 * Tasks helpers
 */

// Dependencies
const crypto = require("crypto");
const config = require("./config");

const helpers = {};

// Create a SHA256 hash
helpers.hash = (string) => {
  if (typeof string === "string" && string.length > 0) {
    const hash = crypto
      .createHmac("sha256", config.hashingSecret)
      .update(string)
      .digest("hex");
    return hash;
  }
  return false;
};

// Parse json in all cases withou throwing
helpers.parseJSONToObject = (string) => {
  try {
    return JSON.parse(string);
  } catch (err) {
    return {};
  }
};

module.exports = helpers;
