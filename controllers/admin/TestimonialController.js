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
        const sqlCount = 'SELECT COUNT(*) AS totalTestimonials FROM `testimonials`';
        const [countRows] = await db.query(sqlCount);
        const totalTestimonials = countRows.totalTestimonials;

        const sql = 'SELECT * FROM `testimonials` LIMIT ? OFFSET ?';
        const testimonials = await db.query(sql, [perPage, offset]);
    
        res.render("Testimonials/index", {
            title: "Testimonials",
            testimonials: testimonials,
            baseUrl: baseUrl,
            paginationUrl:"/admin/testimonials",
            currentPage: page,
            totalPages: Math.ceil(totalTestimonials/ perPage),
            message: req.flash("message"),
            error: req.flash("error"),
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.redirect("back");
    } 
};

exports.create = async (req, res) => {
    res.render("Testimonials/create", {
        title: "Testimonials Create",
        message: req.flash("message"),
        error: req.flash("error"),
    });
};

exports.insert = async (req, res) => {    
    const { name } = req.body;
    try {
        const sql = "SELECT * FROM `testimonials` WHERE name=?";
        const tag = await db.query(sql, [name]);
        if(tag.length === 0){
            const slug = slugify(name, {
                lower: true,
                strict: true,
            });
            const sql = "INSERT INTO `blog_tags` SET name=?, slug=?";
            const results = await db.query(sql, [name, slug]);

            if (results.insertId > 0) {
                req.flash("message", "Blog tag has been added successfully");
                res.redirect("/admin/blog-tags");
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
    var tag_id = req.params.id;    
    try {
        const sql = 'SELECT * FROM `blog_tags` WHERE id = ?';
        const tag = await db.query(sql, [tag_id]);
      
        if(tag.length > 0){
            res.render("BlogTag/edit", {
                title: "Edit Blog Tag",
                tag: tag[0],
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        }else{
            req.flash("error", "Sorry. No Blog tag records exists!");
            res.redirect("/admin/blog-tags");
        }
    } catch (error) {
        console.log('Error fetching data:', error);
        res.redirect("back");
    }
};

exports.update = async (req, res) => {
    const {id, name } = req.body;
    try {
        const sql = 'SELECT * FROM `blog_tags` WHERE id=?';
        const tag = await db.query(sql, [id]);
      
        if(tag.length > 0){
            const slug = slugify(name, {
                lower: true,
                strict: true,
            });
            const sql = "UPDATE `blog_tags` SET name=?, slug=? WHERE id=?";
            const edit_results = await db.query(sql, [name, slug, id]);
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Blog tag has been updated successfully");
                res.redirect("back");
            } else {
                console.log(edit_results);
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
}

exports.deletetag = async (req, res) => {
    var id = req.params.id;
    try {
        const sql = 'SELECT * FROM `blog_tags` WHERE id = ?';
        const Material = await db.query(sql, [id]);
        if(Material.length > 0)
        {
            const sql = 'DELETE FROM `blog_tags` WHERE id=?';
            const edit_results = await db.query(sql, [id]);
        
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Blog tag has been deleted successfully.");
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