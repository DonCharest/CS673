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
const {CardTrack} = require('../../models/CardTrack');

// All routes go to ./api/cards/
router.route('/cards')

// Retrieve ALL stories matching ALL parameters in the request.
.get(async function (req, res){
    let card = await Card.find(req.body);
    res.status(200).json({cards:card});
}) // NOTE - NO SEMICOLON!!!

// CREATE a new TracKing Card (Requirement, Task or Issue/Bug).
// REFERENCE: https://stackoverflow.com/questions/29532742/how-to-get-number-of-document-mongoose/29532923
.post(async function(req, res){

    // Get the project shortCode from the Project object.
    // If there is no project or short code, set it to 'NULL'.
    // If a shortCode is provided in the request body, that will override the Project.shortCode.
    let shortcode = "NULL";
    let cardProject = await Project.findOne({_id:req.body.project});
    shortcode = cardProject.shortCode;
    if(req.body.shortcode){
        shortcode = req.body.shortcode;
    }

    /*  CardTrack keeps track of the total number of Cards EVER CREATED for a Project.
        - Add one to this number and combine it with the Project ShortCode to get the 
            displayId, a human readable abbreviation for the Card.
        The count of documents in the Card collection for the PROJECT + 1 is used as 
            the initial card index (it's ).
        REFERENCE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    */
    // Find the CardTrack for the project or create a new one.
    // So annoying, MongoDB uses {returnNewDocument: true}, Mongoose uses {new: true}
    let cardTrack = false;
    cardTrack = await CardTrack.findOneAndUpdate(
        {projectId: req.body.project},
        {"$inc":{"totalCount": 1}},
        {new: true}
    );
    if(! cardTrack){
        console.log("Creating new CardTrack");
        cardTrack = new CardTrack({
            projectId: req.body.project,
            totalCount: 1
        });
        cardTrack.save();
    };
    console.log("Card Track: ", cardTrack)

    let indexCount = 0;
    await Card.countDocuments({project: req.body.project}, function(err, count){
        indexCount = count;

        let card = new Card({
            project: req.body.project,
            sprint: req.body.sprint,
            displayId: String(shortcode).concat("-", String(cardTrack.totalCount).padStart(6,"0")),
            index: indexCount + 1,
            title: req.body.title,
            description:req.body.description,
            createdBy:req.body.createdBy,
            assignedTo:req.body.assignedTo,
            epic:req.body.epic,
            priority:req.body.priority,
            type:req.body.type,
            load:req.body.load,
            currentStage: req.body.stageName,
            stage:{stageName: req.body.stageName}
        });
        
        card.save((err) => {
            if(err){
                res.status(500).json({
                    success: false,
                    error: `Card save failed: ${err.message}`
                });
            }
            else{
                res.status(200).json({success: true});
            }
        });
    });
}) // NOTE - NO SEMICOLON!!!

// Update a card by ID to change information included in the request.body.
// REFERENCE: https://stackoverflow.com/questions/47877333/when-using-findoneandupdate-how-to-leave-fields-as-is-if-no-value-provided-i
.put(async function(req, res){

    // What values are being updated in the request body?
    let params = {};
    for(let prop in req.body){

        //  Do not use this route for updating INDEX, STAGE, COMMENTS or RELATED CARDS.
        if(['index', 'comment', 'related', 'stage', 'currentStage'].indexOf(prop) >= 0){
            let message = "";
            switch (prop){
                case 'index': 
                    message = "WARNING: Use /api/cardindex to UPDATE Card.index";
                    break;
                case 'comment':
                    message = "WARNING: Use /api/cardcomment to UPDATE Card.comments";
                    break;
                case 'related':
                    message = "WARNING: Use /api/addrelated to UPDATE Card.related";
                    break;
                case 'stage': 
                    message = "WARNING: Use /api/stagechange to UPDATE Card.stage";
                    break;
                case 'currentStage':
                    message = "WARNING: Use /api/stagechange to UPDATE Card.currentStage";
            }
            res.status(200).json({
                success: false,
                error: message
            });
        }
        else if(req.body[prop]){
            params[prop] = req.body[prop];
        }
    };

    // Report what was updated.
    let card = false;
    card = await Card.findOneAndUpdate({"_id":req.body.id}, params, {new: true});
    if(card){
        res.status(200).json({
            success: true,
            cards: card
        });
    }
    else {
        res.status(500).json({
            success: false,
            error: `Card update failed: ID ${req.body.id}`
        });
    }
});
// END OF router.route('/cards').

// Target URL: */api/cards/card_id DELETE
router.delete('/cards/:id/', async function(req, res){
    let card = await Card.findOneAndDelete({'_id': req.params.id});

    if(card){

        // Decrement the index of remaining cards in the project.
        await Card.updateMany(
            {
                "project": card.project,
                "index": {$gt: card.index}
            },
            {$inc:{index: -1}}
        );
        
        res.status(200).json({
                success: true,
                cards: card
            });
    }
    else {
        res.status(500).json({
            success: false,
            error: `Card delete failed: ID ${req.params.id}`
        });
    }
});

// Target URL: */api/addrelated PUT
// Add a RELATED CARD ID to a card by pushing the text String.
router.put('/addrelated', async function (req, res){
    let card = await Card.findOne({"_id":req.body.id});
    await card.related.push(req.body.related);
    
    // Save the changes
    await card.save((err) => {
        if(err){
            res.status(500).json({
                success: false,
                error: `Card relation save failed: ${err.message}`
            });
        }
    });

    // Return the updated card
    card = false;
    card = await Card.findOne({"_id":req.body.id});
    if(card){
        res.status(200).json({
            success: true,
            cards: card
        });
    }
    else {
        res.status(500).json({
            success: false,
            error: `Card relation saved but not found: ID ${req.body.id}`
        });
    }
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
            res.status(500).json({
                success: false,
                error: `Card comment save failed: ${err.message}`
            });
        }
    });

    // Return the updated card
    card = false;
    card = await Card.findOne({"_id":req.body.id});
    if(card){
        res.status(200).json({
            success: true,
            cards: card
        });
    }
    else {
        res.status(500).json({
            success: false,
            error: `Card comment saved but not found: ID ${req.body.id}`
        });
    }
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

    // Return the updated card
    card = false;
    card = await Card.findOneAndUpdate({"_id":req.body.id}, params, {new: true});
    if(card){
        res.status(200).json({
            success: true,
            cards: card
        });
    }
    else {
        res.status(500).json({
            success: false,
            error: `Card index update failed: ID ${req.body.id}`
        });
    }
});

//  Target URL: */api/stagechange PUT
/*  Change the card stage:
    - The card stages are stored as a collection of documents, with each document being 
        the history of a card in one stage. 
    - When a card changes stage:
        1. It's current stage is given an end date,
        2. Create the new stage with a start date of now.
// REFERENCE: https://stackoverflow.com/questions/26156687/mongoose-find-update-subdocument
*/
router.put('/stagechange', async function (req, res){
    
    // Find the Card of interest.
    let card = null;
    await Card.findOne({"_id": req.body.id}, (err,doc) =>{
        if(err){
            res.status(500).json({
                success: false,
                error: `Card find in stagechange failed: ${err.message}`
            });
        }
        else{
            card = doc;
        }
    });

    // We want to find the LAST stage array entry.
    // The position of this entry is passed in $.
    await Card.findOneAndUpdate(
        {"_id": card._id, "stage._id":card.stage[card.stage.length - 1]._id},
        {
            "$set":{
                "stage.$.endDate": Date.now(),
                "currentStage":req.body.stageName
            }
        },
        {new: true},

        // The updated Card is passed to the callback as 'doc'.
        function(err, doc){
            if(err){
                res.status(500).json({
                    success: false,
                    error: `Card stage endDate AND currentStage update failed: ${err.message}`
                });
            }
            else{
                card = doc;
            }
        }
    );

    // Create the next stage and push it into the Card.stage array with an endDate of null.
    // If the next stage is "DONE", set an end date.
    // The startDate of the new stage is set in the Card model.
    if(`${req.body.stageName}`.toUpperCase() == "DONE"){
        await card.stage.push({
            'stageName':req.body.stageName,
            'endDate':Date.now()
        });
    }
    else{
        await card.stage.push({
            'stageName':req.body.stageName,
            'endDate':null
        });
    }
    
    // Save the changes
    await card.save((err) => {
        if(err){
            res.status(500).json({
                success: false,
                error: `Card new stage save failed: ${err.message}`
            });
        }
        else{
            res.status(200).json({success: true});
        }
    });
});
module.exports = router;