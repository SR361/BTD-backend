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
    const { name, position, company, testimonial } = req.body;
    try {
        const sql = "SELECT * FROM `testimonials` WHERE name=?";
        const tag = await db.query(sql, [name]);
        if(tag.length === 0){
            var image_path = "";
            if(req.files.user_image){
                image_path = '/uploads/testimonial/' + req.files.user_image[0].filename;
            }

            const sql = "INSERT INTO `testimonials` SET name=?, position=?, company=?, testimonial=?, image=?";
            const results = await db.query(sql, [name, position, company, testimonial, image_path]);

            if (results.insertId > 0) {
                req.flash("message", "Testimonial has been added successfully");
                res.redirect("/admin/testimonials");
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
        const sql = 'SELECT * FROM `testimonials` WHERE id = ?';
        const testimonial = await db.query(sql, [id]);
      
        if(testimonial.length > 0){
            res.render("Testimonials/edit", {
                title: "Edit Testimonials",
                testimonial: testimonial[0],
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        }else{
            req.flash("error", "Sorry. No testimonials records exists!");
            res.redirect("/admin/testimonials");
        }
    } catch (error) {
        console.log('Error fetching data:', error);
        res.redirect("back");
    }
};

exports.update = async (req, res) => {
    const {id, name, position, company, testimonial } = req.body;
    
    try {
        const sql = 'SELECT * FROM `testimonials` WHERE id=?';
        const testimonials = await db.query(sql, [id]);
        if(testimonials.length > 0){
            var image_path = testimonials[0].image;
            if(req.files.user_image){
                if (image_path) {
                    const oldImagePath = path.join(__dirname, "../../public/", image_path);
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                image_path = '/uploads/testimonial/' + req.files.user_image[0].filename;
            }
            const sql = "UPDATE `testimonials` SET name=?, position=?, company=?, testimonial=?, image=? WHERE id=?";
            const edit_results = await db.query(sql, [name, position, company, testimonial, image_path, id]);
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Testimonials has been updated successfully");
                res.redirect("/admin/testimonials");
            } else {
                req.flash("error", "Testimonials record has not updated.");
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

exports.deletetestimonial = async (req, res) => {
    var id = req.params.id;
    try {
        const sql = 'SELECT * FROM `testimonials` WHERE id = ?';
        const testimonials = await db.query(sql, [id]);
        if(testimonials.length > 0){
            var image = testimonials[0].image;
            if (image) {
                const oldBlogImagePath = path.join(__dirname, '../../public/', image);
                try {
                    await fs.access(oldBlogImagePath);
                    await fs.unlink(oldBlogImagePath);
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            const sql = 'DELETE FROM `testimonials` WHERE id=?';
            const edit_results = await db.query(sql, [id]);
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Testimonials has been deleted successfully.");
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