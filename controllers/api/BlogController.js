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