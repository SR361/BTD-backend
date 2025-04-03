
var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");
const { serviceupload } = require("../middeleware/imageUpload");

const {
    index,
    create,
    InserServiceFirstSection,
    UpdateServiceFirstSection,
    UpdateServiceSecondSection,
    UpdateServiceThirdSection,
    UpdateServiceFourthSection,
    UpdateServiceFivthSection,
    UpdateServiceSixthSection,
    UpdateServiceSeventhSection,
    UpdateServiceEighthSection,
    UpdateServiceNinethSection,
    edit,
    destory, 
    manageServiceMetaTag, 
    metaTagUpdate
} = require("../controllers/admin/ServiceController");

const { getAllServices, getService } = require("../controllers/api/ServicesController");

const router = express.Router();
router.get("/admin/services", isAdminAllowed, index);
router.get("/admin/service/create", isAdminAllowed, create);

// ========================================================= INSERT SECTION CONTENT =========================================================
    router.post("/admin/service/firstsection/insert",
        serviceupload.fields([
            {
                name: "desktop_banner_image",
                maxCount: 1,
            },{
                name: "mobile_banner_image",
                maxCount: 1
            }
        ]),
        isAdminAllowed, 
        InserServiceFirstSection
    );
    router.post("/admin/service/firstsection/update",
        serviceupload.fields([
            {
                name: "desktop_banner_image",
                maxCount: 1,
            },{
                name: "mobile_banner_image",
                maxCount: 1
            }
        ]),
        isAdminAllowed, 
        UpdateServiceFirstSection
    );
    router.post("/admin/service/secondsection/update", urlencodeParser, isAdminAllowed, UpdateServiceSecondSection);
    router.post("/admin/service/thirdsection/update", urlencodeParser, isAdminAllowed, UpdateServiceThirdSection);
    router.post("/admin/service/fourthsection/update",
        serviceupload.fields([
            {
                name: "image_one",
                maxCount: 1
            },{
                name: "image_two",
                maxCount: 1
            },{
                name: "image_three",
                maxCount: 1
            }
        ]),
        isAdminAllowed,
        UpdateServiceFourthSection
    );
    router.post("/admin/service/fivthsection/update",
        serviceupload.fields([
            {
                name: "image_one",
                maxCount: 1
            },{
                name: "image_two",
                maxCount: 1
            },{
                name: "image_three",
                maxCount: 1
            }
        ]),
        isAdminAllowed,
        UpdateServiceFivthSection
    );
    router.post("/admin/service/sixthsection/update",
        serviceupload.fields([
            {
                name: "image_one",
                maxCount: 1
            },{
                name: "image_two",
                maxCount: 1
            },{
                name: "image_three",
                maxCount: 1
            }
        ]),
        isAdminAllowed,
        UpdateServiceSixthSection
    );
    router.post("/admin/service/seventhsection/update",
        serviceupload.fields([
            {
                name: "logo_image",
                maxCount: 1
            },{
                name: "background_image",
                maxCount: 1
            }
        ]),
        isAdminAllowed,
        UpdateServiceSeventhSection
    );
    router.post("/admin/service/eighthsection/update",
        serviceupload.fields([
            {
                name: "image",
                maxCount: 1
            }
        ]),
        isAdminAllowed,
        UpdateServiceEighthSection
    );
    router.post("/admin/service/ninethsection/update",
        serviceupload.fields([
            {
                name: "image",
                maxCount: 1
            }
        ]),
        isAdminAllowed,
        UpdateServiceNinethSection
    );
// ========================================================= INSERT SECTION CONTENT =========================================================

router.get("/admin/service/edit/:id", isAdminAllowed, edit);

router.get("/admin/service/delete/:id", isAdminAllowed, destory);
router.get("/admin/service/metatags/:id", isAdminAllowed, manageServiceMetaTag);
router.post("/admin/service/metatags/update", urlencodeParser, isAdminAllowed, metaTagUpdate);
// ========================================================= APIs =========================================================
    router.get("/api/V1/services", urlencodeParser, getAllServices);
    router.get("/api/V1/service/:id", urlencodeParser, getService);
// ========================================================= APIs =========================================================

module.exports = router;