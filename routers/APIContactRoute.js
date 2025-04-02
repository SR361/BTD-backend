var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });

const { getContactContent } = require("../controllers/api/ContactController");

const router = express.Router();

router.get("/api/V1/get-contact-content", urlencodeParser, getContactContent);

module.exports = router;