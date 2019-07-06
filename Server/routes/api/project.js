/*  Client facing API for Story management functions.
    - Create new stories (POST)
    - Retrieve existing stories (GET)
    - Update existing stories (PUT)
    - Delete stories (DELETE)
    Use async/await to give functions synchronous behavior. 
*/
const router = require("express").Router();
const { Project } = require("./../../models/Project");

//***** Added a GET by ID route to view a Project  *****/
router.get("/projects/:id", (req, res) => {
  Project.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(404).json({ success: false }));
});

//***** Added a Delete route to remove a Project from the DB  *****/
router.delete("/projects/:id", (req, res) => {
  Project.findById(req.params.id)
    .then(project => project.remove().then(() => res.json({ success: true })))
    .catch(err => res.status(404).json({ success: false }));
});

// All routes go to ./api/projects/
router
  .route("/projects")

  // ***** Updated GET route to pull all projects to client ******/

  //     .get(function (req,res){
  //       res.status(200).send('it works now make it do something useful');
  //   })
  .get((req, res) => {
    Project.find()
      .sort({ date: -1 })
      .then(projects => res.json(projects));
  })

  // CREATE a new TracKing Project.
  .post(async function(req, res) {
    let newProject = new Project({
      name: req.body.name,
      shortCode: req.body.shortCode,
      effortUnit: req.body.effortUnit,
      dateCreated: Date.now(),
      description: req.body.description,
      projectMembers: req.body.projectMembers
      // epics:[Epic],
      // requirements:[String]
    });

    await newProject.save(err => {
      if (err) {
        res.status(500).send(`Project save failed: ${err.message}`);
      } else {
        res.status(200).send("Project saved");
      }
    });
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
router.put("/projectuser", async function(req, res) {
  let project = await Project.findOne({ _id: req.body.projectID });

  for (let newUserIDX in req.body.userID) {
    let dupeFound = false;
    for (let dupeCheck in project.projectMembers) {
      if (
        project.projectMembers[dupeCheck].userID === req.body.userID[newUserIDX]
      ) {
        dupeFound = true;
        break;
      }
    }

    if (dupeFound === false) {
      await project.projectMembers.push({
        userID: req.body.userID[newUserIDX]
      });
    }
  }

  await project.save(err => {
    if (err) {
      res.status(500).send(`Project user could not be added: ${err.message}`);
    } else {
      res.status(200).send("Project user added");
    }
  });
});

module.exports = router;
