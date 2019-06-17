/*  The routes index.js file forces appending '/api' into the URL
    path to our function calls.

    i.e. - http://localhost:3000/api/*
*/
const router = require('express').Router();
router.use('/api', require('./api'));
module.exports = router;