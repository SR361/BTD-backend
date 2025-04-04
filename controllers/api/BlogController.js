const db = require('../../database/db');
require("dotenv").config();
const { format } = require('date-fns');

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
        const blogsql = "select id, cat_id, title, slug, banner, short_description, description, meta_title, meta_img, meta_keywords, meta_description, created_at from blogs limit 0,8";
        const blogs = await db.query(blogsql);

        const populerblog = [];
        for (const [index, item] of blogs.entries()) {
            const createdAt = item.created_at;
            const formattedDate = format(new Date(createdAt), "MMMM dd, yyyy");
            const cat_id = JSON.parse(item.cat_id);
            const categorysql = "select * from blog_categories where id in (?)";
            const categories = await db.query(categorysql,[JSON.parse(cat_id.categories)]);
            const allcategories = [];
            for (const [i, categoryitem] of categories.entries()) {
                allcategories.push(categoryitem.name);
            }
            const singleblog = {
                id: item.id,
                title: item.title,
                slug: item.slug,
                image: item.banner,
                description: item.short_description,
                author: "Caption",
                date: formattedDate,
                category: allcategories.join(","),
                readTime: "10 min to Read"
            };
            populerblog.push(singleblog)
        }

        const query = `SELECT * FROM blogs WHERE FIND_IN_SET(?, category_id)`;
        const latestblog = await db.query(query, [3]);

        if(blogs.length > 0){
            res.status(200).send({ status : true, result : populerblog, message : "" });
        }else{
            res.status(200).send({ status : false, result : "", message : "Sorry! blogs don't not exits record." });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors : "Error: "+error, errorData:error });
    }
}
exports.categorieblogs = async (req, res) => {
    // const { id } = req.params;
    try {
        var page = req.query.page || 1;
        var perPage = 2;
        var offset = (page - 1) * perPage;
        var id = req.query.id;

        const sqlCount = `SELECT COUNT(*) AS totalBlog FROM blogs where FIND_IN_SET(?, category_id)`;
        const [countRows] = await db.query(sqlCount,[id]);
        const totalBlog = countRows.totalBlog;

        const query = `SELECT * FROM blogs WHERE FIND_IN_SET(?, category_id) ORDER BY id DESC`;
        const blogs = await db.query(query, [id]);
        // const sql = `SELECT * FROM blogs where cat_id = ${cat_id} ORDER BY id DESC LIMIT ? OFFSET ?`;
        // const blogs = await db.query(sql, [perPage, offset]);
        const blogoutput = [];
        for (const [index, item] of blogs.entries()) {
            const createdAt = item.created_at;
            const formattedDate = format(new Date(createdAt), "MMMM dd, yyyy");
            const cat_id = JSON.parse(item.cat_id);
            const categorysql = "select * from blog_categories where id in (?)";
            const categories = await db.query(categorysql,[JSON.parse(cat_id.categories)]);
            const allcategories = [];
            for (const [i, categoryitem] of categories.entries()) {
                allcategories.push(categoryitem.name);
            }
            const singleblog = {
                id: item.id,
                title: item.title,
                image: item.banner,
                description: item.short_description,
                author: "Caption",
                date: formattedDate,
                category: allcategories.join(","),
                readTime: "10 min to Read"
            };
            blogoutput.push(singleblog)
        }
        if(blogs.length > 0){
            res.status(200).send({ status : true, result : { blogs : blogoutput }, message : "" });
        }else{
            res.status(200).send({ status : false, result : {}, message : "Blog not found!" });
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

exports.negotiationBlogs = async (req, res) => {
    try {
        var page = req.query.page || 1;
        var perPage = 4;
        var offset = (page - 1) * perPage;
        var cat_id = req.query.cat_id;

        const sqlCount = `SELECT COUNT(*) AS totalBlog FROM blogs where FIND_IN_SET(?, category_id)`;
        const [countRows] = await db.query(sqlCount,[1]);
        const totalBlog = countRows.totalBlog;

        const query = `SELECT * FROM blogs WHERE FIND_IN_SET(?, category_id) ORDER BY id DESC LIMIT ? OFFSET ?`;
        const blogs = await db.query(query, [1, perPage, offset]);
        // const sql = `SELECT * FROM blogs where cat_id = ${cat_id} ORDER BY id DESC LIMIT ? OFFSET ?`;
        // const blogs = await db.query(sql, [perPage, offset]);
        const blogoutput = [];
        for (const [index, item] of blogs.entries()) {
            const createdAt = item.created_at;
            const formattedDate = format(new Date(createdAt), "MMMM dd, yyyy");
            const cat_id = JSON.parse(item.cat_id);
            const categorysql = "select * from blog_categories where id in (?)";
            const categories = await db.query(categorysql,[JSON.parse(cat_id.categories)]);
            const allcategories = [];
            for (const [i, categoryitem] of categories.entries()) {
                allcategories.push(categoryitem.name);
            }
            const singleblog = {
                id: item.id,
                title: item.title,
                image: item.banner,
                description: item.short_description,
                author: "Caption",
                date: formattedDate,
                category: allcategories.join(","),
                readTime: "10 min to Read"
            };
            blogoutput.push(singleblog)
        }
        if(blogs.length > 0){
            res.status(200).send({ status : true, result : { blogs : blogoutput }, message : "" });
        }else{
            res.status(200).send({ status : false, result : {}, message : "Blog not found!" });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors : "Error: "+error, errorData:error });
    }
}
exports.MABlogs = async (req, res) => {
    try {
        var page = req.query.page || 1;
        var perPage = 4;
        var offset = (page - 1) * perPage;
        var cat_id = req.query.cat_id;

        const sqlCount = `SELECT COUNT(*) AS totalBlog FROM blogs where FIND_IN_SET(?, category_id)`;
        const [countRows] = await db.query(sqlCount,[3]);
        const totalBlog = countRows.totalBlog;

        const query = `SELECT * FROM blogs WHERE FIND_IN_SET(?, category_id) ORDER BY id DESC LIMIT ? OFFSET ?`;
        const blogs = await db.query(query, [3, perPage, offset]);
        // const sql = `SELECT * FROM blogs where cat_id = ${cat_id} ORDER BY id DESC LIMIT ? OFFSET ?`;
        // const blogs = await db.query(sql, [perPage, offset]);
        const blogoutput = [];
        for (const [index, item] of blogs.entries()) {
            const createdAt = item.created_at;
            const formattedDate = format(new Date(createdAt), "MMMM dd, yyyy");
            const cat_id = JSON.parse(item.cat_id);
            const categorysql = "select * from blog_categories where id in (?)";
            const categories = await db.query(categorysql,[JSON.parse(cat_id.categories)]);
            const allcategories = [];
            for (const [i, categoryitem] of categories.entries()) {
                allcategories.push(categoryitem.name);
            }
            const singleblog = {
                id: item.id,
                title: item.title,
                image: item.banner,
                description: item.short_description,
                author: "Caption",
                date: formattedDate,
                category: allcategories.join(","),
                readTime: "10 min to Read"
            };
            blogoutput.push(singleblog)
        }
        if(blogs.length > 0){
            res.status(200).send({ status : true, result : { blogs : blogoutput }, message : "" });
        }else{
            res.status(200).send({ status : false, result : {}, message : "Blog not found!" });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors : "Error: "+error, errorData:error });
    }
}
exports.StrategyBlogs = async (req, res) => {
    try {
        var page = req.query.page || 1;
        var perPage = 4;
        var offset = (page - 1) * perPage;
        var cat_id = req.query.cat_id;

        const sqlCount = `SELECT COUNT(*) AS totalBlog FROM blogs where FIND_IN_SET(?, category_id)`;
        const [countRows] = await db.query(sqlCount,[4]);
        const totalBlog = countRows.totalBlog;

        const query = `SELECT * FROM blogs WHERE FIND_IN_SET(?, category_id) ORDER BY id DESC LIMIT ? OFFSET ?`;
        const blogs = await db.query(query, [4, perPage, offset]);
        // const sql = `SELECT * FROM blogs where cat_id = ${cat_id} ORDER BY id DESC LIMIT ? OFFSET ?`;
        // const blogs = await db.query(sql, [perPage, offset]);
        const blogoutput = [];
        for (const [index, item] of blogs.entries()) {
            const createdAt = item.created_at;
            const formattedDate = format(new Date(createdAt), "MMMM dd, yyyy");
            const cat_id = JSON.parse(item.cat_id);
            const categorysql = "select * from blog_categories where id in (?)";
            const categories = await db.query(categorysql,[JSON.parse(cat_id.categories)]);
            const allcategories = [];
            for (const [i, categoryitem] of categories.entries()) {
                allcategories.push(categoryitem.name);
            }
            const singleblog = {
                id: item.id,
                title: item.title,
                image: item.banner,
                description: item.short_description,
                author: "Caption",
                date: formattedDate,
                category: allcategories.join(","),
                readTime: "10 min to Read"
            };
            blogoutput.push(singleblog)
        }
        if(blogs.length > 0){
            res.status(200).send({ status : true, result : { blogs : blogoutput }, message : "" });
        }else{
            res.status(200).send({ status : false, result : {}, message : "Blog not found!" });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors : "Error: "+error, errorData:error });
    }
}
exports.LeaderShipCompanyBlogs = async (req, res) => {
    try {
        var page = req.query.page || 1;
        var perPage = 4;
        var offset = (page - 1) * perPage;
        var cat_id = req.query.cat_id;

        const sqlCount = `SELECT COUNT(*) AS totalBlog FROM blogs where FIND_IN_SET(?, category_id)`;
        const [countRows] = await db.query(sqlCount,[5]);
        const totalBlog = countRows.totalBlog;

        const query = `SELECT * FROM blogs WHERE FIND_IN_SET(?, category_id) ORDER BY id DESC LIMIT ? OFFSET ?`;
        const blogs = await db.query(query, [5, perPage, offset]);
        // const sql = `SELECT * FROM blogs where cat_id = ${cat_id} ORDER BY id DESC LIMIT ? OFFSET ?`;
        // const blogs = await db.query(sql, [perPage, offset]); LeaderShipCompany
        const blogoutput = [];
        for (const [index, item] of blogs.entries()) {
            const createdAt = item.created_at;
            const formattedDate = format(new Date(createdAt), "MMMM dd, yyyy");
            const cat_id = JSON.parse(item.cat_id);
            const categorysql = "select * from blog_categories where id in (?)";
            const categories = await db.query(categorysql,[JSON.parse(cat_id.categories)]);
            const allcategories = [];
            for (const [i, categoryitem] of categories.entries()) {
                allcategories.push(categoryitem.name);
            }
            const singleblog = {
                id: item.id,
                title: item.title,
                image: item.banner,
                description: item.short_description,
                author: "Caption",
                date: formattedDate,
                category: allcategories.join(","),
                readTime: "10 min to Read"
            };
            blogoutput.push(singleblog)
        }
        if(blogs.length > 0){
            res.status(200).send({ status : true, result : { blogs : blogoutput }, message : "" });
        }else{
            res.status(200).send({ status : false, result : {}, message : "Blog not found!" });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors : "Error: "+error, errorData:error });
    }
}
