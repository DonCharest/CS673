/*  The API routes DO NOT INCLUDE ROUTING PATHS, they only call .js files
    which contain their routes and functions.
*/
const router = require('express').Router();
router.use(require('./auth'));
router.use(require('./items'));
router.use(require('./card'));
router.use(require('./project'));
module.exports = router;