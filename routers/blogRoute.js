var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");
const {storyupload} = require("../middeleware/imageUpload");

const {
    getAllBlogs,
    create,
    insert,
    editBlog,
    updateBlog,
    deleteBlog,
    statusBlog,
    deleteBlogImage,
    deleteBlogSliderImage
} = require("../controllers/admin/BlogController");


const router = express.Router();

/*---------- WEB Routes  -------------*/
router.get("/admin/blog", isAdminAllowed, getAllBlogs);
router.get("/admin/blog/create", isAdminAllowed, create);
router.post(
    "/admin/blog/insert",
    storyupload.fields([
        {
            name: "banner_image",
            maxCount: 1,
        },
    ]),
    isAdminAllowed,
    insert
);

router.get("/admin/blog/edit/:id", isAdminAllowed, editBlog);

router.post(
    "/admin/blog/update",
    storyupload.fields([
        {
            name: "image_1",
            maxCount: 1,
        },
        {
            name : "image_2",
            maxCount:1
        },
        {
            name : "image_3",
            maxCount : 1
        },
        {
            name : "image_4",
            maxCount : 1
        }
    ]),
    isAdminAllowed,
    updateBlog
  );

router.get("/admin/blog/delete/:id", isAdminAllowed, deleteBlog);

router.get("/admin/blog/status/:id/:status", isAdminAllowed, statusBlog);
router.get("/admin/blog/delete-image/:imagenumber/:id", isAdminAllowed, deleteBlogImage);
router.get("/admin/blog/delete-slider-image/:id", isAdminAllowed, deleteBlogSliderImage);

/*---------- WEB Routes  -------------*/

module.exports = router;