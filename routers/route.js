var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var validator = require('express-validator');

module.exports = function (app) {
    function isUserAllowed(req, res, next) {
        sess = req.session;           
        if (sess.user) {
            if(sess.user.role=="Admin"){
                return next();
            }
        }
        else{ 
            res.redirect('/login'); 
        }
    }

    app.get('/', isUserAllowed, function (req, res) {
        // res.locals.title = 'Dashboard' ;
        res.redirect('/admin/dashboard'); 
        // res.render('Dashboard/index',);
    });
}