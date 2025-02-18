const express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");

const {
    getAllCategories,
    addCategory,
    insertCategory,
    editCategory,
    updateCategory,
    deleteCategory,
    statusCategory,
    deleteCategoryImage

} = require("../controllers/admin/CategoryController");


const {categoryupload} = require("../middeleware/imageUpload")

const router = express.Router();


/*---------- WEB Routes  -------------*/

router.get("/admin/categories", isAdminAllowed, getAllCategories);

router.get("/admin/category/create", isAdminAllowed, addCategory);

router.post(
    "/admin/category/save",
    categoryupload.fields([
      {
        name: "cat_image",
        maxCount: 1,
      }
    ]),
    isAdminAllowed,
    insertCategory
  );

router.get("/admin/category/edit/:id", isAdminAllowed, editCategory);

router.post(
    "/admin/category/update",
    categoryupload.fields([
      {
        name: "cat_image",
        maxCount: 1,
      }
    ]),
    isAdminAllowed,
    updateCategory
  );

router.get("/admin/category/delete/:id", isAdminAllowed, deleteCategory);

router.get("/admin/category/status/:id/:status", isAdminAllowed, statusCategory);

router.get("/admin/category/delete-image/:id", isAdminAllowed, deleteCategoryImage);

/*---------- WEB Routes  -------------*/

module.exports = router;