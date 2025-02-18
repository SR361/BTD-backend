const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const baseUrl = process.env.BASEURL;

exports.getAllProductCategories = async (req, res) => {
    var page = req.query.page || 1;
    var perPage = 20;
    var offset = (page-1)*perPage;
 
    try {
        const sqlCount = 'SELECT COUNT(*) AS totalCategories FROM `product_categories`';
        const [countRows] = await db.query(sqlCount);
        const totalCategories = countRows.totalCategories;
        const sql = 'SELECT * FROM `product_categories` LIMIT ? OFFSET ?';
        const categories = await db.query(sql, [perPage, offset]);
    
        res.render("ProductCategory/index", {
            title: "Categories",
            categories: categories,
            baseUrl: baseUrl,
            paginationUrl:"categories",
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