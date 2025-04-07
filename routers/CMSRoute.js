var express = require("express");
var bodyParser = require("body-parser");

const {
    homePageContent,footerPageContent, aboutUsPageContent, getBlogContent, getPublicationContent
} = require("../controllers/api/CMSController");

const router = express.Router();

router.get("/api/V1/homepage-content", homePageContent);
router.get("/api/V1/footer-content", footerPageContent);
router.get("/api/V1/aboutuspage-content", aboutUsPageContent);
router.get("/api/V1/get-blog-content", getBlogContent);
router.get("/api/V1/publicationpage-content", getPublicationContent);

module.exports = router;