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
                output['sixth_section'] = contentJSON;
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