var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");
const {ourpartnerupload} = require("../middeleware/imageUpload");

const {
    index,
    create,
    insert,
    edit,
    update,
    deleteOurPartner
} = require("../controllers/admin/OurPartnerController");
const { getOurPartners } = require("../controllers/api/OurPartnerController");

const router = express.Router();

/*---------- WEB Routes  -------------*/
router.get("/admin/our-partners", isAdminAllowed, index);
router.get("/admin/our-partner/create", isAdminAllowed, create);
router.post(
    "/admin/our-partner/insert", 
    ourpartnerupload.fields([
        {
            name: "user_image",
            maxCount: 1,
        }
    ]),
    urlencodeParser, 
    isAdminAllowed, 
    insert
);
router.get('/admin/our-partner/edit/:id', isAdminAllowed, edit);
router.post(
    '/admin/our-partner/update/', 
    ourpartnerupload.fields([
        {
            name: "user_image",
            maxCount: 1,
        }
    ]),
    isAdminAllowed, 
    update
);
router.get("/admin/our-partner/delete/:id", isAdminAllowed, deleteOurPartner);

router.get("/api/V1/our-partners", urlencodeParser, getOurPartners);
/*---------- WEB Routes  -------------*/
module.exports = router;