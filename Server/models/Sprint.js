/*  Sprint.js: Schema for storing Sprint data in MongoDB.
    - Sprints contain start date, end date, and the ObjectID from the Project collection
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sprintSchema = new Schema({
    index: {type: Number, required: true},
    project: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    startDate: {type: Date, required: true},
    endDate: {type: Date, required: true},
    capacity: {type: Number, required: true},
    capacityUnit: {type: String, required: true}
});

module.exports.Sprint = mongoose.model("sprint", sprintSchema);