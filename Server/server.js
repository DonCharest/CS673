/* Initialize and onfigure application middleware: 
    - Establish database connection.
    - Establish application routes.
    - Configure and activate main server.
    - Configure and activate HTTP communication server.
    REFERENCE: https://vegibit.com/node-js-express-rest-api-tutorial/
    REFERENCE: https://socket.io/get-started/chat/#Introduction
    REFERENCE: https://www.tutorialspoint.com/socket.io/index.htm
*/
// Initialize application middleware.
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

// Initialize local files
const config = require("config");

// Configure application middleware: Express application server and router
const app = express();
const router = express.Router();

// Configure application middleware: Request parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure application middleware: MongoDB connection
// REFERENCE: https://mongoosejs.com/docs/deprecation.html

const db = config.get("mongoURI");
//const db = "mongodb://localhost:27017/tracKing_DB";

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("Connected to tracKing_DB"))
  .catch(err => console.error("Connection to Mongo:tracKing_DB Failed", err));
mongoose.Promise = global.Promise;

// Initialize routes to the client with static files.
//  https://flaviocopes.com/react-server-side-rendering/
app.use(express.static(path.resolve(__dirname, "..", "Client/build")));

app.use(require("./routes"));

// User Routes ******* We need to modify the server setup to make these routes work ******
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

// Configure application middleware: HTTP communication server and Socket.io
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const { Chat } = require("./models/Chat");

/* Initialize the Socket IO functionality:
    On connect
    On message
    On disconnect
*/
io.on("connection", function(socket) {
  // Read previous messages from DB
  // Load to UI page list
  console.log("A user has connected.");

  socket.on("chat message", function(msg) {
    console.log("message: " + msg.message);

    // Push the message object to the database to be loaded when the next user connects.
    let newMessage = new Chat({
      project: msg.project,
      datestamp: Date.now(),
      user: msg.user,
      message: msg.message
    });

    // If there is an error it is server side only, there is no response to send.
    newMessage.save(err => {
      if (err) {
        this.emit("error", new Error(`Card save failed: ${err.message}`));
      }
    });

    io.emit(
      "chat message",
      JSON.stringify({
        project: msg.project,
        datestamp: Date.now(),
        user: msg.user,
        message: msg.message
      })
    );
  });

  socket.on("disconnect", function() {
    console.log("A user disconnected");
  });
});

/* We can create project specific "namespaces" using the io.of() function and providing
    a name for the desired namespace target.
    Similarly, we can join "rooms" with the socket.join("room"+roomnumber) function within
    a namespace.
        see documentation on socket.join and socket.leave
*/

// Activate the communication server.
http.listen(3000, function() {
  console.log("HTTP Socket Server listening on *:3000");
});
