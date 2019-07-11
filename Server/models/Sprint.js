/*  Sprint.js: Schema for storing Sprint data.
    - Store sprints in MongoDB.
    - Sprints include the start and end date for a sprint
    - Sprints contain start date, end date, and the ObjectID from the Cards collection
*/

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sprintSchema = new Schema({
    index: {type: Number, required: true},
    project: { type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
       },
    startDate: {type: Date, required: true, default: Date.now},
    endDate: {type: Date, required: true, default: (Date.now() + 7*24*3600*1000)},
    capacity: {type: Number, required: true, default: 0},
    capacityUnit: {type: String, required: true, default: 'hours'}
    
});

module.exports.Sprint = mongoose.model("sprint", sprintSchema);