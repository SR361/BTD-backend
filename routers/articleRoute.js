var express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const isAdminAllowed = require("../middeleware/isAdmin");
const {articleupload} = require("../middeleware/imageUpload");

const {
    addArticle,
    insertArticle,
    editArticle,
    updateArticle,
    deleteArticle,
} = require("../controllers/admin/ArticleController");
const { getArticles } = require("../controllers/api/ArticleController");

const router = express.Router();

/*---------- WEB Routes  -------------*/
router.get("/admin/article/create/:slug", isAdminAllowed, addArticle);

router.post(
    "/admin/article/save",
    articleupload.fields([
        { name: "image", maxCount: 1 },
        { name: "pdf", maxCount: 1 }  
    ]),
    isAdminAllowed,
    insertArticle
);


router.get('/admin/article/edit/:id', isAdminAllowed, editArticle);

router.post(
    "/admin/article/update",
    articleupload.fields([
        {
            name: "image",
            maxCount: 1,
        }
    ]),
    isAdminAllowed,
    updateArticle
);
router.get("/admin/article/delete/:id", isAdminAllowed, deleteArticle);

router.get("/api/V1/articles/:slug", urlencodeParser, getArticles);
/*---------- WEB Routes  -------------*/
module.exports = router;