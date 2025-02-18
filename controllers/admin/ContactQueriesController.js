const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const { body } = require('express-validator');
const baseUrl = process.env.BASEURL;

exports.customerContactQueries = async (req, res) => {    
    var page = req.query.page || 1;
    var perPage = (20)*1;
    var offset = (page-1)*perPage;
    try {
        const sqlCount = 'SELECT COUNT(*) AS totalQueries FROM `customer_queries`';
        const [countRows] = await db.query(sqlCount);
        const totalQueries = countRows.totalQueries;

        const sql = 'SELECT cq.*, c.name as countrie_name, s.name as state_name, ct.name as city_name FROM `customer_queries` cq left join countries as c on c.id = cq.country_id left join states s on s.id = cq.state_id left join cities ct on ct.id = cq.city_id LIMIT ? OFFSET ?';
        const contactqueries = await db.query(sql, [perPage, offset]);
    
        res.render("ContactQueries/index", {
            title: "Contact Queries",
            contactqueries: contactqueries,
            baseUrl: baseUrl,
            paginationUrl:"customer-queries",
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
exports.businessContactQueries = async (req, res) => {    
    var page = req.query.page || 1;
    var perPage = (20)*1;
    var offset = (page-1)*perPage;
    try {
        const sqlCount = 'SELECT COUNT(*) AS totalQueries FROM `business_contact_queries`';
        const [countRows] = await db.query(sqlCount);
        const totalQueries = countRows.totalQueries;

        const sql = 'SELECT cq.*, c.name as countrie_name, s.name as state_name, ct.name as city_name FROM `business_contact_queries` cq left join countries as c on c.id = cq.country_id left join states s on s.id = cq.state_id left join cities ct on ct.id = cq.city_id LIMIT ? OFFSET ?';
        const businessqueries = await db.query(sql, [perPage, offset]);
    
        res.render("ContactQueries/business_index", {
            title: "Business Queries",
            businessqueries: businessqueries,
            baseUrl: baseUrl,
            paginationUrl:"business-contact-queries",
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