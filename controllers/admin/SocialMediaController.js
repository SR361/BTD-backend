const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const { body } = require('express-validator');
const baseUrl = process.env.BASEURL;

exports.index = async (req, res) => {  
    const sql = 'SELECT * FROM `social_medial_liks` where id = ?';
    const links = await db.query(sql,[1]);
    
    res.render("SocialMedia/index", {
        title: "Social Media Links",
        links : links[0],
        baseUrl: baseUrl,
        message: req.flash("message"),
        error: req.flash("error"),
    });
}

exports.update = async (req, res) => {
    const {id, instagram, linkedin, wiki, pinterest, tiktok, facebook, youtube } = req.body;
    console.log(req.body);
    try {
        const sql = "UPDATE `social_medial_liks` SET instagram=?, linkedin=?, wiki=?, pinterest=?, tiktok=?, facebook=?, youtube=? WHERE id=?";
        const edit_results = await db.query(sql, [instagram, linkedin, wiki, pinterest, tiktok, facebook, youtube, id]);
    

        if (edit_results.affectedRows > 0) {
            req.flash("message", "Social media has been updated successfully");
            res.redirect("back");
        } else {
            console.log(edit_results);
            req.flash("error", "Social media record has not updated.");
            res.redirect("back");
        }
    } catch (error) {
        console.log('Error fetching data:', error);
        res.redirect("back");
    }
}

exports.apigetlinks = async (req, res) => {
    try {
        const sql = 'SELECT * FROM `social_medial_liks` where id = ?';
        const links = await db.query(sql,[1]);

        res.status(200).send({ 
            status: true, 
            result: { 
                links: links[0],
            }, 
            errors: "" 
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, result: "", errors:error });
    }
}