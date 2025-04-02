
var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");
const { serviceupload } = require("../middeleware/imageUpload");

const {
    index,
    create,

    InserServiceFirstSection,
    UpdateServiceSecondSection,
    UpdateServiceThirdSection,
    UpdateServiceFourthSection,
    UpdateServiceFivthSection,
    UpdateServiceSixthSection,
    UpdateServiceSeventhSection,
    UpdateServiceEighthSection,
    UpdateServiceNinethSection,

    store,
    edit,
    update,
    deleteimage,
    destory, manageServiceMetaTag, metaTagUpdate
} = require("../controllers/admin/ServiceController");

const { getAllServices } = require("../controllers/api/ServicesController");

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

















router.post(
    "/admin/service/store", 
    serviceupload.fields([
        {
            name: "firstsection_banner_image",
            maxCount: 1,
        },
        {
            name: "secondsection_image_one",
            maxCount: 1,
        },
        {
            name : "secondsection_image_two",
            maxCount:1
        },
        {
            name : "secondsection_image_three",
            maxCount : 1
        },
        {
            name : "thirdsection_image_one",
            maxCount : 1
        },
        {
            name : "thirdsection_image_two",
            maxCount : 1
        },
        {
            name : "thirdsection_image_three",
            maxCount : 1
        },
        {
            name : "fourthsection_image",
            maxCount : 1
        },
        {
            name : "fivthsection_image_one",
            maxCount : 1
        },
        {
            name : "fivthsection_image_two",
            maxCount : 1
        },
        {
            name : "fivthsection_image_three",
            maxCount : 1
        },
        {
            name : "eighthsection_images",
            maxCount : 10
        },
    ]),
    isAdminAllowed, 
    store
);
router.get("/admin/service/edit/:id", isAdminAllowed, edit);
router.post(
    "/admin/service/update", 
    serviceupload.fields([
        {
            name: "firstsection_banner_image",
            maxCount: 1,
        },
        {
            name: "secondsection_image_one",
            maxCount: 1,
        },
        {
            name : "secondsection_image_two",
            maxCount:1
        },
        {
            name : "secondsection_image_three",
            maxCount : 1
        },
        {
            name : "thirdsection_image_one",
            maxCount : 1
        },
        {
            name : "thirdsection_image_two",
            maxCount : 1
        },
        {
            name : "thirdsection_image_three",
            maxCount : 1
        },
        {
            name : "fourthsection_image",
            maxCount : 1
        },
        {
            name : "fivthsection_image_one",
            maxCount : 1
        },
        {
            name : "fivthsection_image_two",
            maxCount : 1
        },
        {
            name : "fivthsection_image_three",
            maxCount : 1
        },
        {
            name : "eighthsection_images",
            maxCount : 10
        },
    ]),
    isAdminAllowed, 
    update
);
router.get("/admin/service/delete-image/:id", isAdminAllowed, deleteimage);
router.get("/admin/service/delete/:id", isAdminAllowed, destory);
router.get("/admin/service/metatags/:id", isAdminAllowed, manageServiceMetaTag);
router.post("/admin/service/metatags/update", urlencodeParser, isAdminAllowed, metaTagUpdate);

router.get("/api/V1/all-service", urlencodeParser, getAllServices);

module.exports = router;