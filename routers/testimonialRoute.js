var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");
const {storyupload} = require("../middeleware/imageUpload");

const {
    index,
    create,
    insert,
    edit,
    update,
    deletetag
} = require("../controllers/admin/TestimonialController");

const router = express.Router();

/*---------- WEB Routes  -------------*/
router.get("/admin/testimonials", isAdminAllowed, index);
router.get(
    "/admin/testimonial/create", 
    storyupload.fields([
        {
            name: "banner",
            maxCount: 1,
        }
    ]),
    isAdminAllowed, create
);
router.post("/admin/testimonial/insert", urlencodeParser, isAdminAllowed, insert);
router.get('/admin/testimonial/edit/:id', isAdminAllowed, edit);
router.post('/admin/testimonial/update/', urlencodeParser, isAdminAllowed, update);
router.get("/admin/testimonial/delete/:id", isAdminAllowed, deletetag);
/*---------- WEB Routes  -------------*/
module.exports = router;