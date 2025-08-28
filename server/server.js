require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/database/db");
const initSocketServer = require('./src/socket/socket.server');
const httpServer = require('http').createServer(app)

connectDB();
initSocketServer(httpServer)

httpServer.listen(3000, () => {
  console.log("port is running on 3000");
});
