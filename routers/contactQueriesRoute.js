const express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");

const {
    contactContactQueries
} = require("../controllers/admin/ContactQueriesController");
const router = express.Router();

router.get("/admin/contact-queries", isAdminAllowed, contactContactQueries);

module.exports = router;