const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const { body } = require('express-validator');
const baseUrl = process.env.BASEURL;
const slugify = require("slugify");

exports.addArticle = async (req, res) => {  
    var cat = req.params.slug;  
    res.render("Article/add", {
        title: "Add Contact",
        cat: cat,
        message: req.flash("message"),
        error: req.flash("error"),
    });
};

exports.insertArticle = async (req, res) => {
    const { title, description, category } = req.body;
    const status = 1;
    
    try {
        const sql = "SELECT * FROM `articles` WHERE title=?";
        const article = await db.query(sql, [title]);

        if (article.length === 0) {
            let file_path = "";

            
            if (category === "publication" && req.files.image) {
                file_path = "/uploads/articles/" + req.files.image[0].filename;
            } else if (req.files.pdf) {
                file_path = "/uploads/articles/" + req.files.pdf[0].filename;
            }

            const slug = slugify(title, {
                lower: true,
                strict: true,
            });

            const insertSQL = "INSERT INTO `articles` (category, title, slug, description, image) VALUES (?, ?, ?, ?, ?)";
            const results = await db.query(insertSQL, [category, title, slug, description, file_path]);

            if (results.insertId > 0) {
                req.flash("message", "Article has been added successfully");
                res.redirect("/admin/page/publication");
            } else {
                req.flash("error", "Error saving data.");
                res.redirect("back");
            }
        } else {
            req.flash("error", "Sorry. This article already exists!");
            res.redirect("back");
        }
    } catch (error) {
        console.error("Error inserting data:", error);
        req.flash("error", "Error inserting data.");
        res.redirect("back");
    }
};

exports.editArticle = async (req, res) => {
    var article_id = req.params.id;    
    try {
        //check the contact id  is exists in contact table or not
        const sql = `SELECT * FROM articles WHERE id = ?`;
        const article = await db.query(sql, [article_id]);
      
        if(article.length > 0){
            res.render("Article/edit", {
                title: "Edit Articles",
                article: article[0],
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        }else{
            req.flash("error", "Sorry. No article records exists!");
            res.redirect("/admin/page/publication");
        }
    } catch (error) {
        console.log('Error fetching data:', error);
        res.redirect("back");
    }
};

exports.updateArticle = async (req, res) => {
    const { id, title, description, category } = req.body;

    try {
        const sql = "SELECT * FROM `articles` WHERE id=?";
        const articles = await db.query(sql, [id]);

        if (articles.length > 0) {
            let file_path = articles[0].file; // Store existing file (image or PDF)

            // Check if user uploaded a new file
            if (req.files.image && category === "publication") {
                // If an image exists, delete it before replacing
                if (file_path) {
                    const oldFilePath = path.join(__dirname, "../../public/", file_path);
                    try {
                        await fs.access(oldFilePath);
                        await fs.unlink(oldFilePath);
                    } catch (error) {
                        console.error("Error deleting old image:", error);
                    }
                }
                file_path = "/uploads/articles/" + req.files.image[0].filename;
            } 
            else if (req.files.pdf && category !== "publication") {
                // If a PDF exists, delete it before replacing
                if (file_path) {
                    const oldFilePath = path.join(__dirname, "../../public/", file_path);
                    try {
                        await fs.access(oldFilePath);
                        await fs.unlink(oldFilePath);
                    } catch (error) {
                        console.error("Error deleting old PDF:", error);
                    }
                }
                file_path = "/uploads/articles/" + req.files.pdf[0].filename;
            }

            // Generate slug from title
            const slug = slugify(title, { lower: true, strict: true });

            // Update the article
            const updateSQL = "UPDATE `articles` SET title=?, slug=?, description=?, file=? WHERE id=?";
            const updateResult = await db.query(updateSQL, [title, slug, description, file_path, id]);

            if (updateResult.affectedRows > 0) {
                req.flash("message", "Article has been updated successfully");
                res.redirect("back");
            } else {
                req.flash("error", "Article record was not updated.");
                res.redirect("back");
            }
        } else {
            req.flash("error", `Sorry, no article found with ID ${id}`);
            res.redirect("back");
        }
    } catch (error) {
        console.error("Error updating article:", error);
        req.flash("error", "Error updating article.");
        res.redirect("back");
    }
};

exports.deleteArticle = async (req, res) => {
    var id = req.params.id;
    try {
        const sql = 'SELECT * FROM `articles` WHERE id = ?';
        const article = await db.query(sql, [id]);
        if(article.length > 0)
        {
            var article_image = article[0].image;
            if (article_image) {
                const oldBlogImagePath = path.join(__dirname, '../../public/', article_image);
                try {
                    await fs.access(oldBlogImagePath);
                    await fs.unlink(oldBlogImagePath);
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            const sql = 'DELETE FROM `articles` WHERE id=?';
            const edit_results = await db.query(sql, [id]);
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Article has been deleted successfully.");
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