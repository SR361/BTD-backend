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

        if(content.length > 0){
            res.status(200).send({ status : true, result : { content : content[0] }, message : "" });
        }else{
            res.status(200).send({ status : false, result : "", message : "Privacy plicy page content not exits" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, result: "", errors:error });
    }
}