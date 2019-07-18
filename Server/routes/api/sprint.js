/* API for Sprint
    Create a new sprint (POST)
    Get information about a sprint (GET)
    Update data related to a sprint (PUT)
    Remove a sprint (DELETE)
*/

const express = require("express");
const router = express.Router();

const {Sprint} = require('../../models/Sprint');
const {Card} = require('../../models/Card');

// View sprint by id
router.get("/sprint/:id", (req, res) => {
    Sprint.findById(req.params.id)
      .then(sprint => res.json(sprint))
      .catch(err => res.status(404).json({ success: false }));
  });

  //edit sprint by id
  router.put("/sprint/:id", async function(req,res){
    let params = {};
    for(let prop in req.body){
        if(prop == "index"){
            res.status(200).send("WARNING: the sprint\'s index cannot be updated.");
        }
        else if(req.body[prop]){
            params[prop] = req.body[prop];
        }
    };

    let updatedSprint = false;
    updatedSprint = await Sprint.findOneAndUpdate({'_id': req.params.id}, params);
    if(updatedSprint){
        res.status(200).send(`The sprint was updated: ${updatedSprint._id}`);
    } else {
        res.status(500).send('The sprint was not updated');
    }
});

//Delete a sprint
router.delete("/sprint/:id", async function (req, res){
    let deletedSprint = await Sprint.findOneAndDelete({'_id': req.params.id});
    if(deletedSprint){

        // Decrement the index of remaining sprints in the project.
        await Sprint.updateMany(
            {
                "project": deletedSprint.project,
                "index": {$gt: deletedSprint.index}
            },
            {$inc:{index: -1}}
        );

        res.status(200).send(`The sprint has been deleted: ${deletedSprint._id}`);
    } else {
        res.status(500).send('The sprint was not deleted');
    }
});

//Close a sprint
router.put("/closesprint/:id", async function (req, res){
    await Sprint.findOneAndUpdate(
        {"_id": req.params.id},
        {
            "$set":{
                "endDate": Date.now()
            }
        },
        function(err, doc){
            if(err){
                res.status(500).send('The sprint was not closed');
            }
            else{
                res.status(200).send(`The sprint was closed: ${doc._id}`);
            }
        }
    );

});

// SPRINT ROUTES
router.route('/sprint')

//get all sprint cards for the project
.get((req, res) => {
    Card.find({project: req.body.project})
      .sort({ "stage.currentStage": 1 })
      .then(cards => res.json(cards));
})

// Create a new sprint
.post(async function(req, res){

        await Sprint.countDocuments({project: req.body.project}, function(err, count){

        sprintCount = count;

        let newSprint = new Sprint({
            index: sprintCount + 1,
            project: req.body.project,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            capacity: req.body.capacity,
            capacityUnit: req.body.capacityUnit
        });

         newSprint.save((err) => {
            if(err){
                res.status(500).send(`The sprint was not saved: ${err.message}`);
            } else {
                res.status(200).send(`The sprint has been saved: ${newSprint._id}`);
            }
        })
    }) 
})

//Change attributes of a sprint
.put(async function(req,res){
    let params = {};
    for(let prop in req.body){
        if(prop == "index"){
            res.status(200).send("WARNING: the sprint\'s index cannot be updated.");
        }
        else if(req.body[prop]){
            params[prop] = req.body[prop];
        }
    };

    let updatedSprint = false;
    updatedSprint = await Sprint.findOneAndUpdate({'_id': req.body.id}, params);
    if(updatedSprint){
        res.status(200).send(`The sprint was updated: ${updatedSprint._id}`);
    } else {
        res.status(500).send('The sprint was not updated');
    }
});

module.exports = router;
