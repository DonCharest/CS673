/*  Client facing API for Story management functions.
    - Create new stories (POST)
    - Retrieve existing stories (GET)
    - Update existing stories (PUT)
    - Delete stories (DELETE)
    Use async/await to give functions synchronous behavior. 
*/
const router = require('express').Router();
const {Project} = require('./../../models/Project_DB');

// All routes go to ./api/projects/
router.route('/projects')

.get(function (req,res){
    res.status(200).send('it works now make it do something useful');
})

// CREATE a new TracKing Project.
.post(async function(req, res){

    let newProject = new Project({
        name:req.body.name,
        shortCode:req.body.shortCode,
        effortUnit:req.body.effortUnit,
        dateCreated:Date.now(),
        description:req.body.description,
        projectMembers:req.body.projectMembers,
        // epics:[Epic],
        // requirements:[String]
    });

    await newProject.save((err) => {
        if(err){
            res.status(500).send(`Project save failed: ${err.message}`);
        }
        else{
            res.status(200).send('Project saved');
        }
    })
}) // NOTE - NO SEMICOLON!!!

// Update a project to change information included in the request.
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
    let updatedProject = false;
    updatedProject = await Project.findOneAndUpdate({'_id': req.body._id}, params);
    if(updatedProject){
        res.status(200).send(`Project update success: ${updatedProject._id}`);
    }
    else {
        res.status(500).send(`Project update failed: ${req.body._id}`)
    }
});



module.exports = router;