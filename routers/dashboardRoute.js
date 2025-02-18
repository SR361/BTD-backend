var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");

const {
    index,
} = require("../controllers/admin/DashboardController");

const router = express.Router();

/*---------- WEB Routes  -------------*/
router.get("/admin/dashboard", isAdminAllowed, index);
/*---------- WEB Routes  -------------*/
module.exports = router;