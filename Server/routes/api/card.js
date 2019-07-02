/*  Client facing API for Card management functions.
    - Create new cards (POST)
    - Retrieve existing cards (GET)
    - Update existing cards (PUT)
    - Delete cards (DELETE)
    Use async/await to give functions synchronous behavior.
*/
const router = require('express').Router();
const {Card} = require('../../models/Card');

// All routes go to ./api/cards/
router.route('/cards')

// Retrieve ALL stories matching ALL parameters in the request.
.get(async function (req,res){
    let card = await Card.find(req.body);
    res.status(200).send({cards:card});
}) // NOTE - NO SEMICOLON!!!

// CREATE a new TracKing Card (Requirement, Task or Issue/Bug).
// The initial stage is set to the default value "BACKLOG".
// REFERENCE: https://stackoverflow.com/questions/29532742/how-to-get-number-of-document-mongoose/29532923
.post(async function(req, res){

    /* Get the count of documents in the Card collection for the PROJECT.
        - Count + 1 is used as the initial card index AND the displayId Sequence.
        - The displayId is a human readable string combinging the Project.shortcode,
            some number of leading zeros and the Card.index value.
        REFERENCE: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    */
    let cardCount = 0;
    let shortcode = "PRJ";
    if(req.body.shortcode){
        shortcode = req.body.shortcode;
    }
    await Card.countDocuments({project: req.body.project}, function(err, count){
        cardCount = count;

        let newCard = new Card({
            project: req.body.project,
            sprint: req.body.sprint,
            displayId: String(shortcode).concat("-", String(cardCount + 1).padStart(6,"0")),
            index: cardCount + 1,
            description:req.body.description,
            createdBy:req.body.createdBy,
            assignedTo:req.body.assignedTo,
            epic:req.body.epic,
            priority:req.body.priority,
            type:req.body.type,
            load:req.body.load,
            stage:{
                stageName: "BACKLOG",
                startDate: Date.now(),
                endDate: null
            }
        });
        
        newCard.save((err) => {
            if(err){
                res.status(500).send(`Card save failed: ${err.message}`);
            }
            else{
                res.status(200).send('Card saved');
            }
        })
    })
}) // NOTE - NO SEMICOLON!!!

// Delete a card by _id: ADMIN ONLY!!!
.delete(async function(req, res){
    let deletedStory = await Card.findOneAndDelete({'_id': req.body._id});
    if(deletedStory){
        res.status(200).send(`Card delete success: ${deletedStory._id}`);
    }
    else {
        res.status(500).send(`Card delete failed: ${req.body._id}`)
    }
}) // NOTE - NO SEMICOLON!!!

// Update a card by ID to change information included in the request.body.
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
    updatedStory = await Card.findOneAndUpdate({"_id":req.body._id}, params);
    if(updatedStory){
        res.status(200).send(`Card update success: ${updatedStory._id}`);
    }
    else {
        res.status(500).send(`Card update failed: ${req.body._id}`)
    }
});
// END OF router.route('/cards').

// Target URL: */api/addrelated PUT
// Add a RELATED CARD ID to a card by pushing the text String.
router.put('/addrelated', async function (req,res){
    let card = await Card.findOne({"_id":req.body._id});
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
router.put('/cardcomment', async function (req,res){
    let card = await Card.findOne({"_id":req.body._id});

    // Create the next comment
    await card.comments.push({
        'commentText':req.body.comment,
        'projectMember':req.body.username,
        'date':req.body.date
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
router.put('/stagechange', async function (req,res){
    
    // We want to find the stage array entry with endDate == NULL.
    // The position of this entry is passed in $.
    let today = Date.now();
    let card = null;
    await Card.findOneAndUpdate(
        {"_id": req.body._id, "stage.endDate":null},
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