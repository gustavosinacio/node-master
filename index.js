/**
 *
 * Primary API file
 *
 * command to create ssl certificate:
 * $ openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
 *
 */

console.clear();
console.log(new Date());

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const fs = require("fs");

const config = require("./config");

// handlers
const handlers = {
  sample: (data, callback) => {
    console.log(98212, data);
    callback(406, { name: "sample" });
  },
  notFound: (data, callback) => {
    console.log(98217, "error", data);
    callback(404);
  },
};

// router
const router = {
  sample: handlers.sample,
};

// All the server logic for both the http and https server
const unifiedServer = (req, res) => {
  // Variables catching --------------------------------------------------------
  //Get the url and parse it
  const parsedUrl = url.parse(req.url, true);
  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  // Get the query string as an object
  const queryStringObject = parsedUrl.query;
  // Get the method
  const method = req.method.toUpperCase();
  // Get the headers as an object
  const headers = req.headers;
  // Get the payload, if there is one
  const decoder = new StringDecoder("utf-8");
  // ---------------------------------------------------------------------------

  let buffer = "";

  // creates event listener for when data is sent and binds to it's **stream**
  req.on("data", (data) => {
    console.log(98210, "Reading data...");
    buffer += decoder.write(data);
  });

  // on data end
  req.on("end", () => {
    buffer += decoder.end();

    const chosenHandler = router[trimmedPath]
      ? router[trimmedPath]
      : handlers.notFound;

    //construct data object to be sent to the handler
    const data = {
      headers,
      method,
      payload: buffer,
      queryStringObject,
      trimmedPath,
    };

    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode === "number" ? statusCode : 200;

      // Use the payload called by the handler, or default to empty object
      payload = typeof payload === "object" ? payload : {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Send the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
};

// HTTP ------------------------------------------------------------------------
// Instantiate the HTTP server
const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
  console.log(
    `${config.envName.toUpperCase()} Listening on http port ${config.httpPort}`
  );
});
// -----------------------------------------------------------------------------

// HTTPS -----------------------------------------------------------------------
// Instantiate the HTTPS server
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
  console.log(
    `${config.envName.toUpperCase()} Listening on https port ${
      config.httpsPort
    }`
  );
});
// -----------------------------------------------------------------------------
