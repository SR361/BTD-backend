const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const { body } = require('express-validator');
const baseUrl = process.env.BASEURL;

exports.contactContactQueries = async (req, res) => {    
    var page = req.query.page || 1;
    var perPage = (20)*1;
    var offset = (page-1)*perPage;
    try {
        const sqlCount = 'SELECT COUNT(*) AS totalQueries FROM `contact_queries`';
        const [countRows] = await db.query(sqlCount);
        const totalQueries = countRows.totalQueries;

        const sql = 'SELECT * FROM `contact_queries` LIMIT ? OFFSET ?';
        const contactqueries = await db.query(sql, [perPage, offset]);
    
        res.render("ContactQueries/index", {
            title: "Contact Queries",
            contactqueries: contactqueries,
            baseUrl: baseUrl,
            paginationUrl:"contact-queries",
            currentPage: page,
            totalPages: Math.ceil(totalQueries/ perPage),
            message: req.flash("message"),
            error: req.flash("error"),
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.redirect("back");
    } 
};