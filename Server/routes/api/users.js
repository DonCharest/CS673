const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

// User Model
const User = require("../../models/User");

// @route GET  api/users Log a user out
// @route POST api/users
// @desc Register new user
// @access Public

router.get("/logout", (req, res) => {
    req.logout()
    res.redirect("/")
});

router.post("/", (req, res) => {
  const { displayName, name, email, password } = req.body;

  // Simple validation
  if (!displayName || !name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields " });
  }

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ msg: "User already exists " });

    const newUser = new User({
      displayName,
      name,
      email,
      password
    });

   //Delete a user
  User.findOneAndRemove({ email }).then(err => {
    if (err) return res.status(400).json({ msg: "Error deleting User " });
    });

    // Create salt & hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {
          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email
                }
              });
            }
          );
        });
      });
    });
  });
});

module.exports = router;
