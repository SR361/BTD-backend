var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");
const {storyupload} = require("../middeleware/imageUpload");

const {
    getAllBlogs,
    create,
    insert,
    edit,
    update,
    deleteBlog,
    statusBlog,
    metaContentEdit,
    metaContentUpdate
} = require("../controllers/admin/BlogController");

const { 
    getcategories, gettags, getblogs, getblogs2, categorieblogs
} = require("../controllers/api/BlogController");


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
router.get("/admin/blog/edit/:id", isAdminAllowed, edit);
router.post(
    "/admin/blog/update",
    storyupload.fields([
        {
            name: "banner",
            maxCount: 1,
        }
    ]),
    isAdminAllowed,
    update
);
router.get("/admin/blog/delete/:id", isAdminAllowed, deleteBlog);
router.get("/admin/blog/status/:id/:status", isAdminAllowed, statusBlog);

router.get("/admin/blog/meta-content/edit/:id", isAdminAllowed, metaContentEdit);
router.post("/admin/blog/meta/update", urlencodeParser, isAdminAllowed, metaContentUpdate);


router.get("/api/V1/get-blogs2", urlencodeParser, getblogs2);
router.get("/api/V1/categories", urlencodeParser, getcategories);
router.get("/api/V1/tags", urlencodeParser, gettags);
router.get("/api/V1/blogs", urlencodeParser, getblogs);
router.get("/api/V1/categorie-blog", urlencodeParser, categorieblogs);

/*---------- WEB Routes  -------------*/
module.exports = router;