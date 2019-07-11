/*  The API routes DO NOT INCLUDE ROUTING PATHS, they only call .js files
    which contain their routes and functions.
*/
const router = require("express").Router();
router.use(require("./auth"));
router.use(require("./card"));
router.use(require("./chat"));
router.use(require("./project"));
// router.use(require("./users"));
module.exports = router;
