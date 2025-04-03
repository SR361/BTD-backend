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
        const sqlCount = 'SELECT COUNT(*) AS totalPartners FROM `our_partners`';
        const [countRows] = await db.query(sqlCount);
        const totalPartners = countRows.totalPartners;

        const sql = 'SELECT * FROM `our_partners` LIMIT ? OFFSET ?';
        const our_partners = await db.query(sql, [perPage, offset]);
    
        res.render("OurPartner/index", {
            title: "Our Partner",
            our_partners: our_partners,
            baseUrl: baseUrl,
            paginationUrl:"/admin/our-partners",
            currentPage: page,
            totalPages: Math.ceil(totalPartners/ perPage),
            message: req.flash("message"),
            error: req.flash("error"),
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.redirect("back");
    } 
};

exports.create = async (req, res) => {
    res.render("OurPartner/create", {
        title: "Our Partner Create",
        message: req.flash("message"),
        error: req.flash("error"),
    });
};

exports.insert = async (req, res) => {    
    const { name, position, description } = req.body;
    try {
       
            var image_path = "";
            if(req.files.user_image){
                image_path = '/uploads/ourpartners/' + req.files.user_image[0].filename;
            }

            const sql = "INSERT INTO `our_partners` SET name=?, position=?, description=?, image=?";
            const results = await db.query(sql, [name, position, description, image_path]);

            if (results.insertId > 0) {
                req.flash("message", "Our Partner has been added successfully");
                res.redirect("/admin/our-partners");
            } else {
                req.flash("error", 'Error fetching data:', error);
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
        const sql = 'SELECT * FROM `our_partners` WHERE id = ?';
        const our_partner = await db.query(sql, [id]);
      
        if(our_partner.length > 0){
            res.render("OurPartner/edit", {
                title: "Edit Our Partner",
                our_partner: our_partner[0],
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        }else{
            req.flash("error", "Sorry. No our partner records exists!");
            res.redirect("/admin/our-partners");
        }
    } catch (error) {
        console.log('Error fetching data:', error);
        res.redirect("back");
    }
};

exports.update = async (req, res) => {
    const {id, name, position, description } = req.body;
    
    try {
        const sql = 'SELECT * FROM `our_partners` WHERE id=?';
        const our_partners = await db.query(sql, [id]);
        if(our_partners.length > 0){
            var image_path = our_partners[0].image;
            if(req.files.user_image){
                if (image_path) {
                    const oldImagePath = path.join(__dirname, "../../public/", image_path);
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                image_path = '/uploads/ourpartners/' + req.files.user_image[0].filename;
            }
            const sql = "UPDATE `our_partners` SET name=?, position=?, description=?, image=? WHERE id=?";
            const edit_results = await db.query(sql, [name, position, description, image_path, id]);
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Our Partners has been updated successfully");
                res.redirect("/admin/our-partners");
            } else {
                req.flash("error", "Our Partners record has not updated.");
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

exports.deleteOurPartner = async (req, res) => {
    var id = req.params.id;
    try {
        const sql = 'SELECT * FROM `our_partners` WHERE id = ?';
        const our_partners = await db.query(sql, [id]);
        if(our_partners.length > 0){
            var image = our_partners[0].image;
            if (image) {
                const oldBlogImagePath = path.join(__dirname, '../../public/', image);
                try {
                    await fs.access(oldBlogImagePath);
                    await fs.unlink(oldBlogImagePath);
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            const sql = 'DELETE FROM `our_partners` WHERE id=?';
            const edit_results = await db.query(sql, [id]);
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Our Partners has been deleted successfully.");
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