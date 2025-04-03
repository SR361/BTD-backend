const db = require('../../database/db');
require("dotenv").config();

exports.getcategories = async (req, res) => {
    try {
        const categoriesql = "select id, name, slug, metatitle, metakeywords, metadescription from blog_categories";
        const categories = await db.query(categoriesql);

        if(categories.length > 0){
            res.status(200).send({ status : true, result : categories, message : "" });
        }else{
            res.status(200).send({ status : false, result : "", message : "Sorry! categories don't not exits record." });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors:"Error: "+error, errorData:error });
    }
}

exports.gettags = async (req, res) => {
    try {
        const tagsql = "select id, name, slug, metatitle, metakeywords, metadescription from blog_categories";
        const tags = await db.query(tagsql);

        if(tags.length > 0){
            res.status(200).send({ status : true, result : tags, message : "" });
        }else{
            res.status(200).send({ status : false, result : "", message : "Sorry! tags don't not exits record." });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors : "Error: "+error, errorData:error });
    }
}

exports.getblogs = async (req, res) => {
    try {
        const blogsql = "select id, title, slug, banner, short_description, description, meta_title, meta_img, meta_keywords, meta_description from blogs";
        const blogs = await db.query(blogsql);

        if(blogs.length > 0){
            res.status(200).send({ status : true, result : blogs, message : "" });
        }else{
            res.status(200).send({ status : false, result : "", message : "Sorry! blogs don't not exits record." });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors : "Error: "+error, errorData:error });
    }
}

exports.getblogs2 = async (req, res) => {
    try {
        // Fetch all blog categories
        const categorySql = "SELECT id, name FROM blog_categories";
        const categories = await db.query(categorySql);
        
        // Fetch all blogs with correct column 'cat_id'
        const blogSql = "SELECT id, title, slug, banner, short_description, description, meta_title, meta_img, meta_keywords, meta_description, cat_id FROM blogs";
        const blogs = await db.query(blogSql);
        
        let categorizedBlogs = {};
        
        // Initialize categories in the response
        categories.forEach(category => {
            categorizedBlogs[category.id] = {
                category_name: category.name,
                blogs: []
            };
        });
        
        // Process blogs and categorize them
        blogs.forEach(blog => {
            try {
                let catData = JSON.parse(blog.cat_id); // Convert stored JSON object into JS object
                let blogCategories = JSON.parse(catData.categories); // Extract and parse 'categories' array
                
                blogCategories.forEach(catId => {
                    if (categorizedBlogs[catId]) {
                        categorizedBlogs[catId].blogs.push(blog);
                    }
                });
            } catch (error) {
                console.error("Invalid JSON format in blog.cat_id:", blog.cat_id);
            }
        });

        res.status(200).send({ status: true, result: categorizedBlogs, message: "" });
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors: "Error: " + error, errorData: error });
    }
};
