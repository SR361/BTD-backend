const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const baseUrl = process.env.BASEURL;

exports.index = async (req, res) => {
    var page = req.query.page || 1;
    var perPage = (30)*1;
    var offset = (page-1)*perPage;

    try {
        const sqlCount = 'SELECT COUNT(*) AS totalServices FROM `services`';
        const [countRows] = await db.query(sqlCount);
        const totalServices = countRows.totalServices;

        //check the email id  is exists in Pages table or not
        const sql = 'SELECT * FROM `services` LIMIT ? OFFSET ?';
        const services = await db.query(sql, [perPage, offset]);
        
        
        res.render("service/index", {
            title: "Service",
            services: services,
            baseUrl: baseUrl,
            paginationUrl:"pages",
            currentPage: page,
            totalServices: Math.ceil(totalServices/ perPage),
            message: req.flash("message"),
            error: req.flash("error"),
        });

    } catch (error) {
        console.error('Error fetching data:', error);
        res.redirect("back");
    }
}

exports.create = async (req, res) => {
    res.render("service/create", {
        title: "Add Service",
        message: req.flash("message"),
        error: req.flash("error"),
    });
}

exports.store = async (req, res) => {
    const {
        firstsection_main_title, firstsection_content_one, firstsection_content_two, firstsection_content_three,
        secondsection_main_title, secondsection_title_one, secondsection_content_one, secondsection_title_two, secondsection_content_two, secondsection_title_three,  secondsection_content_three,
        thirdsection_main_title, thirdsection_main_content, thirdsection_title_one, thirdsection_content_one, thirdsection_button_label_one,thirdsection_button_link_one, thirdsection_title_two, thirdsection_content_two, thirdsection_button_label_two, thirdsection_button_link_two, thirdsection_title_three, thirdsection_content_three, thirdsection_button_label_three, thirdsection_button_link_three, 
        fourthsection_main_title, fourthsection_content, fourthsection_button_label, fourthsection_button_link,
        fivthsection_main_title, fivthsection_title_one, fivthsection_subtitle_one, fivthsection_content_one, fivthsection_title_two, fivthsection_subtitle_two, fivthsection_content_two, fivthsection_title_three, fivthsection_subtitle_three, fivthsection_content_three, 
        sixthsection_main_title, sixthsection_content, sixthsection_button_label, sixthsection_button_link, 
        seventhsection_main_title, seventhsection_subtitle, seventhsection_youtube_link, seventhsection_content,
        eighthsection_main_title
    } = req.body;
    try {
        console.log(req.body);
        const sql = "SELECT * FROM `services` WHERE title = ?";
        const checkService = await db.query(sql, [firstsection_main_title]);
        
        if(checkService.length === 0){
            var firstsection_banner_image_path = "";
            if(req.files.firstsection_banner_image){
                firstsection_banner_image_path = '/uploads/services/' + req.files.firstsection_banner_image[0].filename;
            }

            var secondsection_image_one_path = "";
            if(req.files.secondsection_image_one){
                secondsection_image_one_path = '/uploads/services/' + req.files.secondsection_image_one[0].filename;
            }
            var secondsection_image_two_path = "";
            if(req.files.secondsection_image_two){
                secondsection_image_two_path = '/uploads/services/' + req.files.secondsection_image_two[0].filename;
            }
            var secondsection_image_three_path = "";
            if(req.files.secondsection_image_three){
                secondsection_image_three_path = '/uploads/services/' + req.files.secondsection_image_three[0].filename;
            }

            var thirdsection_image_one_path = "";
            if(req.files.thirdsection_image_one){
                thirdsection_image_one_path = '/uploads/services/' + req.files.thirdsection_image_one[0].filename;
            }
            var thirdsection_image_two_path = "";
            if(req.files.thirdsection_image_two){
                thirdsection_image_two_path = '/uploads/services/' + req.files.thirdsection_image_two[0].filename;
            }
            var thirdsection_image_three_path = "";
            if(req.files.thirdsection_image_three){
                thirdsection_image_three_path = '/uploads/services/' + req.files.thirdsection_image_three[0].filename;
            }

            var fourthsection_image_path = "";
            if(req.files.fourthsection_image){
                fourthsection_image_path = '/uploads/services/' + req.files.fourthsection_image[0].filename;
            }

            var fivthsection_image_one_path = "";
            if(req.files.fivthsection_image_one){
                fivthsection_image_one_path = '/uploads/services/' + req.files.fivthsection_image_one[0].filename;
            }
            var fivthsection_image_two_path = "";
            if(req.files.fivthsection_image_two){
                fivthsection_image_two_path = '/uploads/services/' + req.files.fivthsection_image_two[0].filename;
            }
            var fivthsection_image_three_path = "";
            if(req.files.fivthsection_image_three){
                fivthsection_image_three_path = '/uploads/services/' + req.files.fivthsection_image_three[0].filename;
            }

            const firstsection = {
                main_title: firstsection_main_title,
                banner_image: firstsection_banner_image_path,
                content_one: firstsection_content_one,
                content_two: firstsection_content_two,
                content_three: firstsection_content_three
            };
            const secondsection = {
                main_title: secondsection_main_title,
                title_one: secondsection_title_one,
                image_one: secondsection_image_one_path,
                content_one: secondsection_content_one,
                title_two: secondsection_title_two,
                image_two: secondsection_image_two_path,
                content_two: secondsection_content_two,
                title_three: secondsection_title_three,
                image_three: secondsection_image_three_path,
                content_three: secondsection_content_three,
            };
            const thirdsection = {
                main_title: thirdsection_main_title,
                main_content: thirdsection_main_content,
                title_one: thirdsection_title_one,
                content_one: thirdsection_content_one,
                image_one: thirdsection_image_one_path,
                button_label_one: thirdsection_button_label_one,
                button_link_one: thirdsection_button_link_one,
                title_two: thirdsection_title_two,
                content_two: thirdsection_content_two,
                image_two: thirdsection_image_two_path,
                button_label_two: thirdsection_button_label_two,
                button_link_two: thirdsection_button_link_two,
                title_three: thirdsection_title_three,
                content_three: thirdsection_content_three,
                image_three: thirdsection_image_three_path,
                button_label_three: thirdsection_button_label_three,
                button_link_three: thirdsection_button_link_three,
            };
            const fourthsection = {
                main_title: fourthsection_main_title,
                image: fourthsection_image_path,
                content: fourthsection_content,
                button_label: fourthsection_button_label,
                button_link: fourthsection_button_link,
            };
            const fivthsection = {
                main_title: fivthsection_main_title,
                title_one: fivthsection_title_one,
                subtitle_one: fivthsection_subtitle_one,
                content_one: fivthsection_content_one,
                image_one: fivthsection_image_one_path,
                title_two: fivthsection_title_two,
                subtitle_two: fivthsection_subtitle_two,
                content_two: fivthsection_content_two,
                image_two: fivthsection_image_two_path,
                title_three: fivthsection_title_three,
                subtitle_three: fivthsection_subtitle_three,
                content_three: fivthsection_content_three,
                image_three: fivthsection_image_three_path
            };
            const sixthsection = {
                main_title: sixthsection_main_title,
                content: sixthsection_content,
                button_label: sixthsection_button_label,
                button_link: sixthsection_button_link,
            }
            const seventhsection = {
                main_title: seventhsection_main_title,
                subtitle: seventhsection_subtitle,
                youtube_link: seventhsection_youtube_link,
                content: seventhsection_content
            }
            const eighthsection = {
                main_title: eighthsection_main_title,
            };

            const firstsectionJSON = JSON.stringify(firstsection);
            const secondsectionJSON = JSON.stringify(secondsection);
            const thirdsectionJSON = JSON.stringify(thirdsection);
            const fourthsectionJSON = JSON.stringify(fourthsection);
            const fivthsectionJSON = JSON.stringify(fivthsection);
            const sixthsectionJSON = JSON.stringify(sixthsection);
            const seventhsectionJSON = JSON.stringify(seventhsection);
            const eighthsectionJSON = JSON.stringify(eighthsection);
            
            const sql = "INSERT INTO `services` SET title=?, first_section=?, second_section=?, third_section=?, fourth_section=?, fivth_section=?, sixth_section=?, seventh_section=?, eighth_section=?";
            const results = await db.query(sql, [firstsection_main_title, firstsectionJSON, secondsectionJSON, thirdsectionJSON, fourthsectionJSON, fivthsectionJSON, sixthsectionJSON, seventhsectionJSON, eighthsectionJSON]);

            if (req.files.eighthsection_images.length > 0) {
                otherimages = req.files.eighthsection_images;
                otherimages.forEach((img) => {
                    var image = "/uploads/services/" + img.filename;
                    const imgsql = "INSERT INTO `service_images` SET service_id=?, image=?";
                    const img_results = db.query(imgsql, [results.insertId, image]);
                });
            }

            if (results.insertId > 0) {
                req.flash("message", "Service has been created successfully");
                res.redirect("/admin/services");
            } else {
                req.flash("error", 'Error fetching data:', error);
                res.redirect("back");        
            }
        }else{
            req.flash("error", "Sorry. This services is already exists!");
            res.redirect("back");
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.redirect("back");
    }
}

exports.edit = async (req, res) => {
    const serviceID = req.params.id;
    try {
        const sql = 'SELECT * FROM `services` WHERE id = ?';
        const service = await db.query(sql, [serviceID]);
        
        const serviceImageSql = "select * from service_images where service_id = ?";
        const serviceimages = await db.query(serviceImageSql,[service[0].id]);
        console.log(serviceimages);

        if(service.length > 0){
            res.render("service/edit", {
                title: "Edit Service",
                service: service[0],
                serviceimages: serviceimages,
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        }else{
            req.flash("error", "Sorry. No story records exists!");
            res.redirect("/admin/serices");
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
        res.redirect("back");
    }
}

exports.update = async (req, res) => {
    const {
        id, firstsection_main_title, firstsection_content_one, firstsection_content_two, firstsection_content_three,
        secondsection_main_title, secondsection_title_one, secondsection_content_one, secondsection_title_two, secondsection_content_two, secondsection_title_three,  secondsection_content_three,
        thirdsection_main_title, thirdsection_main_content, thirdsection_title_one, thirdsection_content_one, thirdsection_button_label_one,thirdsection_button_link_one, thirdsection_title_two, thirdsection_content_two, thirdsection_button_label_two, thirdsection_button_link_two, thirdsection_title_three, thirdsection_content_three, thirdsection_button_label_three, thirdsection_button_link_three, 
        fourthsection_main_title, fourthsection_content, fourthsection_button_label, fourthsection_button_link,
        fivthsection_main_title, fivthsection_title_one, fivthsection_subtitle_one, fivthsection_content_one, fivthsection_title_two, fivthsection_subtitle_two, fivthsection_content_two, fivthsection_title_three, fivthsection_subtitle_three, fivthsection_content_three, 
        sixthsection_main_title, sixthsection_content, sixthsection_button_label, sixthsection_button_link, 
        seventhsection_main_title, seventhsection_subtitle, seventhsection_youtube_link, seventhsection_content,
        eighthsection_main_title
    } = req.body;
    try {
        const servicesql = "select * from services WHERE title=? AND id !=?";
        const checkService = await db.query(servicesql, [firstsection_main_title, id]);

        const sql = "SELECT * FROM `services` WHERE id = ?";
        const service = await db.query(sql, [id]);
        if(service.length > 0 && checkService.length === 0){

            const firstsectionJSONParse = JSON.parse(service[0]?.first_section);
            var firstsection_banner_image_path = firstsectionJSONParse.banner_image;
            if(req.files.firstsection_banner_image){
                if (firstsection_banner_image_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        firstsection_banner_image_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                firstsection_banner_image_path = '/uploads/services/' + req.files.firstsection_banner_image[0].filename;
            }

            const secondsectionJSONParse = JSON.parse(service[0]?.second_section);
            var secondsection_image_one_path = secondsectionJSONParse.image_one;
            if(req.files.secondsection_image_one){
                if (secondsection_image_one_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        secondsection_image_one_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                secondsection_image_one_path = '/uploads/services/' + req.files.secondsection_image_one[0].filename;
            }
            var secondsection_image_two_path = secondsectionJSONParse.image_two;
            if(req.files.secondsection_image_two){
                if (secondsection_image_two_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        secondsection_image_two_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                secondsection_image_two_path = '/uploads/services/' + req.files.secondsection_image_two[0].filename;
            }
            var secondsection_image_three_path = secondsectionJSONParse.image_three;
            if(req.files.secondsection_image_three){
                if (secondsection_image_three_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        secondsection_image_three_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                secondsection_image_three_path = '/uploads/services/' + req.files.secondsection_image_three[0].filename;
            }

            const thirdsectionJSONParse = JSON.parse(service[0]?.third_section);
            var thirdsection_image_one_path = thirdsectionJSONParse.image_one;
            if(req.files.thirdsection_image_one){
                if (thirdsection_image_one_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        thirdsection_image_one_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                thirdsection_image_one_path = '/uploads/services/' + req.files.thirdsection_image_one[0].filename;
            }
            var thirdsection_image_two_path = thirdsectionJSONParse.image_two;
            if(req.files.thirdsection_image_two){
                if (thirdsection_image_two_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        thirdsection_image_two_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                thirdsection_image_two_path = '/uploads/services/' + req.files.thirdsection_image_two[0].filename;
            }
            var thirdsection_image_three_path = thirdsectionJSONParse.image_three;
            if(req.files.thirdsection_image_three){
                if (thirdsection_image_three_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        thirdsection_image_three_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                thirdsection_image_three_path = '/uploads/services/' + req.files.thirdsection_image_three[0].filename;
            }

            const fourthsectionJSONParse = JSON.parse(service[0]?.fourth_section);
            var fourthsection_image_path = fourthsectionJSONParse.image;
            if(req.files.fourthsection_image){
                if (fourthsection_image_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        fourthsection_image_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                fourthsection_image_path = '/uploads/services/' + req.files.fourthsection_image[0].filename;
            }

            const fivthsectionJSONParse = JSON.parse(service[0].fivth_section)
            var fivthsection_image_one_path = fivthsectionJSONParse.image_one;
            if(req.files.fivthsection_image_one){
                if (fivthsection_image_one_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        fivthsection_image_one_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                fivthsection_image_one_path = '/uploads/services/' + req.files.fivthsection_image_one[0].filename;
            }
            var fivthsection_image_two_path = fivthsectionJSONParse.image_two;
            if(req.files.fivthsection_image_two){
                if (fivthsection_image_two_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        fivthsection_image_two_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                fivthsection_image_two_path = '/uploads/services/' + req.files.fivthsection_image_two[0].filename;
            }
            var fivthsection_image_three_path = fivthsectionJSONParse.image_three;
            if(req.files.fivthsection_image_three){
                if (fivthsection_image_three_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        fivthsection_image_three_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                fivthsection_image_three_path = '/uploads/services/' + req.files.fivthsection_image_three[0].filename;
            }

            const firstsection = {
                main_title: firstsection_main_title,
                banner_image: firstsection_banner_image_path,
                content_one: firstsection_content_one,
                content_two: firstsection_content_two,
                content_three: firstsection_content_three
            };
            const secondsection = {
                main_title: secondsection_main_title,
                title_one: secondsection_title_one,
                image_one: secondsection_image_one_path,
                content_one: secondsection_content_one,
                title_two: secondsection_title_two,
                image_two: secondsection_image_two_path,
                content_two: secondsection_content_two,
                title_three: secondsection_title_three,
                image_three: secondsection_image_three_path,
                content_three: secondsection_content_three,
            };
            const thirdsection = {
                main_title: thirdsection_main_title,
                main_content: thirdsection_main_content,
                title_one: thirdsection_title_one,
                content_one: thirdsection_content_one,
                image_one: thirdsection_image_one_path,
                button_label_one: thirdsection_button_label_one,
                button_link_one: thirdsection_button_link_one,
                title_two: thirdsection_title_two,
                content_two: thirdsection_content_two,
                image_two: thirdsection_image_two_path,
                button_label_two: thirdsection_button_label_two,
                button_link_two: thirdsection_button_link_two,
                title_three: thirdsection_title_three,
                content_three: thirdsection_content_three,
                image_three: thirdsection_image_three_path,
                button_label_three: thirdsection_button_label_three,
                button_link_three: thirdsection_button_link_three,
            };
            const fourthsection = {
                main_title: fourthsection_main_title,
                image: fourthsection_image_path,
                content: fourthsection_content,
                button_label: fourthsection_button_label,
                button_link: fourthsection_button_link,
            };
            const fivthsection = {
                main_title: fivthsection_main_title,
                title_one: fivthsection_title_one,
                subtitle_one: fivthsection_subtitle_one,
                content_one: fivthsection_content_one,
                image_one: fivthsection_image_one_path,
                title_two: fivthsection_title_two,
                subtitle_two: fivthsection_subtitle_two,
                content_two: fivthsection_content_two,
                image_two: fivthsection_image_two_path,
                title_three: fivthsection_title_three,
                subtitle_three: fivthsection_subtitle_three,
                content_three: fivthsection_content_three,
                image_three: fivthsection_image_three_path
            };
            const sixthsection = {
                main_title: sixthsection_main_title,
                content: sixthsection_content,
                button_label: sixthsection_button_label,
                button_link: sixthsection_button_link,
            }
            const seventhsection = {
                main_title: seventhsection_main_title,
                subtitle: seventhsection_subtitle,
                youtube_link: seventhsection_youtube_link,
                content: seventhsection_content
            }
            const eighthsection = {
                main_title: eighthsection_main_title,
            };

            const firstsectionJSON = JSON.stringify(firstsection);
            const secondsectionJSON = JSON.stringify(secondsection);
            const thirdsectionJSON = JSON.stringify(thirdsection);
            const fourthsectionJSON = JSON.stringify(fourthsection);
            const fivthsectionJSON = JSON.stringify(fivthsection);
            const sixthsectionJSON = JSON.stringify(sixthsection);
            const seventhsectionJSON = JSON.stringify(seventhsection);
            const eighthsectionJSON = JSON.stringify(eighthsection);

            const updatesql = "UPDATE `services` SET title=?, first_section=?, second_section=?, third_section=?, fourth_section=?, fivth_section=?, sixth_section=?, seventh_section=?, eighth_section=? WHERE id=?";
            const updateresult = await db.query(updatesql, [firstsection_main_title, firstsectionJSON, secondsectionJSON, thirdsectionJSON, fourthsectionJSON, fivthsectionJSON, sixthsectionJSON, seventhsectionJSON, eighthsectionJSON, id]);

            if (req.files.eighthsection_images) {
                if (req.files.eighthsection_images.length > 0) {
                    otherimages = req.files.eighthsection_images;
                    otherimages.forEach((img) => {
                        var image = "/uploads/services/" + img.filename;
                        const imgsql = "INSERT INTO `service_images` SET service_id=?, image=?";
                        const img_results = db.query(imgsql, [id, image]);
                    });
                }
            }

            if (updateresult.affectedRows > 0) {
                req.flash("message", "Service has been update successfully");
                res.redirect("/admin/services");
            } else {
                req.flash("error", "Error fetching data:", error);
                res.redirect("back");
            }
        }else{
            req.flash("error", "Sorry. This service is already exists!");
            res.redirect("back");
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.redirect("back");
    }
}

exports.deleteimage = async (req, res) => {
    var id = req.params.id;
    try {
        const sql = "SELECT * FROM `service_images` WHERE id = ?";
        const serviceimage = await db.query(sql, [id]);
        if (serviceimage.length > 0) {
            var img = serviceimage[0].image;
            if (img) {
                const oldImagePath = path.join(__dirname, "../../public/", img);
                try {
                    await fs.access(oldImagePath);
                    await fs.unlink(oldImagePath);
                } catch (err) {
                    console.error("Error deleting old image:", err);
                }
            }
            const deleteSql = "DELETE FROM `service_images` WHERE id=?";
            const edit_results = await db.query(deleteSql, [id]);

            if (edit_results.affectedRows > 0) {
                req.flash("message", "Service image has been deleted succesfully.");
                res.redirect("back");
            } else {
                req.flash("error", `Sorry! Could not delete with id ${id}.`);
                res.redirect("back");
            }
        } else {
            req.flash(
                "error",
                `Sorry! Could not delete with id ${id}. Maybe id is wrong`
            );
            res.redirect("back");
        }
    } catch (error) {
        console.log("Error fetching data:", error);
        req.flash("error", "Oops! Could not delete banner image.");
        res.redirect("back");
    }
};

exports.destory = async (req, res) => {
    var id = req.params.id;
    try {
        const sql = "SELECT * FROM `services` WHERE id = ?";
        const single_service = await db.query(sql, [id]);
        if (single_service.length > 0) {
            const service = single_service[0];
            const firstsection = JSON.parse(service.first_section);
            const secondsection = JSON.parse(service.second_section);
            const thirdsection = JSON.parse(service.third_section);
            const fourthsection = JSON.parse(service.fourth_section);
            const fivthsection = JSON.parse(service.fivth_section);
            const eighthsection = JSON.parse(service.eighth_section)

            const allimages = [];
            allimages.push(firstsection.banner_image);
            allimages.push(secondsection.image_one);
            allimages.push(secondsection.image_two);
            allimages.push(secondsection.image_three);
            allimages.push(thirdsection.image_one);
            allimages.push(thirdsection.image_two);
            allimages.push(thirdsection.image_three);
            allimages.push(fourthsection.image);
            allimages.push(fivthsection.image_one);
            allimages.push(fivthsection.image_two);
            allimages.push(fivthsection.image_three);
            
            if (allimages.length > 0) {
                for (let index = 0; index < allimages.length; index++) {
                    const oldImagePath = path.join(__dirname, "../../public/",allimages[index]);
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (err) {
                        console.error("Error deleting old image:", err);
                    }
                }
            }

            var serviceimagesql = "SELECT * FROM `service_images` WHERE service_id=?";
            var servicesimages = await db.query(serviceimagesql, [id]);

            if (servicesimages.length > 0) {
                for (let index = 0; index < servicesimages.length; index++) {
                    const oldImagePath = path.join(__dirname, '../../public/', servicesimages[index].image);
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (err) {
                        console.error('Error deleting old image:', err);
                    }
                }
                const imgsql = "delete from  `service_images` WHERE service_id=?";
                const serviceimage =  db.query(imgsql, [id]);
            }

            const sql = "DELETE FROM `services` WHERE id=?";
            const results = await db.query(sql, [id]);

            if (results.affectedRows > 0) {
                req.flash("message", "Service Item has been deleted successfully.");
                res.redirect("back");
            } else {
                req.flash("error", `Sorry! Could not delete with id ${id}.`);
                res.redirect("back");
            }
        } else {
            req.flash("error", `Sorry! Could not delete with id ${id}. Maybe id is wrong`);
            res.redirect("back");
        }
    } catch (error) {
        console.log("Error fetching data:", error);
        req.flash("error", "Oops! Could not delete product.");
        res.redirect("back");
    }
}