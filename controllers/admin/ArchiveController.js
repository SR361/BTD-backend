const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const { body } = require('express-validator');
const baseUrl = process.env.BASEURL;
const slugify = require("slugify");

exports.index = async (req, res) => {    
    var page = req.query.page || 1;
    var perPage = (20)*1;
    var offset = (page-1)*perPage;
    try {
        const sqlCount = 'SELECT COUNT(*) AS totalArchives FROM `archives`';
        const [countRows] = await db.query(sqlCount);
        const totalArchives = countRows.totalArchives;

        const sql = 'SELECT * FROM `archives` LIMIT ? OFFSET ?';
        const archives = await db.query(sql, [perPage, offset]);
    
        res.render("Archives/index", {
            title: "Archives",
            archives: archives,
            baseUrl: baseUrl,
            paginationUrl:"/admin/archives",
            currentPage: page,
            totalPages: Math.ceil(totalArchives/ perPage),
            message: req.flash("message"),
            error: req.flash("error"),
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.redirect("back");
    } 
};

exports.create = async (req, res) => {
    res.render("Archives/create", {
        title: "Archives Create",
        message: req.flash("message"),
        error: req.flash("error"),
    });
};

exports.insert = async (req, res) => {    
    const { title, description } = req.body;
    try {
        const sql = "SELECT * FROM `archives` WHERE title=?";
        const tag = await db.query(sql, [title]);
        if(tag.length === 0){
            var image_path = "";
            if(req.files.image){
                image_path = '/uploads/archives/' + req.files.image[0].filename;
            }
            const slug = slugify(title, {
                            lower: true,
                            strict: true,
                        });
            const sql = "INSERT INTO `archives` SET slug=?, title=?, description=?, image=?";
            const results = await db.query(sql, [slug, title, description, image_path]);

            if (results.insertId > 0) {
                req.flash("message", "Archives has been added successfully");
                res.redirect("/admin/archives");
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

exports.edit = async (req, res) => {
    var id = req.params.id;    
    try {
        const sql = 'SELECT * FROM `archives` WHERE id = ?';
        const archive = await db.query(sql, [id]);
      
        if(archive.length > 0){
            res.render("Archives/edit", {
                title: "Edit Archive",
                archive: archive[0],
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        }else{
            req.flash("error", "Sorry. No archive records exists!");
            res.redirect("/admin/archives");
        }
    } catch (error) {
        console.log('Error fetching data:', error);
        res.redirect("back");
    }
};

exports.update = async (req, res) => {
    const {id, title, description } = req.body;
    
    try {
        const sql = 'SELECT * FROM `archives` WHERE id=?';
        const archive = await db.query(sql, [id]);
        if(archive.length > 0){
            var image_path = archive[0].image;
            if(req.files.image){
                if (image_path) {
                    const oldImagePath = path.join(__dirname, "../../public/", image_path);
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                image_path = '/uploads/archives/' + req.files.image[0].filename;
            }
            const slug = slugify(title, {
                lower: true,
                strict: true,
            });

            const sql = "UPDATE `archives` SET slug=?, title=?, description=?, image=? WHERE id=?";
            const edit_results = await db.query(sql, [slug, title, description, image_path, id]);
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Archives has been updated successfully");
                res.redirect("/admin/archives");
            } else {
                req.flash("error", "Archives record has not updated.");
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

exports.deletearchive = async (req, res) => {
    var id = req.params.id;
    try {
        const sql = 'SELECT * FROM `archives` WHERE id = ?';
        const archives = await db.query(sql, [id]);
        if(archives.length > 0){
            var image = archives[0].image;
            if (image) {
                const oldBlogImagePath = path.join(__dirname, '../../public/', image);
                try {
                    await fs.access(oldBlogImagePath);
                    await fs.unlink(oldBlogImagePath);
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            const sql = 'DELETE FROM `archives` WHERE id=?';
            const edit_results = await db.query(sql, [id]);
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Archives has been deleted successfully.");
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