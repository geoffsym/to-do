import Debug from "debug";
import app from "./backend/app.js";
import http from "http";

const debug = Debug("node-angular");

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) return val;
  else if (port >= 0) return port;
  else return false;
}

function onError(error) {
  if (error.syscall !== "listen") throw error;

  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
}

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
