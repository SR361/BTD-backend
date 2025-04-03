const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const baseUrl = process.env.BASEURL;
const FRONTEND_URL = process.env.FRONTEND_URL;

exports.getContactContent = async (req, res) => {
    try {
        const output = {};
        const pageContentSql = "SELECT title,content FROM `pages` where slug = 'contact' and section = 'First Section'";
        const pageContent = await db.query(pageContentSql);
        const contentJSON = JSON.parse(pageContent[0].content);
        output['first_section'] = contentJSON;
        const metasql = "select metatitle,metakeywords,metadescription from page_lists where slug = ?";
        const metacontent = await db.query(metasql, 'contact');
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