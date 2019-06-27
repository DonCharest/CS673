/*  Project_DB.js: Database schema for storing Project.Project data.
    - Store projects in MongoDB.
    - Projects include ProjectMembers.
    - ProjectMembers include Users
    - Projects may contain additional collections including requirements,
      project members, and epics.

    REFERENCE: https://mongoosejs.com/docs/subdocs.html

    WILL NEED TO BE UPDATED TO INCLUDE CHAT MESSAGES WITHIN A PROJECT
*/
const mongoose = require('mongoose');

// Epic schema 
var Epic = new mongoose.Schema({
    Name:{type: String}
});

// The Project Member schema tracks the users that are members of a 
// particular project
var projMemberSchema = new mongoose.Schema({
    startDate:{type: Date, required: true, default: Date.now},
    endDate:{type: Date, required: false, default: null},
    userID:{type: String, required: true}
});

// // User schema 
// var userSchema = new mongoose.Schema({
//     name:{type: String, required: true},
//     email:{type: String, required: true},
//     password:{type: String, required: true},
//     isAdmin:{type: Boolean, required: true, default:false}
// });


//  The Project model holds all components of a project and its subdocuments.

module.exports.Project = mongoose.model('Project', new mongoose.Schema({
    name:{type: String, required: true},
    shortCode:{type: String, required: true},
    effortUnit:{type: String, required: true},
    dateCreated:{type: Date, required: true, default: Date.now},
    dateClosed:{type: Date, required: false},
    description:{type: String, required: false},
    projectMembers:[projMemberSchema],
    epics:[Epic],
    requirements:[String]
}));


// {
//     "name":"testproject",
//     "shortCode":"MIKE",
//     "effortUnit":"at least 5"
// }





