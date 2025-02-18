var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");

const { index, update, apigetlinks } = require("../controllers/admin/SocialMediaController");

const router = express.Router();
router.get("/admin/social-media", isAdminAllowed, index);
router.post("/admin/social-media/update", urlencodeParser, isAdminAllowed, update);
router.get("/api/V1/get-links", apigetlinks);
module.exports = router;