/*  Client facing API for Story management functions.
    - Create new stories (POST)
    - Retrieve existing stories (GET)
    - Update existing stories (PUT)
    - Delete stories (DELETE)
    Use async/await to give functions synchronous behavior.
*/
const router = require('express').Router();
const {Story} = require('./../../models/Story_DB');

// All routes go to ./api/stories/
router.route('/stories')

.get(function (req,res){
    res.status(200).send('test ping success');
})

// CREATE a new TracKing Story (Requirement or Issue/Bug).
// The value of index is set to the count of records in the collection + 1.
// The initial stage is set to the default value "BACKLOG".
.post(async function(req, res){
    let newStory = new Story({
        project: req.body.project,
//      index: db.collection.count() + 1,
        index: 1,
        description:req.body.description,
        createdBy:req.body.createdBy,
        assignedTo:req.body.assignedTo,
        epic:req.body.epic,
        priority:req.body.priority,
        isIssue:req.body.isIssue,
        load:req.body.load,
        storyStage:{
            stageName: "BACKLOG",
            startDate: Date.now()
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
    await Story.findOneAndDelete({'_id': req.id}, (err) => {
        if(err){
            res.status(500).send(`Story delete failed: ${err.message}`);
        }
        else{
            res.status(200).send('Story deleted');
        }
    });
}) // NOTE - NO SEMICOLON!!!

// Update a story to change information included in the request.
.put(async function(req, res){
    let story = await Story.findOne({'_id':req.body.id});
    await story.findOneAndUpdate(
        {'_id': req.body.story._id},
        {'index': req.body.index},
        {'assignedTo': req.body.assignedTo},
        {'epic': req.body.epic},
        {'priority': req.body.priority}
    );
});
// END OF router.route('/stories').

// Target URL: */api/storycomment PUT
// Add a comment to a story
router.put('/storycomment', async function (req,res){
    let story = await Story.findOne({'_id':req.body.id});

    await story.comments.push({comments: req.body});
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
    // REFERENCE: https://stackoverflow.com/questions/10920651/get-the-latest-record-from-mongodb-collection/53474483
*/
router.put('/stagechange', async function (req,res){
    let story = await Story.findOne({'_id':req.body.id});

    // Add an end date to the last stage.
    let lastId = await story.find().limit(1).sort({$natural: -1}).id;
    await story.storyStage.findOneAndUpdate(
        {'_id': lastId},
        {'endDate': Date.now()}
    );

    // Create the next stage
    story.storyStage.push({
        'stageName': req.body.stageName,
        'startDate': Date.now()
    })
    
    // Save the changes
    await story.save((err) => {
        if(err){
            res.status(500).send(`Story stage save failed: ${err.message}`);
        }
        else{
            res.status(200).send('Story stage saved');
        }
    })
});

module.exports = router;