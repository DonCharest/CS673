/*  Client facing API for Card management functions.
    - Create new cards (POST)
    - Retrieve existing cards (GET)
    - Update existing cards (PUT)
    - Delete cards (DELETE)
    Use async/await to give functions synchronous behavior.
*/
const router = require('express').Router();
const {Project} = require('../../models/Project');
const {Card} = require('../../models/Card');

// All routes go to ./api/cards/
router.route('/cards')

// Retrieve ALL stories matching ALL parameters in the request.
.get(async function (req, res){
    let card = await Card.find(req.body);
    res.status(200).send({cards:card});
}) // NOTE - NO SEMICOLON!!!

// CREATE a new TracKing Card (Requirement, Task or Issue/Bug).
// The initial stage is set to the default value "BACKLOG".
// REFERENCE: https://stackoverflow.com/questions/29532742/how-to-get-number-of-document-mongoose/29532923
.post(async function(req, res){

    // Get the project shortCode from the Project object.
    // If there is no project or short code, set it to 'UNDEFINED'
    let shortcode = "UNDEFINED";
    let cardProject = await Project.findOne({_id:req.body.project});
    shortcode = cardProject.shortCode;
    if(req.body.shortcode){
        shortcode = req.body.shortcode;
    }

    /* Get the count of documents in the Card collection for the PROJECT.
        - Count + 1 is used as the initial card index AND the displayId Sequence.
        - The displayId is a human readable string combinging the Project.shortcode,
            some number of leading zeros and the Card.index value.
        REFERENCE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    */
    let cardCount = 0;
    await Card.countDocuments({project: req.body.project}, function(err, count){
        cardCount = count;

        let newCard = new Card({
            project: req.body.project,
            sprint: req.body.sprint,
            displayId: String(shortcode).concat("-", String(cardCount + 1).padStart(6,"0")),
            index: cardCount + 1,
            title: req.body.title,
            description:req.body.description,
            createdBy:req.body.createdBy,
            assignedTo:req.body.assignedTo,
            epic:req.body.epic,
            priority:req.body.priority,
            type:req.body.type,
            load:req.body.load,
            stage:{stageName: req.body.stageName}
        });
        
        newCard.save((err) => {
            if(err){
                res.status(500).send(`Card save failed: ${err.message}`);
            }
            else{
                res.status(200).send(`Card save success`);
            }
        });
    })
}) // NOTE - NO SEMICOLON!!!

// Delete a card by id: ADMIN ONLY!!!
.delete(async function(req, res){
    let deletedStory = await Card.findOneAndDelete({'_id': req.body.id});

    if(deletedStory){

        // Decrement the index of remaining cards in the project.
        await Card.updateMany(
            {
                "project": deletedStory.project,
                "index": {$gt: deletedStory.index}
            },
            {$inc:{index: -1}}
        );
        
        res.status(200).send(`Card delete success: ${deletedStory._id}`);
    }
    else {
        res.status(500).send(`Card delete failed: ${req.body.id}`);
    }
}) // NOTE - NO SEMICOLON!!!

// Update a card by ID to change information included in the request.body.
//  NOTE - Do not use this route for updating INDEX.
// REFERENCE: https://stackoverflow.com/questions/47877333/when-using-findoneandupdate-how-to-leave-fields-as-is-if-no-value-provided-i
.put(async function(req, res){

    // What values are being updated in the request body?
    let params = {};
    for(let prop in req.body){
        if(req.body[prop] = "index"){
            res.status(200).send("WARNING: Use /api/cardindex to UPDATE Card.index");
        }
        else if(req.body[prop]){
            params[prop] = req.body[prop];
        }
    };

    // Report what was updated.
    let updatedStory = false;
    updatedStory = await Card.findOneAndUpdate({"_id":req.body.id}, params);
    if(updatedStory){
        res.status(200).send(`Card update success: ${updatedStory._id}`);
    }
    else {
        res.status(500).send(`Card update failed: ${req.body.id}`);
    }
});
// END OF router.route('/cards').

// Target URL: */api/addrelated PUT
// Add a RELATED CARD ID to a card by pushing the text String.
router.put('/addrelated', async function (req, res){
    let card = await Card.findOne({"_id":req.body.id});
    await card.related.push(req.body.related);
    
    // Save the changes
    await card.save((err) => {
        if(err){
            res.status(500).send(`Card relation save failed: ${err.message}`);
        }
        else{
            res.status(200).send('Card relation saved');
        }
    })
});


// Target URL: */api/cardcomment PUT
// Add a comment to a card
router.put('/cardcomment', async function (req, res){
    let card = await Card.findOne({"_id":req.body.id});

    // Create the next comment
    await card.comments.push({
        'commentText':req.body.comment,
        'projectMember':req.body.username
    });
    
    // Save the changes
    await card.save((err) => {
        if(err){
            res.status(500).send(`Card comment save failed: ${err.message}`);
        }
        else{
            res.status(200).send('Card comment saved');
        }
    })
});

// Target URL: */api/cardindex PUT
/* Change the card index from index = i to index = j:
    - The Card.index parameter is meant to be a sorting value for the Project Backlog.
    - The Index of a card is initially the order of its creation in the Project, such
        that the Nth card has Index = N.
    - If the Index of a card is changed, the index of other cards needs to be adjusted
        to maintain the sort order.
*/
router.put('/cardindex', async function (req, res){

    // Find the original card we are moving:
    //  Project
    //  Starting index (i),
    //  Target index (j) is in the request body
    let card = await Card.findOne({"_id":req.body.id});
    let indexJ = Number(req.body.index);

    // Increment all Cards.index where (index < j && index >= i).
    // REFERENCE: https://stackoverflow.com/questions/5241344/multiple-inc-updates-in-mongodb
    if(card.index  > indexJ){
        await Card.updateMany(
            {
                "project": card.project,
                "index": {$lt: card.index, $gte: indexJ}
            },
            {$inc:{index: 1}}
        );
    } else {
        await Card.updateMany(
            {
                "project": card.project,
                "index": {$gt: card.index, $lte: indexJ}
            },
            {$inc:{index: -1}}
        );
    }


    // Update the target card, make sure to not set everything else to null (see PUT above).
    let params = {};
    for(let prop in req.body){
        if(req.body[prop]){
            params[prop] = req.body[prop];
        }
    };

    let updatedStory = false;
    updatedStory = await Card.findOneAndUpdate({"_id":req.body.id}, params);
    if(updatedStory){
        res.status(200).send(`Card index update success: ${updatedStory._id}`);
    }
    else {
        res.status(500).send(`Card index update failed: ${req.body.id}`);
    }
});

//  Target URL: */api/stagechange PUT
/*  Change the card stage:
    - The card stages are stored as a collection of documents, with each document being 
        the history of a card in one stage.
    - When a card is created, it is added to BACKLOG by default with a start date of 
        Date.now and no end date. 
    - When a card changes stage:
        1. It's current stage is given an end date,
        2. Create the new stage with a start date of now.
// REFERENCE: https://stackoverflow.com/questions/26156687/mongoose-find-update-subdocument
*/
router.put('/stagechange', async function (req, res){
    
    // We want to find the stage array entry with endDate == NULL.
    // The position of this entry is passed in $.
    let today = Date.now();
    let card = null;
    await Card.findOneAndUpdate(
        {"_id": req.body.id, "stage.endDate":null},
        {
            "$set":{
                "stage.$.endDate": today
            }
        },
        function(err, doc){
            if(err){
                res.status(500).send(`Card stage update failed: ${err.message}`);
            }
            else{
                card = doc;
            }
        }
    );
    
    // Create the next stage
    await card.stage.push({
        'stageName':req.body.stageName,
        'startDate':today,
        'endDate':null
    });
    
    // Save the changes
    await card.save((err) => {
        if(err){
            res.status(500).send(`Card stage update failed: ${err.message}`);
        }
        else{
            res.status(200).send(`Card stage update success: ${card._id}`);
        }
    })
});

module.exports = router;