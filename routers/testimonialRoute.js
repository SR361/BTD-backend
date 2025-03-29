var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");
const {testimonialupload} = require("../middeleware/imageUpload");

const {
    index,
    create,
    insert,
    edit,
    update,
    deletetestimonial
} = require("../controllers/admin/TestimonialController");

const router = express.Router();

/*---------- WEB Routes  -------------*/
router.get("/admin/testimonials", isAdminAllowed, index);
router.get("/admin/testimonial/create", isAdminAllowed, create);
router.post(
    "/admin/testimonial/insert", 
    testimonialupload.fields([
        {
            name: "user_image",
            maxCount: 1,
        }
    ]),
    urlencodeParser, 
    isAdminAllowed, 
    insert
);
router.get('/admin/testimonial/edit/:id', isAdminAllowed, edit);
router.post(
    '/admin/testimonial/update/', 
    testimonialupload.fields([
        {
            name: "user_image",
            maxCount: 1,
        }
    ]),
    isAdminAllowed, 
    update
);
router.get("/admin/testimonial/delete/:id", isAdminAllowed, deletetestimonial);
/*---------- WEB Routes  -------------*/
module.exports = router;