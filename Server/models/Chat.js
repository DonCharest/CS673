/*  Chat_DB.js: Database schema for storing Project.Chat data.
    - Store chat messages in MongoDB.
*/
const mongoose = require('mongoose');

var chatSchema = new mongoose.Schema({
    project: {type: String, required: true},
    datestamp:{type: Date, required: true},
    user:{type: String, required: true},
    message:{type: String, required: false}
});

module.exports.Chat = mongoose.model('Chat', chatSchema);
