const express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");

const {
    customerContactQueries,
    businessContactQueries
} = require("../controllers/admin/ContactQueriesController");
const router = express.Router();

router.get("/admin/customer-queries", isAdminAllowed, customerContactQueries);
router.get("/admin/business-contact-queries", isAdminAllowed, businessContactQueries);

module.exports = router;