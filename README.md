1. Install / update node libraries.
  - open a new terminal window
  - navigate to ```/Client```
  - type at the prompt> ```npm install```
  
  Lots of stuff will happen.
  
  - navigate to ```/Server```
    - type at the prompt> ```npm install```
  
  More stuff will happen.

2. Start the Mongo database (you must install MongoDB locally).
  - open a terminal window (same or new)
  - type at the prompt> ```mongod```
  
  The message should say something like "waiting for connections on port 27017"
  
 3. Start the application server
  - open a new terminal window (yes, a second one)
  - Navigate to ```/Server```
  - DEV: type at the prompt> ```nodemon server.js```
  
  The message should have two lines:
  HTTP Socket Server listening on *:3000
  Connected to tracKing_DB
 
We are using nodemon for DEV development.  Nodemon will watch your folders for changes in code files and automatically restart the Express server when changes are detected.  This is much easier than manually stopping (CTRL-C) and restarting the server for EVERY change. If you get ```'nodemon' is not recognized as an internal or external command``` in step 3 type ```npm install -g nodemon``` to install nodemon.

4. In your browser, navigate to ```http://localhost:3000``` and enjoy.

Oh, and read the OTHER Readme.md in /Client too.
