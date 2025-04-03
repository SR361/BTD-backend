const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const baseUrl = process.env.BASEURL;
const slugify = require("slugify");

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

// ================================================= VERHANDLUNG PAGE ==========================================
exports.InserServiceFirstSection = async (req, res) => {
    const { service_name, main_title, subtitle } = req.body;
    try {
        const servicesql = "select * from services where title = ?";
        const service = await db.query(servicesql,[service_name]);
        if(service.length == 0){
            var desktop_banner_image_path = "";
            if(req.files.desktop_banner_image){
                if (desktop_banner_image_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        desktop_banner_image_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                desktop_banner_image_path = '/uploads/services/' + req.files.desktop_banner_image[0].filename;
            }
            var mobile_banner_image_path = "";
            if(req.files.mobile_banner_image){
                if (mobile_banner_image_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        mobile_banner_image_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                mobile_banner_image_path = '/uploads/services/' + req.files.mobile_banner_image[0].filename;
            }
            const contentJSONParse = {
                main_title: main_title,
                subtitle: subtitle,
                desktop_banner_image: desktop_banner_image_path,
                mobile_banner_image: mobile_banner_image_path
            };
            const secondsection = {
                main_title : "",
                subtitle: "",
                content: "",
                button_label: "",
                button_link: "",
                button_link_full: "No"
            }
            const thirdsection = {
                main_title: ""
            }
            const fourthsection = {
                main_title: "",
                title_one: "",
                content_one: "",
                image_one: "",
                title_two: "",
                content_two: "",
                image_two: "",
                title_three: "",
                content_three: "",
                image_three: ""
            }
            const contentJSON = JSON.stringify(contentJSONParse);

            const sql = "INSERT INTO `services` SET title=?, first_section=?";
            const results = await db.query(sql, [service_name, contentJSON]);
            
            if (results.insertId > 0) {
                req.flash("message", "Service first section has been added successfully");
                res.redirect(`/admin/service/edit/${results.insertId}`);
            } else {
                req.flash("error", 'Sorry! Something wrong. try again.');
                res.redirect("back");
            }
        }else{
            req.flash("error", 'Sorry!. This service name already taken.');
            res.redirect("back");
        }
    } catch (error) {
        console.log("ERROR : ", error);
        res.redirect("back");
    }
}
exports.UpdateServiceFirstSection = async (req, res) => {
	const { id, service_name, main_title, subtitle } = req.body;
	try {
		const selectsql = "select * from services where id = ?";
		const service = await db.query(selectsql, [id]);

		if(service.length > 0){
            content = JSON.parse(service[0]?.first_section);
			var desktop_banner_image_path = content.desktop_banner_image;
			if(req.files.desktop_banner_image){
				if (desktop_banner_image_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						desktop_banner_image_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				desktop_banner_image_path = '/uploads/services/' + req.files.desktop_banner_image[0].filename;
			}
			var mobile_banner_image_path = content.mobile_banner_image;
			if(req.files.mobile_banner_image){
				if (mobile_banner_image_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						mobile_banner_image_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				mobile_banner_image_path = '/uploads/services/' + req.files.mobile_banner_image[0].filename;
			}
			const contentJSONParse = {
				main_title: main_title,
				subtitle: subtitle,
				desktop_banner_image: desktop_banner_image_path,
				mobile_banner_image: mobile_banner_image_path
			};
			const contentJSON = JSON.stringify(contentJSONParse);

			const updatesql = "UPDATE `services` SET title=?, first_section=? WHERE id=?";
			const updateresult = await db.query(updatesql, [service_name, contentJSON, id]);
			if (updateresult.affectedRows > 0) {
                req.flash("message", "Service first section has been update successfully");
                res.redirect(`/admin/service/edit/${id}/#firstsection`);
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
		}else{
			req.flash("error", "Sorry. Service don't not exits!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}
exports.UpdateServiceSecondSection = async (req, res) => {
    const { id, main_title, subtitle, second_section_content, button_label, button_link, button_link_full } = req.body;
    console.log(req.body);
    try {
        const selectsql = "select * from services where id = ?";
		const secondsection = await db.query(selectsql, [id]);

		if(secondsection.length > 0){
			// content = JSON.parse(secondsection[0]?.content);
			const contentJSONParse = {
				main_title: main_title,
				subtitle: subtitle,
				content: second_section_content,
				button_label: button_label,
				button_link: button_link,
				button_link_full: button_link_full
			};
			const contentJSON = JSON.stringify(contentJSONParse);

			const updatesql = "UPDATE `services` SET second_section=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSON, id]);
			if (updateresult.affectedRows > 0) {
                req.flash("message", "Service second section has been update successfully");
                res.redirect(`/admin/service/edit/${id}/#secondsection`);
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
		}else{
			req.flash("error", "Sorry. Sorry! This services don't exits");
			res.redirect("back");
		}
    } catch (error) {
        console.log("ERROR : ", error);
        res.redirect("back");
    }
}
exports.UpdateServiceThirdSection = async (req, res) => {
    const { id, main_title } = req.body;
    try {
        const selectsql = "select * from services where id = ?";
		const thirdsection = await db.query(selectsql, [id]);

		if(thirdsection.length > 0){
            const contentJSONParse = {
                main_title: main_title
            }
            const contentJSON = JSON.stringify(contentJSONParse);
            const updatesql = "UPDATE `services` SET third_section=? WHERE id=?";
            const updateresult = await db.query(updatesql, [contentJSON, id]);
            if (updateresult.affectedRows > 0) {
                req.flash("message", "Service third section has been added successfully");
                res.redirect(`/admin/service/edit/${id}/#thirdsection`);
            } else {
                req.flash("error", 'Error fetching data:', error);
                res.redirect("back");
            }
		}else{
			req.flash("error", "Sorry. Sorry! This services don't exits");
			res.redirect("back");
		}
    } catch (error) {
        console.log("ERROR : ", error);
        res.redirect("back");
    }
}
exports.UpdateServiceFourthSection = async (req, res) => {
    const { id, main_title, title_one, content_one, title_two, content_two, title_three, content_three } = req.body;
    try {
        const selectsql = "select * from services where id = ?";
		const service = await db.query(selectsql, [id]);
		if(service.length > 0){
			content = JSON.parse(service[0]?.fourth_section);
			var image_one_path = content?.image_one;
			if(req.files.image_one){
				if (image_one_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						image_one_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				image_one_path = '/uploads/services/' + req.files.image_one[0].filename;
			}
			var image_two_path = content?.image_two;
			if(req.files.image_two){
				if (image_two_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						image_two_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				image_two_path = '/uploads/services/' + req.files.image_two[0].filename;
			}
			var image_three_path = content?.image_three;
			if(req.files.image_three){
				if (image_three_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						image_three_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				image_three_path = '/uploads/services/' + req.files.image_three[0].filename;
			}

			const contentJSON = {
				main_title	: main_title,
				title_one	: title_one,
				content_one	: content_one,
				title_two	: title_two,
				content_two	: content_two,
				title_three	: title_three,
				content_three: content_three,
				image_one 	: image_one_path,
				image_two	: image_two_path,
				image_three	: image_three_path
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `services` SET fourth_section=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
                req.flash("message", "Services fourth section has been update successfully");
                res.redirect(`/admin/service/edit/${id}/#fourthsection`);
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
		}else{
			req.flash("error", "Sorry! This services don't exits");
			res.redirect("back");
		}
    } catch (error) {
        console.log("ERROR : ", error);
        res.redirect("back");	
    }
}
exports.UpdateServiceFivthSection = async (req, res) => {
    const { id, main_title, title_one, content_one, title_two, content_two, title_three, content_three, button_label, button_link } = req.body;
    try {
        const selectsql = "select * from services where id = ?";
		const service = await db.query(selectsql, [id]);
		if(service.length > 0){
			content = JSON.parse(service[0]?.fivth_section);
			var image_one_path = content?.image_one;
			if(req.files.image_one){
				if (image_one_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						image_one_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				image_one_path = '/uploads/services/' + req.files.image_one[0].filename;
			}
			var image_two_path = content?.image_two;
			if(req.files.image_two){
				if (image_two_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						image_two_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				image_two_path = '/uploads/services/' + req.files.image_two[0].filename;
			}
			var image_three_path = content?.image_three;
			if(req.files.image_three){
				if (image_three_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						image_three_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				image_three_path = '/uploads/services/' + req.files.image_three[0].filename;
			}

			const contentJSON = {
				main_title	: main_title,
				title_one	: title_one,
				content_one	: content_one,
				image_one 	: image_one_path,
				title_two	: title_two,
				content_two	: content_two,
				image_two	: image_two_path,
				title_three	: title_three,
				content_three: content_three,
				image_three	: image_three_path,
                button_label: button_label,
                button_link: button_link
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `services` SET fivth_section=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
                req.flash("message", "Services fivth section has been update successfully");
                res.redirect(`/admin/service/edit/${id}/#fivthsection`);
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
		}else{
			req.flash("error", "Sorry! This services don't exits");
			res.redirect("back");
		}
    } catch (error) {
        console.log("ERROR : ", error);
        res.redirect("back");	
    }
}
exports.UpdateServiceSixthSection = async (req, res) => {
    const { id, main_title, title_one, subtitle_one, content_one, title_two, subtitle_two, content_two, title_three, subtitle_three, content_three } = req.body;
    try {
        const selectsql = "select * from services where id = ?";
		const service = await db.query(selectsql, [id]);
		if(service.length > 0){
			content = JSON.parse(service[0]?.sixth_section);
			var image_one_path = content?.image_one;
			if(req.files.image_one){
				if (image_one_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						image_one_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				image_one_path = '/uploads/services/' + req.files.image_one[0].filename;
			}
			var image_two_path = content?.image_two;
			if(req.files.image_two){
				if (image_two_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						image_two_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				image_two_path = '/uploads/services/' + req.files.image_two[0].filename;
			}
			var image_three_path = content?.image_three;
			if(req.files.image_three){
				if (image_three_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						image_three_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				image_three_path = '/uploads/services/' + req.files.image_three[0].filename;
			}

			const contentJSON = {
				main_title	: main_title,
				title_one	: title_one,
                subtitle_one: subtitle_one,
				content_one	: content_one,
				image_one 	: image_one_path,
				title_two	: title_two,
                subtitle_two: subtitle_two,
				content_two	: content_two,
				image_two	: image_two_path,
				title_three	: title_three,
                subtitle_three:subtitle_three,
				content_three: content_three,
				image_three	: image_three_path
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `services` SET sixth_section=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
                req.flash("message", "Services sixth section has been update successfully");
                res.redirect(`/admin/service/edit/${id}/#sixthsection`);
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
		}else{
			req.flash("error", "Sorry! This services don't exits");
			res.redirect("back");
		}
    } catch (error) {
        console.log("ERROR : ", error);
        res.redirect("back");	
    }
}
exports.UpdateServiceSeventhSection = async (req, res) => {
    const { id, main_title, subtitle, button_label, button_link, shortcontent } = req.body;
    try {
        const selectsql = "select * from services where id = ?";
		const service = await db.query(selectsql, [id]);
		if(service.length > 0){
			content = JSON.parse(service[0]?.sixth_section);
			var logo_image_path = content?.logo_image;
			if(req.files.logo_image){
				if (logo_image_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						logo_image_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				logo_image_path = '/uploads/services/' + req.files.logo_image[0].filename;
			}
			var background_image_path = content?.background_image;
			if(req.files.background_image){
				if (background_image_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						background_image_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				background_image_path = '/uploads/services/' + req.files.background_image[0].filename;
			}

			const contentJSON = {
				main_title	: main_title,
                subtitle    : subtitle,
                button_label: button_label,
                button_link: button_link,
				shortcontent: shortcontent,
				logo_image 	: logo_image_path,
                background_image: background_image_path
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `services` SET seventh_section=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
                req.flash("message", "Services seventh section has been update successfully");
                res.redirect(`/admin/service/edit/${id}/#seventhsection`);
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
		}else{
			req.flash("error", "Sorry! This services don't exits");
			res.redirect("back");
		}
    } catch (error) {
        console.log("ERROR : ", error);
        res.redirect("back");	
    }
}
exports.UpdateServiceEighthSection = async (req, res) => {
    const { id, main_title, subtitle, button_label, button_link, shortcontent } = req.body;
    try {
        const selectsql = "select * from services where id = ?";
		const service = await db.query(selectsql, [id]);
		if(service.length > 0){
			content = JSON.parse(service[0]?.eighth_section);
			var image_path = content?.image;
			if(req.files.image){
				if (image_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						image_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				image_path = '/uploads/services/' + req.files.image[0].filename;
			}

			const contentJSON = {
				main_title	: main_title,
                subtitle    : subtitle,
                button_label: button_label,
                button_link : button_link,
				shortcontent: shortcontent,
				image 	    : image_path
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `services` SET eighth_section=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
                req.flash("message", "Services eighth section has been update successfully");
                res.redirect(`/admin/service/edit/${id}/#eightthsection`);
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
		}else{
			req.flash("error", "Sorry! This services don't exits");
			res.redirect("back");
		}
    } catch (error) {
        console.log("ERROR : ", error);
        res.redirect("back");	
    }
}
exports.UpdateServiceNinethSection = async (req, res) => {
    const { id, main_title, subtitle, button_label, button_link, portfolio_points } = req.body;
    try {
        const selectsql = "select * from services where id = ?";
        const ninethsection = await db.query(selectsql, [id]);
        if(ninethsection.length > 0){
            const content = JSON.parse(ninethsection[0]?.nineth_section);
            var image_path = content?.image;
            if(req.files.image){
                if (image_path) {
                    const oldImagePath = path.join(
                        __dirname,
                        "../../public/",
                        image_path
                    );
                    try {
                        await fs.access(oldImagePath);
                        await fs.unlink(oldImagePath);
                    } catch (error) { }
                }
                image_path = '/uploads/services/' + req.files.image[0].filename;
            }
            const pointJSON = JSON.stringify(portfolio_points);
            const contentJSON = {
                main_title: main_title,
                subtitle: subtitle,
                button_label: button_label,
                button_link: button_link,
                point : pointJSON,
                image : image_path
            };

            const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `services` SET nineth_section=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
                req.flash("message", "Services nineth section has been update successfully");
                res.redirect(`/admin/service/edit/${id}/#ninethsection`);
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
        }else{
            req.flash("error", "Sorry! This services don't exits");
            res.redirect("back");
        }
    } catch (error) {
        console.log("ERROR : ", error);
        res.redirect("back");
    }
}
// ================================================= VERHANDLUNG PAGE ==========================================

exports.edit = async (req, res) => {
    const serviceID = req.params.id;
    try {
        const sql = 'SELECT * FROM `services` WHERE id = ?';
        const service = await db.query(sql, [serviceID]);

        if(service.length > 0){
            res.render("service/edit", {
                title: "Edit Service",
                service: service[0],
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

exports.destory = async (req, res) => {
    var id = req.params.id;
    try {
        const sql = "SELECT * FROM `services` WHERE id = ?";
        const single_service = await db.query(sql, [id]);
        if (single_service.length > 0) {
            const service = single_service[0];
            const firstsection = JSON.parse(service.first_section);
            // const thirdsection = JSON.parse(service.third_section);
            const fourthsection = JSON.parse(service.fourth_section);
            const fivthsection = JSON.parse(service.fivth_section);
            const sixthsection = JSON.parse(service.sixth_section);
            const seventhsection = JSON.parse(service.seventh_section)
            const eighthsection = JSON.parse(service.eighth_section)
            const ninethsection = JSON.parse(service.nineth_section)

            const allimages = [];
            allimages.push(firstsection.desktop_banner_image);
            allimages.push(firstsection.mobile_banner_image);

            allimages.push(fourthsection.image_one);
            allimages.push(fourthsection.image_two);
            allimages.push(fourthsection.image_three);
            
            allimages.push(fivthsection.image_one);
            allimages.push(fivthsection.image_two);
            allimages.push(fivthsection.image_three);
            
            allimages.push(sixthsection.image_one);
            allimages.push(sixthsection.image_two);
            allimages.push(sixthsection.image_three);
            
            allimages.push(seventhsection.logo_image);
            allimages.push(seventhsection.background_image);

            allimages.push(eighthsection.image);
            allimages.push(ninethsection.image);
            
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
// Manage meta tags
exports.manageServiceMetaTag = async (req, res) => {
    var service_id = req.params.id;
    try {
        const metatagssql = "select * from services where id = ?";
        const metaTags = await db.query(metatagssql, [service_id]);
        if(metaTags.length > 0){
            res.render("service/meta-tags.ejs", {
                title: "Services",
                metaTags: metaTags[0],
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        }else{
            req.flash("error", "Sorry. No page not found!");
            res.redirect("back");
        }
        
    } catch (error) {
        console.log("ERROR : ", error);
        res.redirect("back");	
    }
}

exports.metaTagUpdate = async (req, res) => {
    const { id, service_name, slug, metatitle, metakeywords, metadescription } = req.body;
    try {
        const selectsql = "select * from services where id = ?";
        const metTags = await db.query(selectsql, [id]);
        if(metTags.length > 0){
            const updatesql = "UPDATE `services` SET title=?, slug=?, metatitle=?, metakeywords=?, metadescription=? WHERE id=?";
            const updateresult = await db.query(updatesql, [service_name, slug, metatitle, metakeywords, metadescription, id]);
            if (updateresult.affectedRows > 0) {
                req.flash("message", "Service meta tags has been update successfully");
                res.redirect("/admin/services");
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
        }else{
            req.flash("error", "Sorry. page meta tags not found!");
            res.redirect("back");
        }
    } catch (error) {
        console.log("ERROR : ", error);
        res.redirect("back");
    }
}