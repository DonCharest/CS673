/*  Client facing API for Story management functions.
    - Create new stories (POST)
    - Retrieve existing stories (GET)
    - Update existing stories (PUT)
    - Delete stories (DELETE)
    Use async/await to give functions synchronous behavior. 
*/
const router = require("express").Router();
const { Project } = require("./../../models/Project");
const User = require("../../models/User");
// var mongoose = require('mongoose');

//***** Added a GET by ID route to view a Project  *****/
router.get("/projects/:id", (req, res) => {
  Project.findById(req.params.id)
    .then(project => res.json(project))
    .catch(err => res.status(404).json({ success: false }));
});

//***** Added a Delete route to remove a Project from the DB  *****/
router.delete("/projects/:id", (req, res) => {

  let userObj = User.findOne({ _id : "5d274564d7f93f49ad7f4394" });

  console.log("hallo");

  for (let projectIDX in userObj.projects) {
    if (
      userObj.projects[projectIDX].projectID === 
      req.params.id
    ) {
      userObj.projects.id(userObj.projects[projectIDX]._id).remove();
      userObj.save();
      break;
    }
  }

  Project.findById(req.params.id)
    .then(project => project.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

// All routes go to ./api/projects/
router
  .route("/projects")

  .get((req, res) => {
    Project.find()
      .sort({ date: -1 })
      .then(projects => res.json(projects));
  })

  // CREATE a new TracKing Project.
  // UPDATED 7/17/19: Auto populates project creator's e-mail address
  // into project member schema
  .post(async function(req, res) {

    let userObj = await User.findOne({
      _id: req.body.projectMembers[0].userID
    });

    let newProject = new Project({
      name: req.body.name,
      shortCode: req.body.shortCode,
      effortUnit: req.body.effortUnit,
      dateCreated: Date.now(),
      description: req.body.description,
      projectMembers: {
        userID: req.body.projectMembers[0].userID,
        userEmail: userObj.email
      }
    });

    newProject = await newProject.save((err, result) => {
      if (err) {
        res.status(500).send(`Project save failed: ${err.message}`);
      } else {
        res.status(200).send("Project saved");
      }

      userObj.projects.push({
        projectID: result._id
      });

      userObj.save();
    });

    // console.log("Hello world!");

  }) // NOTE - NO SEMICOLON!!!

  // Update a project to change information included in the request.
  // REFERENCE: https://stackoverflow.com/questions/47877333/when-using-findoneandupdate-how-to-leave-fields-as-is-if-no-value-provided-i
  .put(async function(req, res) {
    // What values are being updated in the request body?
    let params = {};
    for (let prop in req.body) {
      if (req.body[prop]) {
        params[prop] = req.body[prop];
      }
    }

    // Report what was updated.
    let updatedProject = false;
    updatedProject = await Project.findOneAndUpdate(
      { _id: req.body._id },
      params
    );
    if (updatedProject) {
      res.status(200).send(`Project update success: ${updatedProject._id}`);
    } else {
      res.status(500).send(`Project update failed: ${req.body._id}`);
    }
  });

// Target URL: */api/projectuser PUT
// Add a user to a project
router
  .route("/projectuser")

  // ADD ADDITIONAL USERS (updated 7/17/19 to auto-add e-mails)
  .put(async function(req, res) {
    let project = await Project.findOne({ _id: req.body.projectID });

    for (let newUserIDX in req.body.projectMembers[0].userID) {
      // new users in payload
      let dupeFound = false;
      let dupeFoundUser = false;

      // Updated 7/17/19 to auto-add e-mail addresses to Project Members
      let userObj = await User.findOne({
        _id: req.body.projectMembers[0].userID[newUserIDX]
      });

      // checking members in project for duplicates
      for (let dupeCheck in project.projectMembers) {
        // current users
        if (
          project.projectMembers[dupeCheck].userID ===
          req.body.projectMembers[0].userID[newUserIDX]
        ) {
          dupeFound = true;
          break;
        }
      }

      // checking projects in user for duplicates
      for (let dupeCheck in userObj.projects) {
        if (
          userObj.projects[dupeCheck].projectID === 
          req.body.projectID
        ) {
          dupeFoundUser = true;
          break;
        }
      }

      if (dupeFound === false) {
        await project.projectMembers.push({
          userID: req.body.projectMembers[0].userID[newUserIDX],
          userEmail: userObj.email
        });
      }

      if (dupeFoundUser === false) {
        await userObj.projects.push({
          projectID: req.body.projectID
        });
      }

      await userObj.save();
    }

    await project.save(err => {
      if (err) {
        res.status(500).send(`Project user could not be added: ${err.message}`);
      } else {
        res.status(200).send("Project user added");
      }
    });


  })

  // DELETE USER (one at a time) FROM PROJECT
  .delete(async function(req, res) {
    let project = await Project.findOne({ _id: req.body.projectID });

    
    /** I updated this route to be exactly like Delete Epic.
     * I needed to do it this way since I can only bind the object id
     * At this point, the userID prop has not been retreived and saved
     * to state, and is undefined.
     */

    var usertoDelID = "2";

    for (let userToDelIDX in project.projectMembers) {
      // find mongoID of projectMembers obj from userID
      if (project.projectMembers[userToDelIDX]._id === req.body.projectMembers) {
        
        usertoDelID = project.projectMembers[userToDelIDX].userID;
        break;
      }
    }
    console.log(usertoDelID);

    let userObj = await User.findOne({ _id: usertoDelID });


    for (let userToDelIDX in userObj.projects) {
      // find mongoID of projectMembers obj from userID
      if (userObj.projects[userToDelIDX].projectID === req.body.projectID) {
        
        userObj.projects.id(userObj.projects[userToDelIDX]._id).remove();
        break;
      }
    }

    project.projectMembers.id(req.body.projectMembers).remove();

    await userObj.save();

    await project.save(err => {
      if (err) {
        res
          .status(500)
          .send(`Project member could not be deleted: ${err.message}`);
      } else {
        res.status(200).send("Project member deleted");
      }
    });
  });

router
  .route("/epic")

  // ADD NEW EPIC TO PROJECT
  .post(async function(req, res) {
    let project = await Project.findOne({ _id: req.body.projectID });

    await project.epics.push({
      epicName: req.body.epics
    });

    await project.save(err => {
      if (err) {
        res.status(500).send(`Project epic could not be added: ${err.message}`);
      } else {
        res.status(200).send("Project epic added");
      }
    });
  })

  // Delete Epic via ID
  // REFERENCE: https://stackoverflow.com/questions/47877333/when-using-findoneandupdate-how-to-leave-fields-as-is-if-no-value-provided-i
  .delete(async function(req, res) {
    let project = await Project.findOne({ _id: req.body.projectID });

    project.epics.id(req.body.epics).remove();

    await project.save(err => {
      if (err) {
        res
          .status(500)
          .send(`Project epic could not be deleted: ${err.message}`);
      } else {
        res.status(200).send("Project epic deleted");
      }
    });
  });

module.exports = router;
