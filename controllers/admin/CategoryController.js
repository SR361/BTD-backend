const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const baseUrl = process.env.BASEURL;

exports.getAllCategories = async (req, res) => {
    var page = req.query.page || 1;
    var perPage = 20;
    var offset = (page-1)*perPage;
 
    try {
      const sqlCount = 'SELECT COUNT(*) AS totalCategories FROM `categories`';
      const [countRows] = await db.query(sqlCount);
      const totalCategories = countRows.totalCategories;

      //check the email id  is exists in Categories table or not
      const sql = 'SELECT * FROM `categories` LIMIT ? OFFSET ?';
      const categories = await db.query(sql, [perPage, offset]);
    
      res.render("Category/index", {
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
  
  exports.addCategory = async (req, res) => {
    res.render("Category/add", {
      title: "Add Category",
      message: req.flash("message"),
      error: req.flash("error"),
    });
  };
  
  exports.insertCategory = async (req, res) => {
    
    const { title, description } = req.body;
    const status = 1; 

    var cat_image = "";
    if(req.files.cat_image){
        cat_image = '/uploads/category/' + req.files.cat_image[0].filename;
    }
    
    try {
      //check the email id  is exists in category table or not
      const sql = 'SELECT * FROM `categories` WHERE title=?';
      const category = await db.query(sql, [title]);
      if(category.length === 0)
      {
        // insert data from the category table
        const sql = "INSERT INTO `categories` SET title=?, description=?, image=?, status='?'";
        const results = await db.query(sql, [title, description, cat_image, status]);

        if (results.insertId > 0) {
            console.log('Category inserted:', results.insertId);
            req.flash("message", "Category has been added successfully");
            res.redirect("/admin/categories");
        } else {
          req.flash("error", 'Error fetching data:', error);
          res.redirect("back");
      
        }
      }else{
          req.flash("error", "Sorry. This title is already exists!");
          res.redirect("back");
      }

    } catch (error) {
      req.flash("error", 'Error fetching data:', error);
      console.log('Error fetching data:', error);
      res.redirect("back");
    }
  
    
  };
  
  exports.editCategory = async (req, res) => {

    var category_id = req.params.id;
    
    try {
      //check the email id  is exists in category table or not
      const sql = 'SELECT * FROM `categories` WHERE id = ?';
      const category = await db.query(sql, [category_id]);
      if(category.length > 0)
      {

        res.render("Category/edit", {
          title: "Edit Category",
          category: category[0],
          baseUrl: baseUrl,
          message: req.flash("message"),
          error: req.flash("error"),
        });

      }else{
          req.flash("error", "Sorry. No category records exists!");
          res.redirect("/admin/categories");
      }

    } catch (error) {
      console.log('Error fetching data:', error);
      res.redirect("back");
    }

  
  };
  
  exports.updateCategory = async (req, res) => {

    const { id, title, description } = req.body;

    try {
      //check the email id  is exists in category table or not
      const sql = 'SELECT * FROM `categories` WHERE id=?';
      const category = await db.query(sql, [id]);
      
      if(category.length > 0)
      {

        var cat_image = category[0].image;
        if(req.files.cat_image){
          // Delete the old category image
          if (cat_image) {
            const oldCategoryImagePath = path.join(__dirname, '../../public/', cat_image);
            await fs.access(oldCategoryImagePath); // Check if the file exists
            await fs.unlink(oldCategoryImagePath);
          }
          cat_image = '/uploads/category/' + req.files.cat_image[0].filename;
        }

        // Update data into the category table
        const sql = 'UPDATE `categories` SET title=?, description=?, image=? WHERE id=?';
        const edit_results = await db.query(sql, [title, description, cat_image, id]);
       
        if (edit_results.affectedRows > 0) {
            console.log('Category affected:', edit_results.affectedRows);
            req.flash("message", "Category has been updated successfully");
            res.redirect("back");
        } else {
          console.log(edit_results);
          req.flash("error", "Category record has not updated.");
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
  };
  
  exports.deleteCategory = async (req, res) => {
    var id = req.params.id;
    
    try {
      //check the email id  is exists in category table or not
      const sql = 'SELECT * FROM `categories` WHERE id = ?';
      const category = await db.query(sql, [id]);
      if(category.length > 0)
      {
        var cat_image = category[0].image;

        // Delete the old category image
        if (cat_image) {
          const oldCategoryImagePath = path.join(__dirname, '../../public/', cat_image);
          try {
            await fs.access(oldCategoryImagePath); // Check if the file exists
            await fs.unlink(oldCategoryImagePath); // Delete the file
          } catch (err) {
            console.error('Error deleting old image:', err);
          }
        }

        // Delete data from the category table
        const sql = 'DELETE FROM `categories` WHERE id=?';
        const edit_results = await db.query(sql, [id]);
       
        if (edit_results.affectedRows > 0) {
          req.flash("message", "Category has been deleted successfully.");
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
      req.flash("error", "Oops! Could not delete category.");
      res.redirect("back");
    }
    
  }
  
  exports.statusCategory = async (req, res) => {
    var id = req.params.id;
    var status = req.params.status;

    try {
      //check the email id  is exists in category table or not
      const sql = 'SELECT * FROM `categories` WHERE id = ?';
      const category = await db.query(sql, [id]);
      if(category.length > 0)
      {
        
        // update status in the category table
        const sql = "UPDATE `categories` SET status=?  WHERE id=?";
        const status_results = await db.query(sql, [status, id]);
    
        if (status_results.affectedRows > 0) {
          req.flash("message", "Category status has been updated successfully.");
          res.redirect("back");
        }else{
          req.flash("error", `Sorry! Could not update status with id ${id}.`);
          res.redirect("back");
        }

      }else{
        req.flash("error", `Sorry! Could not update status with id ${id}. Maybe id is wrong`);
        res.redirect("back");
      }

    } catch (error) {
      console.log('Error fetching data:', error);
      req.flash("error", "Oops! Could not could update status.");
      res.redirect("back");
    }
    
  }

  exports.deleteCategoryImage = async (req, res) => {
    var id = req.params.id;
    
    try {
      //check the id is exists in category table or not
      const sql = 'SELECT * FROM `categories` WHERE id = ?';
      const category = await db.query(sql, [id]);
      if(category.length > 0)
      {

        var category_img = category[0].image;

        // Delete the old banner image
        if (category_img) {
          const oldBannerImagePath = path.join(__dirname, '../../public/', category_img);
          try {
            await fs.access(oldBannerImagePath); // Check if the file exists
            await fs.unlink(oldBannerImagePath); // Delete the file
          } catch (err) {
            console.error('Error deleting old image:', err);
          }
        }

        // Delete data from the category table
        const sql = 'UPDATE `categories` SET image="" WHERE id=?';
        const edit_results = await db.query(sql, [id]);
       
        if (edit_results.affectedRows > 0) {
          req.flash("message", "Category image has been deleted succesfully.");
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
      req.flash("error", "Oops! Could not delete banner image.");
      res.redirect("back");
    }
    
  }