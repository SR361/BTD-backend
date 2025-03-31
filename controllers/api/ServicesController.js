const db = require('../../database/db');
const crypto = require('../../services/crypto');
const transporter = require('../../services/mailer');
const axios = require('axios');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const baseUrl = process.env.BASEURL;

exports.getAllServices = async (req, res) => {
    try {
        const servicesql = "select * from services";
        const services = await db.query(servicesql);
        const servicesData = [];
        for (const [index, item] of services.entries()) {
            const singleservice = {};
            const metacontent = {
                metatitle : item.metatitle,
                metakeywords: item.metakeywords,
                metadescription: item.metadescription
            }
            
            const serviceimagsql = "select image from service_images where service_id = ?";
            const serviceimages = await db.query(serviceimagsql,[item.id]);

            singleservice['metacontent'] = metacontent;
            singleservice['images'] = serviceimages;
            singleservice['title'] = item.title;

            const firstsection = JSON.parse(item.first_section);
            const secondsection = JSON.parse(item.second_section);
            const thirdsection = JSON.parse(item.third_section);
            const fourthsection = JSON.parse(item.fourth_section);
            const fifthsection = JSON.parse(item.fivth_section);
            const sixthsection = JSON.parse(item.sixth_section);
            const seventhsection = JSON.parse(item.seventh_section);
            const eighthsection = JSON.parse(item.eighth_section);            

            singleservice['first_section'] = firstsection;
            singleservice['second_section'] = secondsection;
            singleservice['third_section'] = thirdsection;
            singleservice['fourth_section'] = fourthsection;
            singleservice['fifth_section'] = fifthsection;
            singleservice['sixth_section'] = sixthsection;
            singleservice['seventh_section'] = seventhsection;
            singleservice['eighth_section'] = eighthsection;
            servicesData.push(singleservice);
        }

        if(services.length > 0){
            res.status(200).send({ status : true, result : servicesData, message : "" });
        }else{
            res.status(200).send({ status : false, result : "", message : "Sorry! service don't not exits record." });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors:"Error: "+error, errorData:error });
    }
}