const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const { body } = require('express-validator');
const baseUrl = process.env.BASEURL;

exports.addArticle = async (req, res) => {    
    res.render("Article/add", {
        title: "Add Contact",
        message: req.flash("message"),
        error: req.flash("error"),
    });
};

exports.insertArticle = async (req, res) => {
    
    const { address, number, email } = req.body;
    try {
        // insert data from the contact table
        const sql = "INSERT INTO `articles` SET country_name=?, address=?, number=?, email=?  ";
        const results = await db.query(sql, [country_name, address, number, email]);

        if (results.insertId > 0) {
            console.log('Articles inserted:', results.insertId);
            req.flash("message", "Articles has been added successfully");
            res.redirect("/admin/page/publication");
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

exports.editArticle = async (req, res) => {
    
    
    var contact_id = req.params.id;    
    try {
        //check the contact id  is exists in contact table or not
        const sql = `SELECT * FROM articles WHERE id = ?`;
        const contact = await db.query(sql, [contact_id]);
      
        if(contact.length > 0){
            res.render("Article/edit", {
                title: "Edit Articles",
                contact: contact[0],
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        }else{
            req.flash("error", "Sorry. No contact records exists!");
            res.redirect("/admin/page/publication");
        }
    } catch (error) {
        console.log('Error fetching data:', error);
        res.redirect("back");
    }
};

exports.updateArticle = async (req, res) => {
    
    const {id, address, number, email } = req.body;
    try {
        //check the size is exists in Contact table or not
        const sql = `SELECT * FROM articles WHERE id=?`;
        const contact = await db.query(sql, [id]);
      
        if(contact.length > 0)
        {
            // Update data into the Contact table
            const sql = "UPDATE `articles` SET country_name=?, address=?, number=?, email=? WHERE id=?";
            const edit_results = await db.query(sql, [country_name, address, number,email, id]);
        

            if (edit_results.affectedRows > 0) {
                console.log('Articles affected:', edit_results.affectedRows);
                req.flash("message", "Articles has been updated successfully");
                res.redirect("back");
            } else {
                console.log(edit_results);
                req.flash("error", "Articles record has not updated.");
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

exports.deleteArticle = async (req, res) => {
    var id = req.params.id;    
    try {
        const sql = `SELECT * FROM articles WHERE id = ? and ${countryCondition}`;
        const productsize = await db.query(sql, [id]);
        if(productsize.length > 0)
        {
            const sql = `DELETE FROM articles WHERE id=? and ${countryCondition}`;
            const edit_results = await db.query(sql, [id]);
        
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Articles has been deleted successfully.");
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