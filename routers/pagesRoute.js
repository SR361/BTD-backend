var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");
const {pageupload} = require("../middeleware/imageUpload");
const {
    getAllPages,
    pageSectionList,
    editPage,
    homepageFirstSection,
    homepageSecondSection,
    homepageThirdSection,
    homepageFourthSection,
    homepageFifthSection,
    homepageSixthSection,
    deleteImage,

    verhandlungFirstSection,
    verhandlungSecondSection,
    verhandlungThirdSection,
    verhandlungFourthSection,

    servicepageFirstSection,
    servicepageSecondSection,
    servicepageThirdSection,
    aboutuspageFirstSection,
    aboutuspageSecondSection,
    aboutuspageThirdSection,
    contactpageFirstSection,
    dataprotectionpageFirstSection,
    imprintpageFirstSection,
    managePageMetaTag, 
    metaTagUpdate, 
    footerpageFirstSection, publicationpageFirstSection, publicationfachartikelpageFirstSection, blogpageFirstSection
} = require("../controllers/admin/PageController");
const router = express.Router();

/*---------- WEB Routes  -------------*/

router.get("/admin/pages", isAdminAllowed, getAllPages);
router.get("/admin/page/:slug", isAdminAllowed, pageSectionList);
router.get("/admin/page/edit/:slug/:section/:id", isAdminAllowed, editPage);
router.get("/admin/page/metatags/:id", isAdminAllowed, managePageMetaTag);
// ================================================= HOME PAGE =================================================
router.post(
    "/admin/homepage/firtsection/update",
    pageupload.fields([
        {
            name: "desktop_banner_image",
            maxCount: 1,
        },{
            name: "mobile_banner_image",
            maxCount: 1
        }
    ]),
    isAdminAllowed, 
    homepageFirstSection
);
router.post("/admin/homepage/secondsection/update", urlencodeParser, isAdminAllowed, homepageSecondSection);

router.post(
    "/admin/homepage/thirdsection/update",
    pageupload.fields([
        {
            name: "images",
            maxCount: 20
        }
    ]),
    isAdminAllowed,
    homepageThirdSection
);
router.post(
    "/admin/homepage/fourthsection/update",
    pageupload.fields([
        {
            name: "image_one",
            maxCount: 1
        },{
            name: "image_two",
            maxCount: 1
        },{
            name: "image_three",
            maxCount: 1
        },{
            name: "image_four",
            maxCount: 1
        }
    ]),
    isAdminAllowed,
    homepageFourthSection
);
router.post(
    "/admin/homepage/fifthsection/update",
    pageupload.fields([
        {
            name: "section_image",
            maxCount: 1
        }
    ]),
    isAdminAllowed,
    homepageFifthSection
);
router.post("/admin/homepage/sixthsection/update", urlencodeParser, isAdminAllowed, homepageSixthSection);

router.post("/admin/page/metatags/update", urlencodeParser, isAdminAllowed, metaTagUpdate);
// ================================================= HOME PAGE =================================================
// ================================================= HOME PAGE =================================================

// ================================================= HOME PAGE =================================================

// ================================================= SERVICE PAGE =================================================
router.post(
    "/admin/servicepage/firstsection/update",
    urlencodeParser,
    isAdminAllowed, 
    servicepageFirstSection
);
router.post(
    "/admin/servicepage/secondsection/update",
    pageupload.fields([
        {
            name: "image_one",
            maxCount: 1
        },{
            name: "image_two",
            maxCount: 1
        },{
            name: "image_three",
            maxCount: 1
        },{
            name: "image_four",
            maxCount: 1
        }
    ]),
    isAdminAllowed, 
    servicepageSecondSection
);
router.post(
    "/admin/servicepage/thirdsection/update",
    pageupload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    isAdminAllowed, 
    servicepageThirdSection
);
// ================================================= SERVICE PAGE =================================================

// ================================================= ABOUT US PAGE =================================================
router.post(
    "/admin/aboutuspage/firstsection/update",
    pageupload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    isAdminAllowed, 
    aboutuspageFirstSection
);

router.post(
    "/admin/aboutuspage/secondsection/update",
    pageupload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    isAdminAllowed, 
    aboutuspageSecondSection
);
router.post(
    "/admin/aboutuspage/thirdsection/update",
    pageupload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    isAdminAllowed, 
    aboutuspageThirdSection
);
// ================================================= ABOUT US PAGE =================================================

// ================================================= CONTACT PAGE =================================================
// router.post("/admin/contactpage/firstsection/update", urlencodeParser, isAdminAllowed, contactpageFirstSection);
router.post(
    "/admin/contactpage/firstsection/update",
    pageupload.fields([
        {
            name: "banner_image",
            maxCount: 1
        }
    ]),
    isAdminAllowed, 
    contactpageFirstSection
);
// ================================================= CONTACT PAGE =================================================

// ================================================= DATA PROTECTION PAGE =================================================
router.post("/admin/dataprotectionpage/firstsection/update", urlencodeParser, isAdminAllowed, dataprotectionpageFirstSection);
// ================================================= DATA PROTECTION PAGE =================================================

// ================================================= IMORINT PAGE ========================================================
router.post("/admin/imprintpage/firstsection/update", urlencodeParser, isAdminAllowed, imprintpageFirstSection);
// ================================================= IMORINT PAGE ========================================================
router.get("/admin/page/delete-image/:id", isAdminAllowed, deleteImage);

// 29-03-2025
router.post(
    "/admin/footerpage/firtsection/update",
    pageupload.fields([
        {
            name: "footer_image",
            maxCount: 1,
        }
    ]),
    isAdminAllowed, 
    footerpageFirstSection
);

// 01-04-2025
// router.post("/admin/publicationpage/firtsection/update", urlencodeParser, isAdminAllowed, publicationpageFirstSection);
router.post(
    "/admin/publicationpage/firtsection/update",
    pageupload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    isAdminAllowed, 
    publicationpageFirstSection
);
router.post("/admin/publicationfachartikelpage/firtsection/update", urlencodeParser, isAdminAllowed, publicationfachartikelpageFirstSection);
router.post(
    "/admin/blogpage/firtsection/update",
    pageupload.fields([
        {
            name: "banner_image",
            maxCount: 1,
        }
    ]),
    isAdminAllowed, 
    blogpageFirstSection
);
/*---------- WEB Routes  -------------*/

module.exports = router;