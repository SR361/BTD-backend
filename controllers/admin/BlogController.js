const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const baseUrl = process.env.BASEURL;

exports.getAllBlogs = async (req, res) => {
    var page = req.query.page || 1;
    var perPage = (20)*1;
    var offset = (page-1)*perPage;

    try {
      const sqlCount = 'SELECT COUNT(*) AS totalStories FROM `stories`';
      const [countRows] = await db.query(sqlCount);
      const totalStories = countRows.totalStories;

   
      const sql = 'SELECT * FROM `stories` ORDER BY id DESC LIMIT ? OFFSET ?';
      const stories = await db.query(sql, [perPage, offset]);
    
      res.render("Blog/index", {
        title: "Blog",
        stories: stories,
        baseUrl: baseUrl,
        paginationUrl:"/admin/stories",
        currentPage: page,
        totalPages: Math.ceil(totalStories/ perPage),
        message: req.flash("message"),
        error: req.flash("error"),
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      res.redirect("back");
    }
   
  };
  
exports.create = async (req, res) => {
    const categorieSql = "select * from `blog_categories`";
    const categories = await db.query(categorieSql);

    const tagsql = "select * from blog_tags";
    const tags = await db.query(tagsql);

    res.render("Blog/create", {
        categories : categories,
        tags: tags,
        title: "Add Blog",
        message: req.flash("message"),
        error: req.flash("error"),
    });
};

exports.insert = async (req, res) => {
    const { categories, tags, meta_title, meta_keywords, meta_description, blog_title, short_description, content } = req.body;
    const status = 1;

    

    try {
        const sql = "SELECT * FROM `blogs` WHERE  title=?";
        const blog = await db.query(sql, [blog_title]);
        if(blog.length === 0){
            var banner_image_path = "";
            if(req.files.banner_image){
                banner_image_path = '/uploads/blogs/' + req.files.banner_image[0].filename;
            }
            const categoriestringify = {};
            if (categories != null) {
                categoriestringify["categories_stringify"] = categories.join(",");
            } else {
                categoriestringify["categories_stringify"] = "";
            }
            categoriestringify["categories"] = JSON.stringify(categories);

            const tagstringify = {};
            if (tags != null) {
                tagstringify["tags_stringify"] = tags.join(",");
            } else {
                tagstringify["tags_stringify"] = "";
            }
            tagstringify["tags"] = JSON.stringify(tags);
            const slug = preg_replace('/[^A-Za-z0-9\-]/', '', str_replace(' ', '-', $title));
            const sql = "INSERT INTO `blogs` SET cat_id=?, tag_id=?, title=?, slug=?, short_description=?, description=?, banner=?, meta_title=?, meta_description=?, meta_keywords=?";
            const results = await db.query(sql, [categoriestringify, tagstringify, title, slug, short_description, description, banner_image_path, meta_title, meta_description, meta_keywords]);

            if (results.insertId > 0) {
                req.flash("message", "Blog has been added successfully");
                res.redirect("/admin/blog");
            } else {
                req.flash("error", 'Error fetching data:', error);
                res.redirect("back");        
            }
        }else{
            req.flash("error", "Sorry. This blog is already exists!");
            res.redirect("back");
        }
    } catch (error) {
        req.flash("error", 'Error fetching data:', error);
        console.log('Error fetching data:', error);
        res.redirect("back");
    }
};
  
exports.editBlog = async (req, res) => {
    var story_id = req.params.id;    
    try {
        const sql = 'SELECT * FROM `stories` WHERE id = ?';
        const blog = await db.query(sql, [story_id]);

        const categorieSql = "select * from `blog_categories`";
        const categories = await db.query(categorieSql);
        
        if(blog.length > 0)
        {
            res.render("Blog/edit", {
                categories : categories,
                title: "Edit Story Item",
                blog: blog[0],
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        }else{
            req.flash("error", "Sorry. No story records exists!");
            res.redirect("/admin/blog");
        }
    } catch (error) {
      console.log('Error fetching data:', error);
      res.redirect("back");
    }  
};
  
exports.updateBlog = async (req, res) => {
    const { id, cat_id,title,content_1,content_2,name_1,name_2,name_3,name_4,sub_title_1,content_3,highlight_content,sub_title_2,content_4,sub_title_3,content_5,content_6,sub_title_4,content_7,content_8,sub_title_5,content_9,content_10,sub_title_6,content_11,content_12, must_read } = req.body;
    try {
        //check the email id  is exists in stories table or not
        const sql = 'SELECT * FROM `stories` WHERE id=?';
        const story = await db.query(sql, [id]);
        
        if(story.length > 0)
        {
            const images = JSON.parse(story[0].images);
            var image_1 = images.image_1;
            
            if(req.files.image_1){
                // Delete the old story image
                if (image_1) {
                    const oldStoryImagePath = path.join(__dirname, '../../public/', image_1);
                    try {
                        await fs.access(oldStoryImagePath);
                        await fs.unlink(oldStoryImagePath);
                    } catch (error) {
                        
                    }
                }
                image_1 = '/uploads/blogs/' + req.files.image_1[0].filename;
            }
            var image_2 = images.image_2;
            if(req.files.image_2){
                // Delete the old story image
                if (image_2) {
                    const oldStoryImagePath1 = path.join(__dirname, '../../public/', image_2);
                    try {
                        await fs.access(oldStoryImagePath1);
                        await fs.unlink(oldStoryImagePath1);
                    } catch (error) {
                        
                    }
                }
                image_2 = '/uploads/blogs/' + req.files.image_2[0].filename;
            }
            var image_3 = images.image_3;
            if(req.files.image_3){
                // Delete the old story image
                if (image_3) {
                    const oldStoryImagePath2 = path.join(__dirname, '../../public/', image_3);
                    try {
                        await fs.access(oldStoryImagePath2);
                        await fs.unlink(oldStoryImagePath2);
                    } catch (error) {
                        
                    }
                }
                image_3 = '/uploads/blogs/' + req.files.image_3[0].filename;
            }
            var image_4 = images.image_4;
            if(req.files.image_4){
                // Delete the old story image
                if (image_4) {
                    const oldStoryImagePath3 = path.join(__dirname, '../../public/', image_4);
                    try {
                        await fs.access(oldStoryImagePath3);
                        await fs.unlink(oldStoryImagePath3);
                    } catch (error) {
                        
                    }
                }
                image_4 = '/uploads/blogs/' + req.files.image_4[0].filename;
            }
            
            const imagesObject = {};
            imagesObject['image_1'] = image_1;
            imagesObject['image_2'] = image_2;
            imagesObject['image_3'] = image_3;
            imagesObject['image_4'] = image_4;
            const imagesJson = JSON.stringify(imagesObject);

            const contents = {};
            contents['content_1'] = content_1;
            contents['content_2'] = content_2;
            contents['content_3'] = content_3;
            contents['content_4'] = content_4;
            contents['content_5'] = content_5;
            contents['content_6'] = content_6;
            contents['content_7'] = content_7;
            contents['content_8'] = content_8;
            contents['content_9'] = content_9;
            contents['content_10'] = content_10;
            contents['content_11'] = content_11;
            contents['content_12'] = content_12;
            contents['highlight_content'] = highlight_content;
            const contentsJson = JSON.stringify(contents);

            const subtitles = {};
            subtitles['sub_title_1'] = sub_title_1;
            subtitles['sub_title_2'] = sub_title_2;
            subtitles['sub_title_3'] = sub_title_3;
            subtitles['sub_title_4'] = sub_title_4;
            subtitles['sub_title_5'] = sub_title_5;
            subtitles['sub_title_6'] = sub_title_6;
            const subtitleJson = JSON.stringify(subtitles);

            const nameValues = {};
            nameValues['name_1'] = name_1;
            nameValues['name_2'] = name_2;
            nameValues['name_3'] = name_3;
            nameValues['name_4'] = name_4;
            const nameValuesJson = JSON.stringify(nameValues);

            // Update data into the story table
            const sql = "UPDATE `stories` SET cat_id=?, title=?, sub_titles=?, contents=?, images=?, names=?, must_read=?  WHERE id=?";
            const edit_results = await db.query(sql, [cat_id, title, subtitleJson, contentsJson, imagesJson, nameValuesJson, must_read, id]);

            if (edit_results.affectedRows > 0) {
                console.log('Blog affected:', edit_results.affectedRows);
                req.flash("message", "Blog has been updated successfully");
                res.redirect("back");
            } else {
                console.log(edit_results);
                req.flash("error", "Blog record has not updated.");
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
  
exports.deleteBlog = async (req, res) => {
    var id = req.params.id;
    
    try {
        //check item id  is exists in story table or not
        const sql = 'SELECT * FROM `stories` WHERE id = ?';
        const story = await db.query(sql, [id]);
        if(story.length > 0)
        {
            var story_image = story[0].story_image_1;
            // Delete the old story image
            if (story_image) {
                const oldStoryImagePath = path.join(__dirname, '../../public/', story_image);
                try {
                    await fs.access(oldStoryImagePath); // Check if the file exists
                    await fs.unlink(oldStoryImagePath); // Delete the file
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }
            var story_image = story[0].story_image_2;
            // Delete the old story image
            if (story_image) {
                const oldStoryImagePath = path.join(__dirname, '../../public/', story_image);
                try {
                    await fs.access(oldStoryImagePath); // Check if the file exists
                    await fs.unlink(oldStoryImagePath); // Delete the file
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }

            const storieImageSql = "SELECT * FROM `storie_images` WHERE storie_id=?";
            const storieImages = await db.query(storieImageSql,[id]);
            if(storieImages.length>0){
                // storieImages.forEach(storieImage => {
                for (let index = 0; index < storieImages.length; index++) {
                    // const element = array[index];
                    var story_slider_image = storieImages[index].image;
                    // Delete the old story image
                    if (story_slider_image) {
                        const oldStoryImagePath = path.join(__dirname, '../../public/', story_slider_image);
                        try {
                            await fs.access(oldStoryImagePath); // Check if the file exists
                            await fs.unlink(oldStoryImagePath); // Delete the file
                        } catch (err) {
                            console.error('Error deleting old image:', err);
                        }
                    }
                    const storiesliderimagesql = 'DELETE FROM `storie_images` WHERE id=?';
                    const edit_results = await db.query(storiesliderimagesql, [storieImages[index].id]);
                }
                // })
            }

            // Delete data from the stories table
            const sql = 'DELETE FROM `stories` WHERE id=?';
            const edit_results = await db.query(sql, [id]);
        
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Story has been deleted successfully.");
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
        req.flash("error", "Oops! Could not delete story.");
        res.redirect("back");
    }    
}
  
exports.statusBlog = async (req, res) => {
    var id = req.params.id;
    var status = req.params.status;
    try {
        //check item id  is exists in story table or not
        const sql = 'SELECT * FROM `stories` WHERE id = ?';
        const story = await db.query(sql, [id]);
        if(story.length > 0)
        {            
            // update status in the stories table
            const sql = "UPDATE `stories` SET status=?  WHERE id=?";
            const status_results = await db.query(sql, [status, id]);
        
            if (status_results.affectedRows > 0) {
                req.flash("message", "Story status has been updated successfully.");
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

exports.deleteBlogImage = async (req, res) => {
    var id = req.params.id;
    var imagenumber = req.params.imagenumber;
    console.log(imagenumber);
    try {
        //check the id is exists in story table or not
        const sql = 'SELECT * FROM `stories` WHERE id = ?';
        const story = await db.query(sql, [id]);
        if(story.length > 0)
        {
            if(imagenumber == 'first'){
                var story_image = story[0].story_image_1;
                // Delete the old banner image
                if (story_image) {
                    const oldBannerImagePath = path.join(__dirname, '../../public/', story_image);
                    try {
                        await fs.access(oldBannerImagePath); // Check if the file exists
                        await fs.unlink(oldBannerImagePath); // Delete the file
                    } catch (err) {
                        console.error('Error deleting old image:', err);
                    }
                }
                // Delete data from the stories table
                const imagesql = "UPDATE `stories` SET story_image_1=NULL WHERE id=?";
                const edit_results = await db.query(imagesql, [id]);
                if (edit_results.affectedRows > 0) {
                    req.flash("message", "Story image has been deleted succesfully.");
                    res.redirect("back");
                }else{
                    req.flash("error", `Sorry! Could not delete with id ${id}.`);
                    res.redirect("back");
                }
            }
            if(imagenumber == 'second'){
                var story_image = story[0].story_image_2;
                // Delete the old banner image
                if (story_image) {
                    const oldBannerImagePath = path.join(__dirname, '../../public/', story_image);
                    try {
                        await fs.access(oldBannerImagePath); // Check if the file exists
                        await fs.unlink(oldBannerImagePath); // Delete the file
                    } catch (err) {
                        console.error('Error deleting old image:', err);
                    }
                }
                // Delete data from the stories table
                const imagesql = "UPDATE `stories` SET story_image_2=NULL WHERE id=?";
                const edit_results = await db.query(imagesql, [id]);
                if (edit_results.affectedRows > 0) {
                    req.flash("message", "Story image has been deleted succesfully.");
                    res.redirect("back");
                }else{
                    req.flash("error", `Sorry! Could not delete with id ${id}.`);
                    res.redirect("back");
                }
            }
            
        }else{
            req.flash("error", `Sorry! Could not delete with id ${id}. Maybe id is wrong`);
            res.redirect("back");
        }
    } catch (error) {
        console.log('Error fetching data:', error);
        req.flash("error", "Oops! Could not delete cover image.");
        res.redirect("back");
    }    
}
exports.deleteBlogSliderImage = async (req, res) => {
    var id = req.params.id;    
    try {
        //check the id is exists in story table or not
        const sql = 'SELECT * FROM `storie_images` WHERE id = ?';
        const storyimage = await db.query(sql, [id]);
        if(storyimage.length > 0)
        {
            var story_image = storyimage[0].image;
            // Delete the old banner image
            if (story_image) {
                const oldBannerImagePath = path.join(__dirname, '../../public/', story_image);
                try {
                    await fs.access(oldBannerImagePath); // Check if the file exists
                    await fs.unlink(oldBannerImagePath); // Delete the file
                } catch (err) {
                    console.error('Error deleting old image:', err);
                }
            }

            // Delete data from the stories table
            const sql = 'DELETE FROM `storie_images` WHERE id=?';
            const edit_results = await db.query(sql, [id]);
        
            if (edit_results.affectedRows > 0) {
                req.flash("message", "Story slider image has been deleted succesfully.");
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
        req.flash("error", "Oops! Could not delete cover image.");
        res.redirect("back");
    }    
}