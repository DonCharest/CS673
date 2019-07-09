/* API for Sprint
    Create a new sprint (POST)
    Get information about a sprint (GET)
    Update data related to a sprint (PUT)
    Remove a sprint (DELETE)
*/

const express = require("express");
const router = express.Router();

const Sprint = require('./../../models/Sprint');
const Card = require('./../../models/Card');

router.route('/sprint')

// Display data about a sprint
.get(async function (req, res) {

    let sprintCards = await Card.find({"sprint": req.body.id});
    res.status(200).json(sprintCards);
})


// Create a new sprint
.post( async function(req, res){
    
    let newSprint = new Sprint({
        sprintID: req.body.sprintID,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        capacity: req.body.capacity
    });

    await newSprint.save((err) => {
        if(err){
            res.status(500).send(`The sprint was not saved: ${err.message}`);
        } else {
            res.status(200).send('The sprint has been saved');
        }
    })
})

//Delete a sprint
.delete(async function(req, res){
    let deletedSprint = await Sprint.findOneAndDelete({'sprintID': req.body.id});
    if(deletedSprint){
        res.status(200).send(`The sprint has been deleted: ${deletedSprint.sprintID}`);
    } else {
        res.status(500).send('The sprint was not deleted');
    }
})

//Change the start date of a sprint
.put('/startdatechange', async function(req,res){
    let updatedSprint = false;
    updatedSprint = await Sprint.findOneAndUpdate({'sprintID': req.body.id, 'startDate': req.body.startDate})
    if(updatedSprint){
        res.status(100).send(`The Sprint\'s start date was updated: ${updatedSprint.sprintID}`);
    } else {
        res.status(200).send('The sprint\'s start date was not updated');
    }
})

//Change the end date of a sprint
.put('/enddatechange', async function(req,res){
    let updatedSprint = false;
    updatedSprint = await Sprint.findOneAndUpdate({'sprintID': req.body.id, 'endDate': req.body.endDate})
    if(updatedSprint){
        res.status(100).send(`The Sprint\'s end date was updated: ${updatedSprint.sprintID}`);
    } else {
        res.status(200).send('The sprint\'s end date was not updated');
    }
});

module.exports = router;