/* API for Sprint
    Create a new sprint (POST)
    Get information about a sprint (GET)
    Update data related to a sprint (PUT)
    Remove a sprint (DELETE)
*/

const express = require("express");
const router = express.Router();

const Sprint = require('../../models/Sprint');
const Card = require('../../models/Card');

router.route('/sprint')

// Display data about a sprint
.get(async function (req, res) {

    let sprintCards = await Card.find({'sprint': req.body.id});
    res.status(200).json(sprintCards);
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
                res.status(200).send('The sprint has been saved');
            }
        })
    }) 
})



//Delete a sprint
.delete(async function(req, res){
    let deletedSprint = await Sprint.findOneAndDelete({'_id': req.body.id});
    if(deletedSprint){
        res.status(200).send(`The sprint has been deleted: ${deletedSprint._id}`);
    } else {
        res.status(500).send('The sprint was not deleted');
    }
})
//TO DO: reset/decrement indices when deleting

//Change attributes of a sprint
.put(async function(req,res){
    let params = {};
    for(let prop in req.body){
        if(req.body[prop] = "index"){
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