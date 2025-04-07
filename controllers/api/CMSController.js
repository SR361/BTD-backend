const db = require('../../database/db');
const crypto = require('../../services/crypto');
const transporter = require('../../services/mailer');
const axios = require('axios');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const baseUrl = process.env.BASEURL;

exports.homePageContent = async (req, res) => {
    try {
        const sql = "select * from pages where page = ?";
        const content = await db.query(sql,['home']);
        const output = {};
        for (const [index, item] of content.entries()) {
            const metasql = "select metatitle,metakeywords,metadescription from page_lists where page_name = ?";
            const metacontent = await db.query(metasql, 'Home Page')
            output['metacontent'] = metacontent[0];

            if(item.section == 'First Section'){
                const contentJSON = JSON.parse(item.content);
                output['first_section'] = contentJSON;
            }else if(item.section == 'Second Section'){
                const contentJSON = JSON.parse(item.content);
                output['second_section'] = contentJSON;
            }else if(item.section == 'Third Section'){
                const contentJSON = JSON.parse(item.content);
                const imagesql = "select image from page_images where page_id = ?";
                const pageimages = await db.query(imagesql, [item.id]);
                const imageUrls = pageimages.map(imgitem => imgitem.image);
                const thirdsectiondata = {
                    main_title : contentJSON?.main_title,
                    images  : imageUrls
                };
                output['third_section'] = thirdsectiondata;
            }else if(item.section == 'Fourth Section'){
                const contentJSON = JSON.parse(item.content);
                output['fourth_section'] = contentJSON;
            }else if(item.section == 'Fifth Section'){
                const contentJSON = JSON.parse(item.content);
                const portfolio = {
                    main_title: contentJSON.main_title,
                    subtitle: contentJSON.subtitle,
                    point: JSON.parse(contentJSON.point)
                };
                output['fivth_section'] = portfolio;
            }else if(item.section == 'Sixth Section'){
                const contentJSON = JSON.parse(item.content);
                const sql = "select name, position, company, testimonial, image from testimonials";
                const testimonials = await db.query(sql);
                const data = {
                    title: item.title,
                    content: contentJSON,
                    testimonial: testimonials
                }
                output['sixth_section'] = data;
            }
        }
        if(content.length > 0){
            res.status(200).send({ status : true, result : { content : output }, message : "" });
        }else{
            res.status(200).send({ status : false, result : "", message : "Homep page content not exits" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, result: "", errors:error });
    }
}

exports.footerPageContent = async (req, res) => {
    try {
        const output = {};
        const pageContentSql = "SELECT title,content FROM `pages` where slug = 'footer' and section = 'First Section'";
        const pageContent = await db.query(pageContentSql);
        const contentJSON = JSON.parse(pageContent[0].content);
        output['first_section'] = contentJSON; 
        // console.log("Contact Data @@ = ",output);
        res.status(200).send({ 
            status: true, 
            result:  { content : output },
            errors: "" 
          });
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors:error });
    }
}

exports.aboutUsPageContent = async (req, res) => {
    try {
        const sql = "select * from pages where page = ?";
        const content = await db.query(sql,['About Us']);
        const output = {};
        for (const [index, item] of content.entries()) {
            const metasql = "select metatitle,metakeywords,metadescription from page_lists where slug = ?";
            const metacontent = await db.query(metasql, 'about-us')
            output['metacontent'] = metacontent[0];

            if(item.section == 'First Section'){
                const contentJSON = JSON.parse(item.content);
                output['first_section'] = contentJSON;
            }else if(item.section == 'Second Section'){
                const contentJSON = JSON.parse(item.content);
                output['second_section'] = contentJSON;
            }else if(item.section == 'Third Section'){
                const contentJSON = JSON.parse(item.content);
                
                output['third_section'] = contentJSON;
            }
        }
        if(content.length > 0){
            res.status(200).send({ status : true, result : { content : output }, message : "" });
        }else{
            res.status(200).send({ status : false, result : "", message : "Homep page content not exits" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, result: "", errors:error });
    }
}

exports.getBlogContent = async (req, res) => {
    try {
        const output = {};
        const pageContentSql = "SELECT title,content FROM `pages` where slug = 'blog' and section = 'First Section'";
        const pageContent = await db.query(pageContentSql);
        const contentJSON = JSON.parse(pageContent[0].content);
        output['first_section'] = contentJSON;
        const metasql = "select metatitle,metakeywords,metadescription from page_lists where slug = ?";
        const metacontent = await db.query(metasql, 'blog');
        output['metacontent'] = metacontent[0];
        // console.log("Contact Data @@ = ",output);
        res.status(200).send({ 
            status: true, 
            result:  { content : output },
            errors: "" 
          });
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors:error });
    }
}

exports.getPublicationContent = async (req, res) => {
    try {
        const pageConfigs = [
            { page: 'Publication Whitepaper', slug: 'publication' },
            { page: 'Publication Fachartikel', slug: 'publication-fachartikel' },
            { page: 'Publication Pressemitteilungen', slug: 'publication-pressemitteilungen' }
        ];

        const output = {};
        const metaSql = "SELECT metatitle, metakeywords, metadescription FROM page_lists WHERE slug = ?";
        const metaContent = await db.query(metaSql, ['publication']);
        for (const config of pageConfigs) {
            const contentSql = "SELECT * FROM pages WHERE page = ?";
            const content = await db.query(contentSql, [config.page]);

            

            // Default structure
            output[config.slug] = {
                metacontent: metaContent[0] || {},
                first_section: null
            };

            for (const item of content) {
                if (item.section === 'First Section') {
                    output[config.slug].first_section = JSON.parse(item.content);
                }
            }
        }

        res.status(200).send({ status: true, result: { content: output }, message: "" });

    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, result: "", errors: error });
    }
};
