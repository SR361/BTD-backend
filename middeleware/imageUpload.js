const multer = require("multer");
const path = require('path');

const filefilter = (req, file, cb) => {
    console.log('Field name : ',file);
    if (!file.originalname.match(/\.(webp|png|jpg|jpeg|mp4|webp)$/)) {
        cb(new Error("Only webp, png, jpg or jpeg image files are allowed"));
    }
    cb(null, true);
};

const CSVfilefilter = (req, file, cb) => {
    // if(file.mimetype === 'video/mp4' || file.mimetype === 'video/mkv'){
    //     cb(null,true);
    // }else{
    //     cb(null,false); 9924624180 kharabhai
    // }
    //if (!file.originalname.match(/\.(mp4|webp|MPEG-4|mkv|mov|png|jpg|jpeg)$/)) {
    if (!file.originalname.match(/\.(csv)$/)) {
        cb(new Error("Only csv files are allowed"));
    }
    cb(null, true);
};

const PDFfilefilter = (req, file, cb) => {
    // if(file.mimetype === 'video/mp4' || file.mimetype === 'video/mkv'){
    //     cb(null,true);
    // }else{
    //     cb(null,false);
    // }
    //if (!file.originalname.match(/\.(mp4|webp|MPEG-4|mkv|mov|png|jpg|jpeg)$/)) {
    if (!file.originalname.match(/\.(pdf)$/)) {
        cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
};

// ================================================================ USER STORAGE =============================================================
    const userstorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "public/uploads/users");
        },
        filename: (req, file, cb) => {
            cb(
                null,
                Date.now() + "_" + file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")
            );
        },
    });
    const userupload = multer({
        storage: userstorage,
        limits: { fieldSize: 25 * 1024 * 1024 },
        fileFilter: filefilter,
    });
// ================================================================ USER STORAGE =============================================================
// ================================================================ ADMIN STORAGE =============================================================
    const adminstorage = multer.diskStorage({
        destination: (req, file, cb) => {
        cb(null, "public/uploads/admins");
        },
        filename: (req, file, cb) => {
            cb(
                null,
                Date.now() + "_" + file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")
            );
        },
    });
    const adminupload = multer({
        storage: adminstorage,
        limits: { fieldSize: 25 * 1024 * 1024 },
        fileFilter: filefilter,
    });
// ================================================================ ADMIN STORAGE =============================================================
// ================================================================ PAGE STORAGE =============================================================
    const pagestorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "public/uploads/pages");
        },
        filename: (req, file, cb) => {
            cb(null,Date.now() + "_" + file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_"));
        },
    });
    const pageupload = multer({
        storage: pagestorage,
        limits: { fieldSize: 25 * 1024 * 1024 },
        fileFilter: filefilter,
    });
// ================================================================ PAGE STORAGE =============================================================
// ================================================================ CATEGORIE STORAGE ========================================================
    const categorystorage = multer.diskStorage({
        destination: (req, file, cb) => {
        cb(null, "public/uploads/category");
        },
        filename: (req, file, cb) => {
            cb(
                null,
                Date.now() + "_" + file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")
            );
        },
    });
    const categoryupload = multer({
        storage: categorystorage,
        limits: { fieldSize: 25 * 1024 * 1024 },
        fileFilter: filefilter,
    });
// ================================================================ CATEGORIE STORAGE ========================================================
// ================================================================ STORIE STORAGE ========================================================
    const storystorage = multer.diskStorage({
        destination: (req, file, cb) => {
        cb(null, "public/uploads/blogs");
        },
        filename: (req, file, cb) => {
            cb(
                null,
                Date.now() + "_" + file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")
            );
        },
    });
    const storyupload = multer({
        storage: storystorage,
        limits: { fieldSize: 25 * 1024 * 1024 },
        fileFilter: filefilter,
    });
// ================================================================ STORIE STORAGE ========================================================
// ================================================================ SERVICES STORAGE ==========================================================
    const servicestorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "public/uploads/services");
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '_' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'))
        },
    });
    const serviceupload = multer({
        storage: servicestorage,
        limits: { fieldSize: 25 * 1024 * 1024 },
        fileFilter: filefilter,
    });
// ================================================================ SERVICES STORAGE ==========================================================

// ================================================================ SERVICES STORAGE ==========================================================
    const testimonialstorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "public/uploads/testimonial");
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + '_' + file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_'))
        },
    });
    const testimonialupload = multer({
        storage: testimonialstorage,
        limits: { fieldSize: 25 * 1024 * 1024 },
        fileFilter: filefilter,
    });
// ================================================================ SERVICES STORAGE ==========================================================

function bannerFilter(req, file, cb) {
    console.log(file.fieldname)
    if (file.mimetype === 'video/mp4' || !file.originalname.match(/\.(webp|png|jpg|jpeg|mp4)$/)) {
        cb(null, true);
    } else {
        req.flash("Invalid file type!")
    }
}

const noupload = multer().none();
module.exports = { 
    noupload, 
    serviceupload, 
    userupload,
    adminupload,
    pageupload,
    categoryupload,
    storyupload,
    testimonialupload
};
