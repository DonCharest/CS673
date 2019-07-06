/*  Sprint.js: Schema for storing Sprint data.
    - Store sprints in MongoDB.
    - Sprints include the start and end date for a sprint
    - Sprints contain start date, end date, and the ObjectID from the Cards collection
*/

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const StorySchema = require('./Story');


const sprintSchema = new Schema({
    SprintID: Number,
    startDate: Date,
    endDate: Date,
    story: [StorySchema],
    project: { type: mongoose.Schema.Types.ObjectId,
              ref: 'Project'
             }
});

module.exports = Sprint = mongoose.model("sprint", sprintSchema);