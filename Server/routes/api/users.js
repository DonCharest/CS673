const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");

// User Model
const User = require("../../models/User");

// @route GET api/users
// @desc GET All Users
// @access Private
router.get("/", auth, (req, res) => {
  User.find()
    .sort({ date: -1 })
    .then(users => res.json(users));
});

// @route GET api/user
// @desc GET User by ID
// @access Private
router.get("/:id", auth, (req, res) => {
  User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(404).json({ success: false }));
});

// @route DELETE api/users/:id
// @desc Delete a User
// @access Private
router.delete("/:id", auth, (req, res) => {
  User.findById(req.params.id)
    .then(user => user.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

// @route PUT api/users/:id
// @desc Update a User
// @access Private
router.put("/:id", auth, (req, res) => {
  var conditions = { _id: req.params.id };

  User.updateOne(conditions, req.body)
    .then(doc => {
      if (!doc) {
        return res.status(404).end();
      }
      return res.status(200).json(doc);
    })
    .catch(err => next(err));
});

// @route POST api/users
// @desc Register new user
// @access Public
router.post("/", (req, res) => {
  const { name, email, password, role, projects } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields " });
  }

  // Check for existing user
  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ msg: "User already exists " });

    const newUser = new User({
      name,
      email,
      password,
      role,
      projects
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
                  email: user.email,
                  role: user.role,
                  projects: user.projects
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
