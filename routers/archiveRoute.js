var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");
const {archiveupload} = require("../middeleware/imageUpload");

const {
    index,
    create,
    insert,
    edit,
    update,
    deletearchive
} = require("../controllers/admin/ArchiveController");

const { getArchives } = require("../controllers/api/ArchiveController");

const router = express.Router();

/*---------- WEB Routes  -------------*/
router.get("/admin/archives", isAdminAllowed, index);
router.get("/admin/archive/create", isAdminAllowed, create);
router.post(
    "/admin/archive/insert", 
    archiveupload.fields([
        {
            name: "image",
            maxCount: 1,
        }
    ]),
    urlencodeParser, 
    isAdminAllowed, 
    insert
);
router.get('/admin/archive/edit/:id', isAdminAllowed, edit);
router.post(
    '/admin/archive/update/', 
    archiveupload.fields([
        {
            name: "image",
            maxCount: 1,
        }
    ]),
    isAdminAllowed, 
    update
);
router.get("/admin/archive/delete/:id", isAdminAllowed, deletearchive);

router.get("/api/V1/archives", urlencodeParser, getArchives);
/*---------- WEB Routes  -------------*/
module.exports = router;