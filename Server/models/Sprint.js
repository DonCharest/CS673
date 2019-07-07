/*  Sprint.js: Schema for storing Sprint data.
    - Store sprints in MongoDB.
    - Sprints include the start and end date for a sprint
    - Sprints contain start date, end date, and the ObjectID from the Cards collection
*/

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CardSchema = require('./Card');


const sprintSchema = new Schema({
    sprintID: Number,
    startDate: Date,
    endDate: Date,
    card: [CardSchema],
    project: { type: mongoose.Schema.Types.ObjectId,
              ref: 'Project'
             }
});

module.exports.Sprint = mongoose.model("sprint", sprintSchema);