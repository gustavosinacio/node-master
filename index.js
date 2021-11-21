/**
 *
 * Primary API file
 *
 */

console.clear();
console.log(new Date());

// Dependencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
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

const server = http.createServer((req, res) => {
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
  let buffer = "";

  // creates event listener for when data is sent and binds to it's **stream**
  req.on("data", (data) => {
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
});

server.listen(config.port, () => {
  console.log(
    `${config.envName.toUpperCase()} Listening on port ${config.port}`
  );
});
