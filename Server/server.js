/* Initialize and onfigure application middleware: 
    
    - Configure session with storage.
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
const mongoConnect = require("connect-mongo");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const expressSession = require("express-session");
const mongoose = require("mongoose");
const path = require("path");

// Initialize local files
const authConfig = require("./config/auth_config.js");
const dbConfig = require("./config/db_config.js");

// Configure application middleware: Express application server
const app = express();
const router = express.Router();

// Configure application middleware: HTTP communication server and Socket.io
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// Configure application middleware: Header parser
app.use(cookieParser());
app.use(cors());

// Configure application middleware: Request parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configure application middleware: MongoDB connection
mongoose
  .connect(dbConfig.url, { useNewUrlParser: true })
  .then(() => console.log("Connected to tracKing_DB"))
  .catch(err => console.error("Connection to Mongo:tracKing_DB Failed", err));
mongoose.set("useCreateIndex", true); // REFERENCE: https://mongoosejs.com/docs/deprecation.html
mongoose.set("useFindAndModify", false); // REFERENCE: https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.Promise = global.Promise;

// Configure application middleware: User session and authentication
const MongoStore = mongoConnect(expressSession);
const session_config = {
  secret: authConfig.PrivateKey,
  resave: false, // don't save unmodified sessions
  saveUninitialized: false, // create the session when something is stored
  store: new MongoStore({
    // store sessions in MongoDB
    mongooseConnection: mongoose.connection,
    autoRemove: "native",
    autoRemoveInterval: 60 * 24 // Automatically remove expired sessions once daily
  })
};
app.use(expressSession(session_config));

// Initialize routes to the client with static files.
//  https://flaviocopes.com/react-server-side-rendering/
router.use(express.static(path.resolve(__dirname, "..", "Client/build")));

// Server routes are dynamic.
app.use(require("./routes"));

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
    //  console.log('message: ' + msg);
    // Push msg to DB
    io.emit("chat message", msg);
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
