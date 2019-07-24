/*  The cardTrack schema tracks the number of cards ever created for a 
        Project.  This is different from the Card.index value, which tracks
        the CURRENT number of Cards for a project.
*/
const mongoose = require('mongoose');
var cardTrack = new mongoose.Schema({
    projectId: {
        type: String, 
        required: true,
        immutable: true
    },
    totalCount: {
        type: Number, 
        required: true
    }
});

module.exports.CardTrack = mongoose.model('CardTrack', cardTrack);