/*  Client facing API for Story management functions.
    - Create new stories (POST)
    - Retrieve existing stories (GET)
    - Update existing stories (PUT)
    - Delete stories (DELETE)
    Use async/await to give functions synchronous behavior.
*/
const router = require('express').Router();
const {Story} = require('../../models/Story');

// All routes go to ./api/stories/
router.route('/stories')

// GET one Story by id.
// We must iterate over the request body to get target id's.
.get(async function (req,res){
    
    let story = await Story.find({"_id": req.body.id});
    res.status(200).send({stories:story});
})

// CREATE a new TracKing Story (Requirement or Issue/Bug).
// The value of index is set to the count of records in the collection + 1.
// The initial stage is set to the default value "BACKLOG".
// REFERENCE: https://stackoverflow.com/questions/29532742/how-to-get-number-of-document-mongoose/29532923
.post(async function(req, res){

    // Get the count of documents in the Story collection.
    let storyCount = 0;
    await Story.countDocuments({}, function(err, count){
        storyCount = count;
    })

    let newStory = new Story({
        project: req.body.project,
        index: storyCount + 1,
        description:req.body.description,
        createdBy:req.body.createdBy,
        assignedTo:req.body.assignedTo,
        epic:req.body.epic,
        priority:req.body.priority,
        isIssue:req.body.isIssue,
        load:req.body.load,
        storyStage:{
            stageName: "BACKLOG",
            startDate: Date.now(),
            endDate: null
        }
    });
    await newStory.save((err) => {
        if(err){
            res.status(500).send(`Story save failed: ${err.message}`);
        }
        else{
            res.status(200).send('Story saved');
        }
    })
}) // NOTE - NO SEMICOLON!!!

// Delete a story by _id: ADMIN ONLY!!!
.delete(async function(req, res){
    let deletedStory = await Story.findOneAndDelete({'_id': req.body.id});
    if(deletedStory){
        res.status(200).send(`Story delete success: ${deletedStory._id}`);
    }
    else {
        res.status(500).send(`Story delete failed: ${req.body.id}`)
    }
}) // NOTE - NO SEMICOLON!!!

// Update a story to change information included in the request.
// REFERENCE: https://stackoverflow.com/questions/47877333/when-using-findoneandupdate-how-to-leave-fields-as-is-if-no-value-provided-i
.put(async function(req, res){

    // What values are being updated in the request body?
    let params = {};
    for(let prop in req.body){
        if(req.body[prop]){
            params[prop] = req.body[prop];
        }
    };

    // Report what was updated.
    let updatedStory = false;
    updatedStory = await Story.findOneAndUpdate({'_id': req.body.id}, params);
    if(updatedStory){
        res.status(200).send(`Story update success: ${updatedStory._id}`);
    }
    else {
        res.status(500).send(`Story update failed: ${req.body.id}`)
    }
});
// END OF router.route('/stories').

// Target URL: */api/storycomment PUT
// Add a comment to a story
router.put('/storycomment', async function (req,res){
    let story = await Story.findOne({'_id':req.body.id});

    await story.comments.push(req.body.comments);
    await story.save((err) => {
        if(err){
            res.status(500).send(`Story comment save failed: ${err.message}`);
        }
        else{
            res.status(200).send('Story comment saved');
        }
    })
});

//  Target URL: */api/stagechange
/*  Change the story stage:
        The story stages are stored as a collection of documents,
        with each document being the history of a story in one stage.
        When a story is created, it is added to BACKLOG by default
        with a start date of Date.now and no end date. 
        When a story changes stage:
            1. It's current stage is given an end date,
            2. Create the new stage with a start date of now.
    // REFERENCE: https://stackoverflow.com/questions/26156687/mongoose-find-update-subdocument
*/
router.put('/stagechange', async function (req,res){
    
    // We want to find the storyStage array entry with endDate == NULL.
    // The position of this entry is passed in $.
    let today = Date.now();
    let story = null;
    await Story.findOneAndUpdate(
        {"_id": req.body.id, "storyStage.endDate":null},
        {
            "$set":{
                "storyStage.$.endDate": today
            }
        },
        function(err, doc){
            if(err){
                res.status(500).send(`Story stage update failed: ${err.message}`);
            }
            else{
                story = doc;
            }
        }
    );
    
    // Create the next stage
    await story.storyStage.push({
        'stageName':req.body.stageName,
        'startDate':today,
        'endDate':null
    });
    
    // Save the changes
    await story.save((err) => {
        if(err){
            res.status(500).send(`Story stage update failed: ${err.message}`);
        }
        else{
            res.status(200).send(`Story stage update success: ${story._id}`);
        }
    })
});

module.exports = router;