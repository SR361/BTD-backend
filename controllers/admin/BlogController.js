const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const slugify = require("slugify");
const baseUrl = process.env.BASEURL;

exports.getAllBlogs = async (req, res) => {
    var page = req.query.page || 1;
    var perPage = (20)*1;
    var offset = (page-1)*perPage;

    try {
        const sqlCount = 'SELECT COUNT(*) AS totalBlogs FROM `blogs`';
        const [countRows] = await db.query(sqlCount);
        const totalBlogs = countRows.totalBlogs;

    
        const sql = 'SELECT * FROM `blogs` ORDER BY id DESC LIMIT ? OFFSET ?';
        const blogs = await db.query(sql, [perPage, offset]);
        
        res.render("Blog/index", {
            title: "Blog",
            blogs: blogs,
            baseUrl: baseUrl,
            paginationUrl:"/admin/blog",
            currentPage: page,
            totalPages: Math.ceil(totalBlogs/ perPage),
            message: req.flash("message"),
            error: req.flash("error"),
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.redirect("back");
    }
   
};
  
exports.create = async (req, res) => {
    const categorieSql = "select * from `blog_categories`";
    const categories = await db.query(categorieSql);

    const tagsql = "select * from blog_tags";
    const tags = await db.query(tagsql);

    res.render("Blog/create", {
        categories : categories,
        tags: tags,
        title: "Add Blog",
        message: req.flash("message"),
        error: req.flash("error"),
    });
};

exports.insert = async (req, res) => {
    const { categories, tags, blog_title, short_description, content,slug } = req.body;
    const status = 1;
    try {
        const sql = "SELECT * FROM `blogs` WHERE  slug=?";
        const blog = await db.query(sql, [slug]);
        if(blog.length === 0){
            var banner_image_path = "";
            if(req.files.banner_image){
                banner_image_path = '/uploads/blogs/' + req.files.banner_image[0].filename;
            }
            const categoriestringify = {};
            if (categories != null) {
                categoriestringify["categories_stringify"] = categories.join(",");
            } else {
                categoriestringify["categories_stringify"] = "";
            }
            categoriestringify["categories"] = JSON.stringify(categories);
            const categoriesJSON = JSON.stringify(categoriestringify);

            const tagstringify = {};
            if (tags != null) {
                tagstringify["tags_stringify"] = tags.join(",");
            } else {
                tagstringify["tags_stringify"] = "";
            }
            tagstringify["tags"] = JSON.stringify(tags);
            const tagJSON = JSON.stringify(tagstringify);

            // const slug = slugify(blog_title, {
            //     lower: true,
            //     strict: true,
            // });
            const sql = "INSERT INTO `blogs` SET category_id=?, cat_id=?, tag_id=?, title=?, slug=?, short_description=?, description=?, banner=?";
            const results = await db.query(sql, [categories.join(","), categoriesJSON, tagJSON, blog_title, slug, short_description, content, banner_image_path]);

            if (results.insertId > 0) {
                req.flash("message", "Blog has been added successfully");
                res.redirect("/admin/blog");
            } else {
                req.flash("error", 'Error fetching data:', error);
                res.redirect("back");        
            }
        }else{
            req.flash("error", "Sorry. This blog is already exists!");
            res.redirect("back");
        }
    } catch (error) {
        req.flash("error", 'Error fetching data:', error);
        console.log('Error fetching data:', error);
        res.redirect("back");
    }
};
  
exports.edit = async (req, res) => {
    var story_id = req.params.id;    
    try {
        const sql = 'SELECT * FROM `blogs` WHERE id = ?';
        const blog = await db.query(sql, [story_id]);

        const categorieSql = "select * from `blog_categories`";
        const categories = await db.query(categorieSql);
        const tagsql = "select * from blog_tags";
        const tags = await db.query(tagsql);
        
        if(blog.length > 0)
        {
            res.render("Blog/update", {
                categories : categories,
                tags: tags,
                title: "Edit blog Item",
                blog: blog[0],
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        }else{
            req.flash("error", "Sorry. No story records exists!");
            res.redirect("/admin/blog");
        }
    } catch (error) {
      console.log('Error fetching data:', error);
      res.redirect("back");
    }  
};
  
exports.update = async (req, res) => {
    const { id, categories, tags, blog_title, short_description, content,slug } = req.body;
    try {
        const sql = 'SELECT * FROM `blogs` WHERE id=?';
        const blog = await db.query(sql, [id]);
        
        if(blog.length > 0){
            var banner_image_path = blog[0].banner;
            if(req.files.banner){
                if (banner_image_path) {
                    const oldImagePath = path.join(__dirname, "../../public/", banner_image_path);
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                banner_image_path = '/uploads/blogs/' + req.files.banner[0].filename;
            }
            const categoriestringify = {};
            if (categories != null) {
                categoriestringify["categories_stringify"] = categories.join(",");
            } else {
                categoriestringify["categories_stringify"] = "";
            }
            categoriestringify["categories"] = JSON.stringify(categories);
            const categoriesJSON = JSON.stringify(categoriestringify);

            const tagstringify = {};
            if (tags != null) {
                tagstringify["tags_stringify"] = tags.join(",");
            } else {
                tagstringify["tags_stringify"] = "";
            }
            tagstringify["tags"] = JSON.stringify(tags);
            const tagJSON = JSON.stringify(tagstringify);

            // const slug = slugify(blog_title, {
            //     lower: true,
            //     strict: true,
            // });
            const sql = "UPDATE `blogs` SET category_id=?, cat_id=?, tag_id=?, title=?, slug=?, short_description=?, description=?, banner=? WHERE id=?";
            const edit_results = await db.query(sql, [categories.join(","), categoriesJSON, tagJSON, blog_title, slug, short_description, content, banner_image_path, id]);
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Blog tag has been updated successfully");
                res.redirect("back");
            } else {
                req.flash("error", "Blog tag record has not updated.");
                res.redirect("back");
            }
        }else{
            req.flash("error", "Sorry. Cannot updated with id ${id}. Maybe id is wrong");
            res.redirect("back");
        }

    } catch (error) {
        req.flash("error", 'Error fetching data:', error);
        console.log('Error fetching data:', error);
        res.redirect("back");
    }
};
  
exports.deleteBlog = async (req, res) => {
    var id = req.params.id;
    try {
        const sql = 'SELECT * FROM `blogs` WHERE id = ?';
        const blog = await db.query(sql, [id]);
        if(blog.length > 0)
        {
            var blog_image = blog[0].banner;
            if (blog_image) {
                const oldBlogImagePath = path.join(__dirname, '../../public/', blog_image);
                try {
                    await fs.access(oldBlogImagePath);
                    await fs.unlink(oldBlogImagePath);
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            const sql = 'DELETE FROM `blogs` WHERE id=?';
            const edit_results = await db.query(sql, [id]);
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Blog has been deleted successfully.");
                res.redirect("back");
            }else{
                req.flash("error", `Sorry! Could not delete with id ${id}.`);
                res.redirect("back");
            }
        }else{
            req.flash("error", `Sorry! Could not delete with id ${id}. Maybe id is wrong`);
            res.redirect("back");
        }
    } catch (error) {
        console.log('Error fetching data:', error);
        req.flash("error", "Oops! Could not delete story.");
        res.redirect("back");
    }    
}
  
exports.statusBlog = async (req, res) => {
    var id = req.params.id;
    var status = req.params.status;
    try {
        const sql = 'SELECT * FROM `blogs` WHERE id = ?';
        const blog = await db.query(sql, [id]);
        if(blog.length > 0){
            const sql = "UPDATE `blogs` SET status=? WHERE id=?";
            const results = await db.query(sql, [status, id]);
        
            if (results.affectedRows > 0) {
                req.flash("message", "Blog status has been updated successfully.");
                res.redirect("back");
            }else{
                req.flash("error", `Sorry! Could not update status with id ${id}.`);
                res.redirect("back");
            }

        }else{
            req.flash("error", `Sorry! Could not update status with id ${id}. Maybe id is wrong`);
            res.redirect("back");
        }
    } catch (error) {
      console.log('Error fetching data:', error);
      req.flash("error", "Oops! Could not could update status.");
      res.redirect("back");
    }    
}

exports.metaContentEdit = async (req, res) => {
    var id = req.params.id;
    try {
        const blogsql = "select * from blogs where id = ?";
        const blog = await db.query(blogsql, [id]);
        if(blog.length > 0){
            res.render("Blog/meta", {
                title: "Blog meta content",
                blog: blog[0],
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        }else{
            req.flash("error", "Sorry. No story records exists!");
            res.redirect("/admin/blog");
        }
    } catch (error) {
        console.log('Error fetching data:', error);
        req.flash("error", "Oops! Could not could update status.");
        res.redirect("back");
    }
}

exports.metaContentUpdate = async (req, res) => {
    const {id, meta_title, meta_keywords, meta_description } = req.body;
    try {
        const sql = 'SELECT * FROM `blogs` WHERE id=?';
        const blog = await db.query(sql, [id]);
      
        if(blog.length > 0)
        {
            const sql = "UPDATE `blogs` SET meta_title=?, meta_description=?, meta_keywords=? WHERE id=?";
            const edit_results = await db.query(sql, [meta_title, meta_description, meta_keywords, id]);
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Blog tag has been updated successfully");
                res.redirect("back");
            } else {
                req.flash("error", "Blog tag record has not updated.");
                res.redirect("back");
            }
        }else{
            req.flash("error", "Sorry. Cannot updated with id ${id}. Maybe id is wrong");
            res.redirect("back");
        }

    } catch (error) {
        console.log('Error fetching data:', error);
        req.flash("error", 'Error fetching data:', error);
        res.redirect("back");
    }
}