/**
 * Creat and export configuration variables
 */

// Container for all the environments

const environments = {
  staging: {
    httpPort: 3001,
    httpsPort: 3003,
    envName: "staging",
    hashingSecret: "thisIsASecret",
  },
  production: {
    httpPort: 5000,
    httpsPort: 5001,
    envName: "production",
    hashingSecret: "thisIsREALASecret",
  },
};

// determine which environment was passed from the command line
const currentEnvironment =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// Check that the current environment is one of the available above.
// If not, default to staging
const exportEnv =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

// Export the module
module.exports = exportEnv;
