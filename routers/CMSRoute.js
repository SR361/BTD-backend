var express = require("express");
var bodyParser = require("body-parser");

const {
    homePageContent
} = require("../controllers/api/CMSController");

const router = express.Router();

router.get("/api/V1/homepage-content", homePageContent);

module.exports = router;