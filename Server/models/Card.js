/*  Card.js: Database schema for storing Project.Card data.
    - Store cards in MongoDB.
    - Cards include user stories/requirements, tasks and issues/bugs.
    - Cards may contain additional collections including Stage and Comments.
    REFERENCE: https://mongoosejs.com/docs/subdocs.html
*/
const mongoose = require('mongoose');
const immutablePlugin = require('mongoose-immutable');

// The Card.stage schema tracks the history of story stage changes
// as it progresses through development.
var stageSchema = new mongoose.Schema({
    stageName:{
        type: String, 
        required: true
    },
    startDate:{
        type: Date, 
        required: true, 
        default: Date.now,
        immutable: true
    },
    endDate:{
        type: Date, 
        required: false
    }
});
stageSchema.plugin(immutablePlugin);

// The Card.comment schema tracks user defined comments on a Card.
var commentSchema = new mongoose.Schema({
    commentText:{
        type: String, 
        required: true
    },
    projectMember:{
        type: String, 
        required: true,
        immutable: true
    },
    date:{
        type: Date, 
        default: Date.now,
        required: false,
        immutable: true
    }
})
commentSchema.plugin(immutablePlugin);

// The cardSchema holds all components of a story and its subdocuments.
var cardSchema = new mongoose.Schema({
    project: {
        type: String, 
        required: true,
        immutable: true
    },
    sprint:{
        type:String, 
        required: false
    },
    displayId: {
        type: String, 
        required: true,
        immutable: true
    },
    index:{
        type: Number, 
        required: false
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String, 
        required: true
    },
    createdBy:{
        type: String, 
        required: true,
        immutable: true
    },
    assignedTo:{
        type: String, 
        required: false
    },
    epic:{
        type: String, 
        required: false
    },
    priority:{
        type: String, 
        required: true, 
        default:"LOW"
    },
    type:{
        type: String, 
        required: true, 
        default:"REQUIREMENT"
    },
    load:{
        type: Number, 
        required: true,
        min: 1,
        max: 50
    },
    currentStage:{
        type: String, 
        required: true
    },
    stage:[stageSchema],
    comments:[commentSchema],
    related:[String]
});
cardSchema.plugin(immutablePlugin);

module.exports.Card = mongoose.model('Card', cardSchema);