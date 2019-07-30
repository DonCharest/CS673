const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// The Card.comment schema tracks user defined comments on a Card.
var projectList = new mongoose.Schema({
  projectID:{
      type: String, 
      required: true
  }
})



// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  register_date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    default: "user"
  },
  projects:[projectList]
});

module.exports = User = mongoose.model("user", UserSchema);
