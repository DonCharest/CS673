/*  The API routes DO NOT INCLUDE ROUTING PATHS, they only call .js files
    which contain their routes and functions.
*/
const router = require('express').Router();
router.use(require('./story_route'));
module.exports = router;