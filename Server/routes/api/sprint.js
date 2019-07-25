/* API for Sprint
    Create a new sprint (POST)
    Get information about a sprint (GET)
    Update data related to a sprint (PUT)
*/
const express = require("express");
const router = express.Router();
const { Sprint } = require("../../models/Sprint");

// SPRINT ROUTES
router.route("/sprint")

// Get the active sprint for the project, the projectid is in the 
// URL Query string parameters.
.get((req, res) => {
  Sprint.findOne(
    {
      project: req.query.projectid,
      startDate: {$lte : Date.now()},
      endDate: {$gte: Date.now()}
    },
    function(err,sprint){
      if(err){
        res.status(500).json({
          success: false,
          error: `GET Sprint failed: ${err.message}`
        });
      }
      else{
        res.status(200).json({
          success: true,
          sprint: sprint
        })
      }
    }
  );
})

// Create a new sprint
.post(async function(req, res) {

  // Set the initial sprintCount outside of the countDocument function for the FIRST sprint.
  let sprintCount = 0;
  await Sprint.countDocuments({ project: req.body.project }, function(err, count){
    sprintCount = count;

    let newSprint = new Sprint({
      index: sprintCount + 1,
      project: req.body.project,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      capacity: req.body.capacity,
      capacityUnit: req.body.capacityUnit
    });

    newSprint.save(err => {
      if(err){
        res.status(500).json({
            success: false,
            error: `Sprint save failed: ${err.message}`
        });
      }
      else{
          res.status(200).json({success: true});
      }
    });
  });
})

//Change attributes of a sprint
.put(async function(req, res) {
  let params = {};
  for (let prop in req.body) {
    if (prop == "index") {
      res.status(200).json({
        success: false,
        error: "WARNING: the sprint's index cannot be updated."
      });
    } 
    else if (req.body[prop]) {
      params[prop] = req.body[prop];
    }
  }

  let sprint = false;
  sprint = await Sprint.findOneAndUpdate({ _id: req.body.id }, params, {new: true});
  if(sprint){
    res.status(200).json({
        success: true,
        sprint: sprint
    });
  }
  else {
    res.status(500).json({
        success: false,
        error: `Sprint update failed: ID ${req.body.id}`
    });
  }
});
module.exports = router;
