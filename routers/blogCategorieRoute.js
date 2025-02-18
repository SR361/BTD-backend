var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");

const {
    getAllCategories,
    addCategorie,
    insertCategorie,
    editCategorie,
    updateCategorie,
    deleteCategorie
} = require("../controllers/admin/BlogCategorieController");

const router = express.Router();

/*---------- WEB Routes  -------------*/
router.get("/admin/blog-categories", isAdminAllowed, getAllCategories);
router.get("/admin/blog-categorie/create", isAdminAllowed, addCategorie);
router.post("/admin/blog-categorie/save", urlencodeParser, isAdminAllowed, insertCategorie);
router.get('/admin/blog-categorie/edit/:id', isAdminAllowed, editCategorie);
router.post('/admin/blog-categorie/update/', urlencodeParser, isAdminAllowed, updateCategorie);
router.get("/admin/blog-categorie/delete/:id", isAdminAllowed, deleteCategorie);
/*---------- WEB Routes  -------------*/
module.exports = router;