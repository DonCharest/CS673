/*  Story_DB.js: Database schema for storing Project.Story data.
    - Store stories in MongoDB.
    - Stories include user stories/requirements and issues/bugs.
    - Stories may contain additional collections including StoryStage and 
        Comments
    REFERENCE: https://mongoosejs.com/docs/subdocs.html
*/
const mongoose = require('mongoose');

// The StoryStage schema tracks the history of story stage changes
// as it progresses through development.
var stageSchema = new mongoose.Schema({
    stageName:{type: String, required: true, default: "BACKLOG"},
    startDate:{type: Date, required: true, default: Date.now},
    endDate:{type: Date, required: false}
});

// The Story model holds all components of a story and its subdocuments.
//  The Story.storyStage is an array of stageSchema documents.
//  The Story.comments is an array of strings.
module.exports.Story = mongoose.model('Story', new mongoose.Schema({
    project: {type: String, required: true},
    index:{type: Number, required: false},
    description:{type: String, required: true},
    createdBy:{type: String, required: true},
    assignedTo:{type: String, required: false},
    epic:{type: String, required: false},
    priority:{type: String, required: true, default:"LOW"},
    isIssue:{type: Boolean, required: true, default:false},
    load:{type: Number, required: false, default: 1},
    storyStage:[stageSchema],
    comments:[String]
}));

