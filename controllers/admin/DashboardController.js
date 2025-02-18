const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const { body } = require('express-validator');
const baseUrl = process.env.BASEURL;

exports.index = async (req, res) => {    
    var page = req.query.page || 1;
    var perPage = (20)*1;
    var offset = (page-1)*perPage;
    try {
       

       
        
        const customerSql = "SELECT COUNT(*) AS toalCustomerCount FROM `users` WHERE status != ?";
        const [totalCustomer] = await db.query(customerSql,['3']);
        const toalCustomerCount = totalCustomer.toalCustomerCount;

        res.render("Dashboard/index", {
            title: "Dashboard",
            toalCustomerCount   : toalCustomerCount,
            message: req.flash("message"),
            error: req.flash("error"),
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.redirect("back");
    } 
};