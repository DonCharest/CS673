/*  Client facing API for Chat management functions.
    - Retrieve existing cards (GET)
    Use async/await to give functions synchronous behavior.
*/
const router = require('express').Router();
const {Chat} = require('../../models/Chat');

// All routes go to ./api/chat/
router.route('/chat/:project/')

// Retrieve ALL Chat messages for a project.
.get(async function (req,res){
    let messages = await Chat.find({project:req.params.project});
    res.status(200).send({chat: messages});
});

module.exports = router;