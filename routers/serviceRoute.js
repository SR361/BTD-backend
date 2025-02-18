
var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");
const { serviceupload } = require("../middeleware/imageUpload");

const {
    index,
    create,
    store,
    edit,
    update,
    deleteimage,
    destory
} = require("../controllers/admin/ServiceController");

const router = express.Router();
router.get("/admin/services", isAdminAllowed, index);
router.get("/admin/service/create", isAdminAllowed, create);
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
module.exports = router;