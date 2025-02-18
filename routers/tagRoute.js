var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");

const {
    index,
    create,
    insert,
    edit,
    update,
    deletetag
} = require("../controllers/admin/TagController");

const router = express.Router();

/*---------- WEB Routes  -------------*/
router.get("/admin/blog-tags", isAdminAllowed, index);
router.get("/admin/blog-tag/create", isAdminAllowed, create);
router.post("/admin/blog-tag/insert", urlencodeParser, isAdminAllowed, insert);
router.get('/admin/blog-tag/edit/:id', isAdminAllowed, edit);
router.post('/admin/blog-tag/update/', urlencodeParser, isAdminAllowed, update);
router.get("/admin/blog-tag/delete/:id", isAdminAllowed, deletetag);
/*---------- WEB Routes  -------------*/
module.exports = router;