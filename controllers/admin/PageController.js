const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const baseUrl = process.env.BASEURL;
const FRONTEND_URL = process.env.FRONTEND_URL;

exports.getAllPages = async (req, res) => {
    var page = req.query.page || 1;
    var perPage = (30)*1;
    var offset = (page-1)*perPage;

    try {
      const sqlCount = 'SELECT COUNT(*) AS totalPages FROM `page_lists`';
      const [countRows] = await db.query(sqlCount);
      const totalPages = countRows.totalPages;

      //check the email id  is exists in Pages table or not
      const sql = 'SELECT * FROM `page_lists` LIMIT ? OFFSET ?';
      const pages = await db.query(sql, [perPage, offset]);
	  
    
      res.render("Pages/index", {
        title: "Pages",
        pages: pages,
        baseUrl: baseUrl,
        paginationUrl:"pages",
        currentPage: page,
        totalPages: Math.ceil(totalPages/ perPage),
        message: req.flash("message"),
        error: req.flash("error"),
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      res.redirect("back");
    }
};
exports.pageSectionList = async (req, res) => {
	var slug = req.params.slug;
	const sql = "SELECT * FROM `page_lists` WHERE slug=?";
	const page = await db.query(sql,[slug]);

	const pageSectionListSql = "SELECT * FROM `pages` WHERE slug=? ORDER BY `id` ASC";
	const pageSectioLists = await db.query(pageSectionListSql,[slug]);

	const articleSql = `SELECT * FROM articles WHERE category=? ORDER BY id desc`;
	const articles = await db.query(articleSql,[slug]);

	// const contactSql = "SELECT * FROM `contacts`";
	// const contacts = await db.query(contactSql);
	
	res.render("Pages/page-section-list", {
        title: "Pages",
		slug : slug,
		page : page[0],
		articles : articles,
		pageSectioLists : pageSectioLists,
        message: req.flash("message"),
        error: req.flash("error"),
      });
};
exports.editPage = async (req, res) => {
	console.log("Test");
    var page_id = req.params.id;
	var slug = req.params.slug;
	var section = req.params.section;
	try {
		if(slug == 'home'){
			if(section == 'First Section'){
				const firstsectionsql = "select * from pages where id = ?";
				const firstsection = await db.query(firstsectionsql, [page_id]);
				if(firstsection.length > 0){
					res.render("Pages/home/first-section.ejs", {
						title: "Home Page",
						firstsection: firstsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}else if(section == 'Second Section'){
				const secondsectionsql = "select * from pages where id = ?";
				const secondsection = await db.query(secondsectionsql, [page_id]);
				if(secondsection.length > 0){
					res.render("Pages/home/second-section.ejs", {
						title: "Home Page",
						secondsection: secondsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}else if(section == 'Third Section'){
				const thirdsectionsql = "select * from pages where id = ?";
				const thirdsection = await db.query(thirdsectionsql, [page_id]);

				const imagesql = "select * from page_images where page_id = ?";
				const pageimages = await db.query(imagesql, [page_id]);
				if(thirdsection.length > 0){
					res.render("Pages/home/third-section.ejs", {
						title: "Home Page",
						thirdsection: thirdsection[0],
						pageimages: pageimages,
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}else if(section == 'Fourth Section'){
				const fourthsectionsql = "select * from pages where id = ?";
				const fourthsection = await db.query(fourthsectionsql, [page_id]);

				const imagesql = "select * from page_images where page_id = ?";
				const pageimages = await db.query(imagesql, [page_id]);

				if(fourthsection.length > 0){
					res.render("Pages/home/fourth-section.ejs", {
						title: "Home Page",
						fourthsection: fourthsection[0],
						pageimages: pageimages,
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}else if(section == 'Fifth Section'){
				const fifthsectionsql = "select * from pages where id = ?";
				const fifthsection = await db.query(fifthsectionsql, [page_id]);
				if(fifthsection.length > 0){
					res.render("Pages/home/fifth-section.ejs", {
						title: "Home Page",
						fifthsection: fifthsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}else if(section == 'Sixth Section'){
				const sixthsectionsql = "select * from pages where id = ?";
				const sixthsection = await db.query(sixthsectionsql, [page_id]);
				if(sixthsection.length > 0){
					res.render("Pages/home/sixth-section.ejs", {
						title: "Home Page",
						sixthsection: sixthsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}
		}else if(slug == 'service'){
			if(section === 'First Section'){
				const firstsectionsql = "select * from pages where id = ?";
				const firstsection = await db.query(firstsectionsql, [page_id]);

				if(firstsection.length > 0){
					res.render("Pages/service/first-section.ejs", {
						title: "Service Page",
						firstsection: firstsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}else if(section == 'Second Section'){
				const secondsectionsql = "select * from pages where id = ?";
				const secondsection = await db.query(secondsectionsql, [page_id]);

				if(secondsection.length > 0){
					res.render("Pages/service/second-section.ejs", {
						title: "Service Page",
						secondsection: secondsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}else if(section == 'Third Section'){
				const thirdsectionsql = "select * from pages where id = ?";
				const thirdsection = await db.query(thirdsectionsql, [page_id]);

				if(thirdsection.length > 0){
					res.render("Pages/service/third-section.ejs", {
						title: "Service Page",
						thirdsection: thirdsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}
		}else if(slug == 'about-us'){
			if(section === 'First Section'){
				const firstsectionsql = "select * from pages where id = ?";
				const firstsection = await db.query(firstsectionsql, [page_id]);

				if(firstsection.length > 0){
					res.render("Pages/about-us/first-section.ejs", {
						title: "About Us",
						firstsection: firstsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			} else if(section === 'Second Section'){
				const secondsectionsql = "select * from pages where id = ?";
				const secondsection = await db.query(secondsectionsql, [page_id]);

				if(secondsection.length > 0){
					res.render("Pages/about-us/second-section.ejs", {
						title: "About Us",
						secondsection: secondsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			} else if(section === 'Third Section'){
				const thirdsectionsql = "select * from pages where id = ?";
				const thirdsection = await db.query(thirdsectionsql, [page_id]);
				console.log("Third Section == ",thirdsection[0]);
				if(thirdsection.length > 0){
					res.render("Pages/about-us/third-section.ejs", {
						title: "About Us",
						thirdsection: thirdsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}
		}else if(slug === 'contact'){
			if(section === 'First Section'){
				const firstsectionsql = "select * from pages where id = ?";
				const firstsection = await db.query(firstsectionsql, [page_id]);

				if(firstsection.length > 0){
					res.render("Pages/contact/first-section.ejs", {
						title: "Contact page",
						firstsection: firstsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}
		}else if(slug === 'data-protection'){
			if(section === 'First Section'){
				const firstsectionsql = "select * from pages where id = ?";
				const firstsection = await db.query(firstsectionsql, [page_id]);

				if(firstsection.length > 0){
					res.render("Pages/data-protection/first-section.ejs", {
						title: "Data Protection",
						firstsection: firstsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}
		}else if(slug == 'imprint'){
			if(section === 'First Section'){
				const firstsectionsql = "select * from pages where id = ?";
				const firstsection = await db.query(firstsectionsql, [page_id]);

				if(firstsection.length > 0){
					res.render("Pages/imprint/first-section.ejs", {
						title: "Imprint",
						firstsection: firstsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}
		}else if(slug == 'footer'){
			if(section === 'First Section'){
				const firstsectionsql = "select * from pages where id = ?";
				const firstsection = await db.query(firstsectionsql, [page_id]);

				if(firstsection.length > 0){
					res.render("Pages/footer/first-section.ejs", {
						title: "Footer",
						firstsection: firstsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}
		}else if(slug == 'm&a-verhandlung'){
			if(section == 'First Section'){
				const firstsectionsql = "select * from pages where id = ?";
				const firstsection = await db.query(firstsectionsql, [page_id]);
				if(firstsection.length > 0){
					res.render("Pages/m&a-verhandlung/first-section.ejs", {
						title: "M&A verhandlung Page",
						firstsection: firstsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}else if(section == 'Second Section'){
				const secondsectionsql = "select * from pages where id = ?";
				const secondsection = await db.query(secondsectionsql,[page_id]);
				if(secondsection.length > 0){
					res.render("Pages/m&a-verhandlung/second-section.ejs", {
						title: "M&A verhandlung Page",
						secondsection: secondsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}else if(section == 'Third Section'){
				const thirdsectionsql = "select * from pages where id = ?";
				const thirdsection = await db.query(thirdsectionsql,[page_id]);
				if(thirdsection.length > 0){
					res.render("Pages/m&a-verhandlung/third-section.ejs", {
						title: "M&A verhandlung Page",
						thirdsection: thirdsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}else if(section == 'Fourth Section'){
				const fourthsectionsql = "select * from pages where id = ?";
				const fourthsection = await db.query(fourthsectionsql,[page_id]);
				if(fourthsection.length > 0){
					res.render("Pages/m&a-verhandlung/fourth-section.ejs", {
						title: "M&A verhandlung Page",
						fourthsection: fourthsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}
		}else if(slug == 'publication'){
			if(section == 'First Section'){
				const firstsectionsql = "select * from pages where id = ?";
				const firstsection = await db.query(firstsectionsql, [page_id]);
				if(firstsection.length > 0){
					res.render("Pages/publication/first-section.ejs", {
						title: "Publication Page",
						firstsection: firstsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}
		}
		else if(slug == 'publication-fachartikel'){
			if(section == 'First Section'){
				const firstsectionsql = "select * from pages where id = ?";
				const firstsection = await db.query(firstsectionsql, [page_id]);
				if(firstsection.length > 0){
					res.render("Pages/publication-fachartikel/first-section.ejs", {
						title: "Publication Page",
						firstsection: firstsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}
		}
		else if(slug === 'blog'){
			if(section === 'First Section'){
				const firstsectionsql = "select * from pages where id = ?";
				const firstsection = await db.query(firstsectionsql, [page_id]);

				if(firstsection.length > 0){
					res.render("Pages/blog/first-section.ejs", {
						title: "Contact page",
						firstsection: firstsection[0],
						baseUrl: baseUrl,
						message: req.flash("message"),
						error: req.flash("error"),
					});
				}else{
					req.flash("error", "Sorry. No page not found!");
					res.redirect("back");
				}
			}
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");	
	}
}
// ================================================= HOME PAGE =================================================
exports.homepageFirstSection = async (req, res) => {
	const { id, main_title, subtitle } = req.body;
	try {
		const selectsql = "select * from pages where id = ?";
		const firstsection = await db.query(selectsql, [id]);

		if(firstsection.length > 0){
			let content = null;
			if(firstsection[0].content !== null){
				content = JSON.parse(firstsection[0]?.content);
			}else{
				const simplecontentJSONParse = {
					main_title: "",
					subtitle: "",
					desktop_banner_image: "",
					mobile_banner_image: ""
				};
				
				const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
				const updateresult = await db.query(updatesql, [JSON.stringify(simplecontentJSONParse), id]);

				content = simplecontentJSONParse;
			}
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
				desktop_banner_image_path = '/uploads/pages/' + req.files.desktop_banner_image[0].filename;
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
				mobile_banner_image_path = '/uploads/pages/' + req.files.mobile_banner_image[0].filename;
			}
			const contentJSONParse = {
				main_title: main_title,
				subtitle: subtitle,
				desktop_banner_image: desktop_banner_image_path,
				mobile_banner_image: mobile_banner_image_path
			};
			const contentJSON = JSON.stringify(contentJSONParse);

			const updatesql = "UPDATE `pages` SET title=?, content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [main_title, contentJSON, id]);
			if (updateresult.affectedRows > 0) {
                req.flash("message", "Page first section has been update successfully");
                res.redirect("/admin/page/home");
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
		}else{
			req.flash("error", "Sorry. home page first section not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}
exports.homepageSecondSection = async (req, res) => {
	const { id, main_title, subtitle, content, button_label, button_link, button_link_full } = req.body;
	console.log(req.body);
	try {
		const selectsql = "select * from pages where id = ?";
		const secondsection = await db.query(selectsql, [id]);

		if(secondsection.length > 0){
			// content = JSON.parse(secondsection[0]?.content);
			const contentJSONParse = {
				main_title: main_title,
				subtitle: subtitle,
				content: content,
				button_label: button_label,
				button_link: button_link,
				button_link_full: button_link_full
			};
			const contentJSON = JSON.stringify(contentJSONParse);

			const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSON, id]);
			if (updateresult.affectedRows > 0) {
                req.flash("message", "Page second section has been update successfully");
                res.redirect("/admin/page/home");
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
		}else{
			req.flash("error", "Sorry. home page second section not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}
exports.homepageThirdSection = async (req, res) => {
	const { id, main_title } = req.body;
	try {
		const selectsql = "select * from pages where id = ?";
		const thirdsection = await db.query(selectsql, [id]);

		if(thirdsection.length > 0){
			const contentJSONParse = {
				main_title: main_title
			}
			const content = JSON.stringify(contentJSONParse);
			const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [content, id]);

			if (req.files.images) {
				if (req.files.images.length > 0) {
					otherimages = req.files.images;
					otherimages.forEach((img) => {
						var image = "/uploads/pages/" + img.filename;
						const imgsql = "INSERT INTO `page_images` SET page_id=?, image=?";
						const img_results = db.query(imgsql, [id, image]);
					});
				}
			}

			if (updateresult.affectedRows > 0) {
                req.flash("message", "Page third section has been update successfully");
                res.redirect("/admin/page/home");
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
		}else{
			req.flash("error", "Sorry. home page third section not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}
exports.homepageFourthSection = async (req, res) => {
	const { 
		id, 
		title_one, content_one, button_label_one, button_link_one, 
		title_two, content_two, button_label_two, button_link_two,
		title_three, content_three, button_label_three, button_link_three,
		title_four, content_four, button_label_four, button_link_four
	} = req.body;
	try {
		const selectsql = "select * from pages where id = ?";
		const fourthsection = await db.query(selectsql, [id]);
		if(fourthsection.length > 0){
			content = JSON.parse(fourthsection[0]?.content);
			var image_one_path = content.image_one;
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
				image_one_path = '/uploads/pages/' + req.files.image_one[0].filename;
			}
			var image_two_path = content.image_two;
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
				image_two_path = '/uploads/pages/' + req.files.image_two[0].filename;
			}
			var image_three_path = content.image_three;
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
				image_three_path = '/uploads/pages/' + req.files.image_three[0].filename;
			}
			var image_four_path = content.image_four;
			if(req.files.image_four){
				if (image_four_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						image_four_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				image_four_path = '/uploads/pages/' + req.files.image_four[0].filename;
			}

			const contentJSON = {
				title_one:title_one,
				content_one: content_one,
				button_label_one: button_label_one,
				button_link_one: button_link_one,
				title_two: title_two,
				content_two: content_two,
				button_label_two: button_label_two,
				button_link_two: button_link_two,
				title_three: title_three,
				content_three: content_three,
				button_label_three: button_label_three,
				button_link_three: button_link_three,
				title_four: title_four,
				content_four: content_four,
				button_label_four: button_label_four,
				button_link_four: button_link_four,
				image_one 	: image_one_path,
				image_two	: image_two_path,
				image_three	: image_three_path,
				image_four	: image_four_path
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
                req.flash("message", "Page fourth section has been update successfully");
                res.redirect("/admin/page/home");
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
		}else{
			req.flash("error", "Sorry. home page fourth section not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");	
	}
}
exports.homepageFifthSection = async (req, res) => {
	const { id, main_title, subtitle, portfolio_points } = req.body;
	try {
		const selectsql = "select * from pages where id = ?";
		const fivthsection = await db.query(selectsql, [id]);
		if(fivthsection.length > 0){
			const content = JSON.parse(fivthsection[0]?.content);
			var section_image_path = content?.section_image;
			if(req.files.section_image){
				if (section_image_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						section_image_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				section_image_path = '/uploads/pages/' + req.files.section_image[0].filename;
			}
			const pointJSON = JSON.stringify(portfolio_points);
			const contentJSON = {
				main_title: main_title,
				subtitle: subtitle,
				point : pointJSON,
				section_image : section_image_path
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
				req.flash("message", "Page fivth section has been update successfully");
				res.redirect("/admin/page/home");
			} else {
				req.flash("error", "Something went wrong!");
				res.redirect("back");
			}
		}else{
			req.flash("error", "Sorry. home page fivth section not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}
exports.homepageSixthSection = async (req, res) => {
	const { id, title, main_title, subtitle, content, button_label, button_link, button_link_full } = req.body;
	try {
		const selectsql = "select * from pages where id = ?";
		const sixthsection = await db.query(selectsql, [id]);

		if(sixthsection.length > 0){
			const contentJSONParse = {
				main_title: main_title,
				subtitle: subtitle,
				content: content,
				button_label: button_label,
				button_link: button_link,
				button_link_full: button_link_full
			};
			const contentJSON = JSON.stringify(contentJSONParse);

			const updatesql = "UPDATE `pages` SET title=?, content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [title, contentJSON, id]);
			if (updateresult.affectedRows > 0) {
                req.flash("message", "Page sixth section has been update successfully");
                res.redirect("/admin/page/home");
            } else {
                req.flash("error", "Something went wrong!");
                res.redirect("back");
            }
		}else{
			req.flash("error", "Sorry. home page first section not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}
// ================================================= HOME PAGE =================================================
// ================================================= SERVICE PAGE ==============================================
exports.servicepageFirstSection = async (req, res) => {
	const { id, main_title, subtitle, content } = req.body;
	try {
		const selectsql = "select * from pages where id = ?";
		const firstsection = await db.query(selectsql, [id]);
		if(firstsection.length > 0){
			const contentJSON = {
				main_title: main_title,
				subtitle: subtitle,
				content: content
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
				req.flash("message", "Page first section has been update successfully");
				res.redirect("/admin/page/service");
			} else {
				req.flash("error", "Something went wrong!");
				res.redirect("back");
			}
		}else{
			req.flash("error", "Sorry. service page first section not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}
exports.servicepageSecondSection = async (req, res) => {
	const { id, 
		title_one, link_label_one, link_one, content_one, 
		title_two, link_label_two, link_two, content_two, 
		title_three, link_label_three, link_three, content_three,
		title_four, link_label_four, link_four, content_four
	} = req.body;
	try {
		const selectsql = "select * from pages where id = ?";
		const secondsection = await db.query(selectsql, [id]);
		if(secondsection.length > 0){
			const content = JSON.parse(secondsection[0]?.content);
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
				image_one_path = '/uploads/pages/' + req.files.image_one[0].filename;
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
				image_two_path = '/uploads/pages/' + req.files.image_two[0].filename;
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
				image_three_path = '/uploads/pages/' + req.files.image_three[0].filename;
			}
			var image_four_path = content?.image_four;
			if(req.files.image_four){
				if (image_four_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						image_four_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				image_four_path = '/uploads/pages/' + req.files.image_four[0].filename;
			}

			const contentJSON = {
				title_one: title_one,
				link_label_one: link_label_one,
				link_one:link_one,
				content_one: content_one,
				image_one: image_one_path,
				title_two: title_two,
				link_label_two: link_label_two,
				link_two: link_two,
				content_two: content_two,
				image_two: image_two_path,
				title_three: title_three,
				link_label_three: link_label_three,
				link_three: link_three,
				content_three: content_three,
				image_three: image_three_path,
				title_four: title_four,
				link_label_four: link_label_four,
				link_four: link_four,
				content_four: content_four,
				image_four: image_four_path
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
				req.flash("message", "Page second section has been update successfully");
				res.redirect("/admin/page/service");
			} else {
				req.flash("error", "Something went wrong!");
				res.redirect("back");
			}
		}else{
			req.flash("error", "Sorry. service page second section not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}
exports.servicepageThirdSection = async (req, res) => {
	const { id, main_title, content_one, content_two, short_title } = req.body;
	try {
		const selectsql = "select * from pages where id = ?";
		const thirdsection = await db.query(selectsql, [id]);
		if(thirdsection.length > 0){
			const content = JSON.parse(thirdsection[0]?.content);
			var image_path = content?.image;
			if(req.files.image){
				if (image_path) {
					const oldImagePath = path.join(__dirname, "../../public/", image_path);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				image_path = '/uploads/pages/' + req.files.image[0].filename;
			}

			const contentJSON = {
				main_title: main_title,
				content_one: content_one,
				content_two: content_two,
				short_title: short_title,
				image: image_path
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
				req.flash("message", "Service page third section has been update successfully");
				res.redirect("/admin/page/service");
			} else {
				req.flash("error", "Something went wrong!");
				res.redirect("back");
			}
		}else{
			req.flash("error", "Sorry. service page third section not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}
// ================================================= SERVICE PAGE =================================================
// ================================================= ABOUT US PAGE ================================================
exports.aboutuspageFirstSection = async (req, res) => {
	const { id,title, sub_title } = req.body;
	try {
		const selectsql = "select * from pages where id = ?";
		const firstsection = await db.query(selectsql, [id]);
		if(firstsection.length > 0){
			const content = JSON.parse(firstsection[0]?.content);

			var image_path = content?.image;
				if(req.files.image){
					if (image_path) {
						const oldImagePath = path.join(__dirname, "../../public/", image_path);
						try {
							await fs.access(oldImagePath);
							await fs.unlink(oldImagePath);
						} catch (error) { }
					}
					image_path = '/uploads/pages/' + req.files.image[0].filename;
				}

			const contentJSON = {
				title: title,
				sub_title: sub_title,
				image: image_path
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
				req.flash("message", "About us page content has been update successfully");
				res.redirect("/admin/page/about-us");
			} else {
				req.flash("error", "Something went wrong!");
				res.redirect("back");
			}
		}else{
			req.flash("error", "Sorry. about us page content not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}

exports.aboutuspageSecondSection = async (req, res) => {
	const { id,title, sub_title, content_one, content_two } = req.body;
	try {
		const selectsql = "select * from pages where id = ?";
		const secondsection = await db.query(selectsql, [id]);
		if(secondsection.length > 0){
			const content = JSON.parse(secondsection[0]?.content);

			const contentJSON = {
				title: title,
				sub_title: sub_title,
				content_one: content_one,
				content_two: content_two
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
				req.flash("message", "About us page content has been update successfully");
				res.redirect("/admin/page/about-us");
			} else {
				req.flash("error", "Something went wrong!");
				res.redirect("back");
			}
		}else{
			req.flash("error", "Sorry. about us page content not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}

exports.aboutuspageThirdSection = async (req, res) => {
	const { id, main_title, portfolio_points } = req.body;
	try {
		const selectsql = "select * from pages where id = ?";
		const thirdsection = await db.query(selectsql, [id]);
		if(thirdsection.length > 0){
			const content = JSON.parse(thirdsection[0]?.content);
			// var section_image_path = content?.image;
			// if(req.files.image){
			// 	if (section_image_path) {
			// 		const oldImagePath = path.join(
			// 			__dirname,
			// 			"../../public/",
			// 			section_image_path
			// 		);
			// 		try {
			// 			await fs.access(oldImagePath);
			// 			await fs.unlink(oldImagePath);
			// 		} catch (error) { }
			// 	}
			// 	section_image_path = '/uploads/pages/' + req.files.image[0].filename;
			// }
			const pointJSON = JSON.stringify(portfolio_points);
			const contentJSON = {
				main_title: main_title,
				point : pointJSON,
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
				req.flash("message", "About Us Page third section has been update successfully");
				res.redirect("/admin/page/about-us");
			} else {
				req.flash("error", "Something went wrong!");
				res.redirect("back");
			}
		}else{
			req.flash("error", "Sorry. home page third section not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}
// ================================================= ABOUT US PAGE ================================================
// ================================================= CONTACT PAGE =================================================
exports.contactpageFirstSection = async (req, res) => {
	const { id, title, subtitle, detail, countrie_one, city_one, address_one, phone_one, email_one, countrie_two, city_two, address_two, phone_two, email_two } = req.body;
	try {
		const selectsql = "select * from pages where id = ?";
		const firstsection = await db.query(selectsql, [id]);
		// console.log("Contact Data @@ = ",firstsection);
		if(firstsection.length > 0){
			const content = JSON.parse(firstsection[0]?.content);
			var banner_image_path = content?.banner_image;
			if(req.files.banner_image){
				if (banner_image_path) {
					const oldImagePath = path.join(
						__dirname,
						"../../public/",
						banner_image_path
					);
					try {
						await fs.access(oldImagePath);
						await fs.unlink(oldImagePath);
					} catch (error) { }
				}
				banner_image_path = '/uploads/pages/' + req.files.banner_image[0].filename;
			}
			const contentJSON = {
				title: title,
				subtitle: subtitle,
				detail: detail,
				countrie_one: countrie_one,
				city_one: city_one,
				address_one: address_one,
				phone_one: phone_one,
				email_one: email_one,
				countrie_two: countrie_two,
				city_two: city_two,
				address_two: address_two,
				phone_two: phone_two,
				email_two: email_two,
				banner_image: banner_image_path
			};
			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
				req.flash("message", "Contact page content has been update successfully");
				res.redirect("/admin/page/contact");
			} else {
				req.flash("error", "Something went wrong!");
				res.redirect("back");
			}
		}else{
			req.flash("error", "Sorry. contact page content not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}
// ================================================= CONTACT PAGE =================================================
// ================================================= DATA PROTECTION PAGE =========================================
exports.dataprotectionpageFirstSection = async (req, res) => {
	const { id, title, content } = req.body;
	try {
		const contentJSON = {
			title : title,
			content: content
		}
		const contentJSONParse = JSON.stringify(contentJSON);
		const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
		const updateresult = await db.query(updatesql, [contentJSONParse, id]);
		if (updateresult.affectedRows > 0) {
			req.flash("message", "Data protection page content has been update successfully");
			res.redirect("/admin/page/data-protection");
		} else {
			req.flash("error", "Something went wrong!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}
// ================================================= DATA PROTECTION PAGE =========================================
// ================================================= IMORINT PAGE =================================================
exports.imprintpageFirstSection = async (req, res) => {
	const { id, title, content } = req.body;
	try {
		const contentJSON = {
			title : title,
			content: content
		}
		const contentJSONParse = JSON.stringify(contentJSON);
		const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
		const updateresult = await db.query(updatesql, [contentJSONParse, id]);
		if (updateresult.affectedRows > 0) {
			req.flash("message", "Imprint page content has been update successfully");
			res.redirect("/admin/page/imprint");
		} else {
			req.flash("error", "Something went wrong!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}
// ================================================= IMORINT PAGE =================================================
exports.deleteImage = async (req, res) => {
    var id = req.params.id;
    try {
		const sql = 'SELECT * FROM `page_images` WHERE id = ?';
		const pageimage = await db.query(sql, [id]);
		console.log(pageimage);
		if(pageimage.length > 0){
			var image = pageimage[0].image;
			if (image) {
				const oldImagePath = path.join(__dirname, '../../public/', image);
				try {
					await fs.access(oldImagePath);
					await fs.unlink(oldImagePath);
				} catch (err) {
					console.error('Error deleting old image:', err);
				}
			}
			const sql = "DELETE FROM `page_images` WHERE id=?";
			const results = await db.query(sql, [id]);

			if (results.affectedRows > 0) {
				req.flash("message", "Image has been deleted succesfully.");
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
		req.flash("error", "Oops! Could not delete image.");
		res.redirect("back");
    }
}

// ============================================ Manage page meta tags ===========================================

exports.managePageMetaTag = async (req, res) => {
    var page_id = req.params.id;
	
	try {
		const metatagssql = "select * from page_lists where id = ?";
		const metaTags = await db.query(metatagssql, [page_id]);
		if(metaTags.length > 0){
			res.render("Pages/meta-tags.ejs", {
				title: "Home Page",
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
	const { id, metatitle, metakeywords, metadescription } = req.body;
	try {
		const selectsql = "select * from page_lists where id = ?";
		const metTags = await db.query(selectsql, [id]);
		console.log("Meta Tags @@ =",metTags,id,metatitle,metakeywords,metadescription);
		if(metTags.length > 0){
			const updatesql = "UPDATE `page_lists` SET metatitle=?, metakeywords=?, metadescription=? WHERE id=?";
			const updateresult = await db.query(updatesql, [metatitle, metakeywords, metadescription, id]);
			if (updateresult.affectedRows > 0) {
                req.flash("message", "Page meta tags has been update successfully");
                res.redirect("/admin/pages");
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

// 29-03-2025
exports.footerpageFirstSection = async (req, res) => {
    try {

        const { id, main_title, content, button_label, button_link, button_link_full } = req.body;

        if (!id) {
            req.flash("error", "Invalid page ID.");
            return res.redirect("back");
        }
		
        const selectsql = "SELECT * FROM pages WHERE id = ?";
        const firstsection = await db.query(selectsql, [id]);

        if (firstsection.length === 0) {
            req.flash("error", "Sorry, home page first section not found!");
            return res.redirect("back");
        }

        let existingContent = {};
        if (firstsection[0].content) {
            try {
                existingContent = JSON.parse(firstsection[0].content);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                existingContent = {};
            }
        }

        // Handle file upload
        let footer_image_path = existingContent.footer_image || "";
        if (req.files && req.files.footer_image) {
            // Remove old image if exists
            if (footer_image_path) {
                const oldImagePath = path.join(__dirname, "../../public/", footer_image_path);
                try {
                    await fs.access(oldImagePath);
                    await fs.unlink(oldImagePath);
                } catch (error) {
                    console.error("Error deleting old image:", error);
                }
            }
            footer_image_path = "/uploads/pages/" + req.files.footer_image[0].filename;
        }

        // Prepare updated content
        const updatedContent = {
            main_title: main_title || "",
            content: content || "",
            footer_image: footer_image_path,
            button_label: button_label || "",
            button_link: button_link || "",
            button_link_full: button_link_full || "no",
        };

        const contentJSON = JSON.stringify(updatedContent);

        // Update the database
        const updatesql = "UPDATE `pages` SET title=?, content=? WHERE id=?";
        const updateresult = await db.query(updatesql, [main_title, contentJSON, id]);

        if (updateresult.affectedRows > 0) {
            req.flash("message", "Page first section has been updated successfully");
            res.redirect("/admin/page/footer");
        } else {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        }
    } catch (error) {
        console.error("ERROR:", error);
        req.flash("error", "An unexpected error occurred.");
        res.redirect("back");
    }
};

// 01-04-2025
exports.publicationpageFirstSection = async (req, res) => {
    try {

        const { id, main_title, first_heading, first_content, second_heading, second_content } = req.body;
		console.log("Publication Page Request @@ = ",req.body);
        if (!id) {
            req.flash("error", "Invalid page ID.");
            return res.redirect("back");
        }
		
        const selectsql = "SELECT * FROM pages WHERE id = ?";
        const firstsection = await db.query(selectsql, [id]);

        if (firstsection.length === 0) {
            req.flash("error", "Sorry, home page first section not found!");
            return res.redirect("back");
        }

        let existingContent = {};
        if (firstsection[0].content) {
            try {
                existingContent = JSON.parse(firstsection[0].content);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                existingContent = {};
            }
        }
		// Handle file upload
        let image_path = existingContent.image || "";
        if (req.files && req.files.image) {
            // Remove old image if exists
            if (image_path) {
                const oldImagePath = path.join(__dirname, "../../public/", image_path);
                try {
                    await fs.access(oldImagePath);
                    await fs.unlink(oldImagePath);
                } catch (error) {
                    console.error("Error deleting old image:", error);
                }
            }
            image_path = "/uploads/pages/" + req.files.image[0].filename;
        }
        const updatedContent = {
            main_title: main_title || "",
			image_path: image_path || "",
            first_heading: first_heading || "",
            first_content: first_content,
            second_heading: second_heading || "",
            second_content: second_content || "",
        };

        const contentJSON = JSON.stringify(updatedContent);

        // Update the database
        const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
        const updateresult = await db.query(updatesql, [contentJSON, id]);

        if (updateresult.affectedRows > 0) {
            req.flash("message", "Page first section has been updated successfully");
            res.redirect("/admin/page/publication");
        } else {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        }
    } catch (error) {
        console.error("ERROR:", error);
        req.flash("error", "An unexpected error occurred.");
        res.redirect("back");
    }
};

exports.publicationfachartikelpageFirstSection = async (req, res) => {
    try {

        const { id, main_title, first_heading, first_content, second_heading, second_content } = req.body;
		// console.log("Publication Page Request @@ = ",req.body);
        if (!id) {
            req.flash("error", "Invalid page ID.");
            return res.redirect("back");
        }
		
        const selectsql = "SELECT * FROM pages WHERE id = ?";
        const firstsection = await db.query(selectsql, [id]);

        if (firstsection.length === 0) {
            req.flash("error", "Sorry, home page first section not found!");
            return res.redirect("back");
        }

        let existingContent = {};
        if (firstsection[0].content) {
            try {
                existingContent = JSON.parse(firstsection[0].content);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                existingContent = {};
            }
        }
        const updatedContent = {
            main_title: main_title || "",
            first_heading: first_heading || "",
            first_content: first_content,
            second_heading: second_heading || "",
            second_content: second_content || "",
        };

        const contentJSON = JSON.stringify(updatedContent);

        // Update the database
        const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
        const updateresult = await db.query(updatesql, [contentJSON, id]);

        if (updateresult.affectedRows > 0) {
            req.flash("message", "Page first section has been updated successfully");
            res.redirect("/admin/page/publication-fachartikel");
        } else {
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        }
    } catch (error) {
        console.error("ERROR:", error);
        req.flash("error", "An unexpected error occurred.");
        res.redirect("back");
    }
};

// 03-04-2025
exports.blogpageFirstSection = async (req, res) => {
	const { id,title } = req.body;
	try {
		const selectsql = "select * from pages where id = ?";
		const firstsection = await db.query(selectsql, [id]);
		if(firstsection.length > 0){
			const content = JSON.parse(firstsection[0]?.content);

			var image_path = content?.banner_image;
				if(req.files.banner_image){
					if (image_path) {
						const oldImagePath = path.join(__dirname, "../../public/", image_path);
						try {
							await fs.access(oldImagePath);
							await fs.unlink(oldImagePath);
						} catch (error) { }
					}
					image_path = '/uploads/pages/' + req.files.banner_image[0].filename;
				}

			const contentJSON = {
				title: title,
				banner_image: image_path
			};

			const contentJSONParse = JSON.stringify(contentJSON);
			const updatesql = "UPDATE `pages` SET content=? WHERE id=?";
			const updateresult = await db.query(updatesql, [contentJSONParse, id]);
			if (updateresult.affectedRows > 0) {
				req.flash("message", "Blog page content has been update successfully");
				res.redirect("/admin/page/blog");
			} else {
				req.flash("error", "Something went wrong!");
				res.redirect("back");
			}
		}else{
			req.flash("error", "Sorry. about us page content not found!");
			res.redirect("back");
		}
	} catch (error) {
		console.log("ERROR : ", error);
		res.redirect("back");
	}
}