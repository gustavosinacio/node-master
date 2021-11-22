/**
 * Lib for storing and editing data
 */

// Dependencies
const fs = require("fs");
const path = require("path");
const { isBoxedPrimitive } = require("util/types");

// Container for the module
const lib = {};

// Base directory of the data folder
lib.baseDirectory = path.join(__dirname, "../.data/");

lib.create = (dir, file, data, callback) => {
  fs.open(
    path.join(lib.baseDirectory, dir, file + ".json"),
    "wx",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        //Convert data to string
        const stringData = JSON.stringify(data);

        // Write to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, () => {
              if (!err) {
                callback(false);
              } else {
                callback("error closing new file");
              }
            });
          } else {
            callback("Error, writing to new file");
          }
        });
      } else {
        callback("Could not create new file. It may already exists");
      }
    }
  );
};

// Read data from a file
lib.read = (dir, file, callback) => {
  fs.readFile(
    path.join(lib.baseDirectory, dir, file + ".json"),
    {
      encoding: "utf-8",
    },
    (err, data) => {
      callback(err, data);
    }
  );
};

// Update data inside a file
lib.update = (dir, file, data, callback) => {
  fs.open(
    path.join(lib.baseDirectory, dir, file + ".json"),
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // Convert data to string
        const stringData = JSON.stringify(data);

        // Truncate existing content on file
        fs.ftruncate(fileDescriptor, (err) => {
          if (!err) {
            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
              if (!err) {
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    callback(false);
                  } else {
                    callback("Error closing file");
                  }
                });
              } else {
                callback("Error writing to existing file");
              }
            });
          } else {
            callback("Error truncating existing file content");
          }
        });
      } else {
        callback("Could not open file for update");
      }
    }
  );
};

lib.delete = (dir, file, callback) => {
  // Unlink file
  fs.unlink(path.join(lib.baseDirectory, dir, file + ".json"), (err) => {
    if (!err) callback(false);
    else {
      callback("Error deleting file");
    }
  });
};

module.exports = lib;
