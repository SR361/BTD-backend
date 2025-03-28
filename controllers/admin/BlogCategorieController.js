const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const { body } = require('express-validator');
const baseUrl = process.env.BASEURL;
const slugify = require("slugify");

exports.getAllCategories = async (req, res) => {    
    var page = req.query.page || 1;
    var perPage = (20)*1;
    var offset = (page-1)*perPage;
    try {
        const sqlCount = 'SELECT COUNT(*) AS totalCategories FROM `blog_categories`';
        const [countRows] = await db.query(sqlCount);
        const totalCategories = countRows.totalCategories;

        const sql = 'SELECT * FROM `blog_categories` LIMIT ? OFFSET ?';
        const categories = await db.query(sql, [perPage, offset]);
    
        res.render("BlogCategorie/index", {
            title: "Blogs Categorie",
            categories: categories,
            baseUrl: baseUrl,
            paginationUrl:"/admin/blog-categories",
            currentPage: page,
            totalPages: Math.ceil(totalCategories/ perPage),
            message: req.flash("message"),
            error: req.flash("error"),
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.redirect("back");
    } 
};

exports.addCategorie = async (req, res) => {
    res.render("BlogCategorie/add", {
        title: "Blog Categorie",
        message: req.flash("message"),
        error: req.flash("error"),
    });
};

exports.insertCategorie = async (req, res) => {    
    const { name } = req.body;
    try {
        const sql = "SELECT * FROM `blog_categories` WHERE name=?";
        const categorie = await db.query(sql, [name]);
        if(categorie.length === 0)
        {
            const slug = slugify(name, {
                lower: true,
                strict: true,
            });
            const sql = "INSERT INTO `blog_categories` SET name=?, slug=?";
            const results = await db.query(sql, [name, slug]);

            if (results.insertId > 0) {
                console.log('Blog Categorie inserted:', results.insertId);
                req.flash("message", "Blog Categorie has been added successfully");
                res.redirect("/admin/blog-categories");
            } else {
                req.flash("error", 'Error fetching data:', error);
                res.redirect("back");
            }
        }else{
            req.flash("error", "Sorry. This name is already exists!");
            res.redirect("back");
        }
    } catch (error) {
        req.flash("error", 'Error fetching data:', error);
        console.log('Error fetching data:', error);
        res.redirect("back");
    }
};

exports.editCategorie = async (req, res) => {
    var categorie_id = req.params.id;    
    try {
        const sql = 'SELECT * FROM `blog_categories` WHERE id = ?';
        const categorie = await db.query(sql, [categorie_id]);
      
        if(categorie.length > 0){
            res.render("BlogCategorie/edit", {
                title: "Edit Blog Categorie",
                categorie: categorie[0],
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        }else{
            req.flash("error", "Sorry. No Blog Categorie records exists!");
            res.redirect("/admin/blog-categories");
        }
    } catch (error) {
        console.log('Error fetching data:', error);
        res.redirect("back");
    }
};

exports.updateCategorie = async (req, res) => {
    const {id, name } = req.body;
    try {
        const sql = 'SELECT * FROM `blog_categories` WHERE id=?';
        const categorie = await db.query(sql, [id]);
      
        if(categorie.length > 0)
        {
            const slug = slugify(name, {
                lower: true,
                strict: true,
            });
            const sql = "UPDATE `blog_categories` SET name=?, slug=? WHERE id=?";
            const edit_results = await db.query(sql, [name, slug, id]);
        
            if (edit_results.affectedRows > 0) {
                console.log('Blog Categorie affected:', edit_results.affectedRows);
                req.flash("message", "Blog Categorie has been updated successfully");
                res.redirect("back");
            } else {
                console.log(edit_results);
                req.flash("error", "Blog Categorie record has not updated.");
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
}

exports.deleteCategorie = async (req, res) => {
    var id = req.params.id;
    try {
        const sql = 'SELECT * FROM `blog_categories` WHERE id = ?';
        const Material = await db.query(sql, [id]);
        if(Material.length > 0)
        {
            const sql = 'DELETE FROM `blog_categories` WHERE id=?';
            const edit_results = await db.query(sql, [id]);
        
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Blog Categorie has been deleted successfully.");
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
        req.flash("error", "Oops! Could not delete product size.");
        res.redirect("back");
    }
    
}

// Manage meta tags
exports.manageBlogCategoryMetaTag = async (req, res) => {
    var blog_category_id = req.params.id;
    
    try {
        const metatagssql = "select * from blog_categories where id = ?";
        const metaTags = await db.query(metatagssql, [blog_category_id]);
        if(metaTags.length > 0){
            res.render("BlogCategorie/meta-tags.ejs", {
                title: "Services",
                metaTags: metaTags[0],
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        }else{
            req.flash("error", "Sorry. No page not found!");
            res.redirect("back");
        }
        
    } catch (error) {
        console.log("ERROR : ", error);
        res.redirect("back");	
    }
}

exports.metaTagUpdate = async (req, res) => {
    const { id, metatitle, metakeywords, metadescription } = req.body;
    try {
        const selectsql = "select * from blog_categories where id = ?";
        const metTags = await db.query(selectsql, [id]);
        if(metTags.length > 0){
            const updatesql = "UPDATE `blog_categories` SET metatitle=?, metakeywords=?, metadescription=? WHERE id=?";
            const updateresult = await db.query(updatesql, [metatitle, metakeywords, metadescription, id]);
            if (updateresult.affectedRows > 0) {
                req.flash("message", "Blog category meta tags has been update successfully");
                res.redirect("/admin/blog-categories");
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
        }else{
            req.flash("error", "Sorry. page meta tags not found!");
            res.redirect("back");
        }
    } catch (error) {
        console.log("ERROR : ", error);
        res.redirect("back");
    }
}