/*  The API routes DO NOT INCLUDE ROUTING PATHS, they only call .js files
    which contain their routes and functions.
*/
const router = require('express').Router();
router.use(require('./story_route'));
router.use(require('./project_route'));
module.exports = router;