const db = require('../../database/db');
require("dotenv").config();
const path = require('path');
const fs = require('fs/promises');
const { title } = require('process');
const baseUrl = process.env.BASEURL;

// exports.content = async (req, res) => {
//     try {
//         const firstSql = "SELECT title,sub_categorie,child_sub_categories FROM `pages` where slug = 'streetwear-collection' and section = 'First Section'";
//         const firstSectionContent = await db.query(firstSql);
//         const first_section = {};
//         first_section['title'] = firstSectionContent[0].title;

//         const contentSubCategorie = JSON.parse(firstSectionContent[0].sub_categorie);
//         const allFirstSectionCategories = [];
//         if(contentSubCategorie.sub_categorie != undefined){
//             const subCategoriesSql = "SELECT name FROM `sub_categories` WHERE id IN (?)";
//             const sub_categories = await db.query(subCategoriesSql,[JSON.parse(contentSubCategorie.sub_categorie)]);
            
//             sub_categories.forEach(sub_categorie => {
//                 allFirstSectionCategories.push(sub_categorie.name)
//             });
//         }
        

//         const contentChilSubCategorie = JSON.parse(firstSectionContent[0].child_sub_categories);
//         if(contentChilSubCategorie.child_sub_categories != undefined){
//             const childSubCategorieSql = "SELECT name FROM `child_sub_categories` WHERE id IN (?)";
//             const child_sub_categories = await db.query(childSubCategorieSql,[JSON.parse(contentChilSubCategorie.child_sub_categories)]);
//             child_sub_categories.forEach(child_sub_categorie => {
//                 allFirstSectionCategories.push(child_sub_categorie.name)
//             });
//         }
//         first_section['categories'] = allFirstSectionCategories;
//         /*----------------------------------------------------------------------------------------------------------------------------------------------*/

//         const secondSql = "select title from pages where slug = 'streetwear-collection' and section = 'Second Section'";
//         const secondSectionContent = await db.query(secondSql);

//         const thirdSectionSql = "SELECT content, first_image, second_image, third_image FROM `pages` WHERE slug='streetwear-collection' AND section='Third Section'";
//         const thirdSection = await db.query(thirdSectionSql);
//         const thirdSectionData = {};
//         thirdSectionData['first_image'] = thirdSection[0].first_image;
//         thirdSectionData['second_image'] = thirdSection[0].second_image;
//         thirdSectionData['third_image'] = thirdSection[0].third_image;
//         const thirdSectionContent = JSON.parse(thirdSection[0].content);
//         thirdSectionData['first_title'] = thirdSectionContent.first_title;
//         thirdSectionData['second_title'] = thirdSectionContent.second_title;
//         thirdSectionData['third_title'] = thirdSectionContent.third_title;
        
//         const allCategories = {};
//         if(thirdSectionContent.sub_categorie != undefined){
//             const subCategoriesSql = "SELECT name,slug FROM `sub_categories` WHERE id IN (?)";
//             const sub_categories = await db.query(subCategoriesSql,[JSON.parse(thirdSectionContent.sub_categorie)]);
//             allCategories['sub_categories'] = sub_categories;
//             // sub_categories.forEach(sub_categorie => {
//             //     allCategories.push(sub_categorie.name)
//             // });
//         }
//         if(thirdSectionContent.child_sub_categories != undefined){
//             const childSubCategorieSql = "SELECT sub_cat_id,csc.name as csc_name,csc.slug as csc_slug, sc.name as sc_name, sc.slug as sc_slug FROM `child_sub_categories` csc left join sub_categories as sc on csc.sub_cat_id = sc.id WHERE csc.id IN (?)";
//             const child_sub_categories = await db.query(childSubCategorieSql,[JSON.parse(thirdSectionContent.child_sub_categories)]);
//             allCategories['child_sub_categories'] = child_sub_categories;
//             // child_sub_categories.forEach(child_sub_categorie => {
//             //     allCategories.push(child_sub_categorie.name)
//             // });
//         }
//         thirdSectionData['categories'] = allCategories;
//         res.status(200).send({ 
//             status: true, 
//             result: {
//                 first_section : first_section,
//                 second_section : secondSectionContent[0],
//                 third_section : thirdSectionData
//             }, 
//             errors: "" 
//           });
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ status: false, result: "", errors:error });
//     }
// }

exports.privacyPolicyContent = async (req, res) => {
    try {
        const sql = "select title,content from pages where slug = 'privacy-policy' and section = 'First Section'";
        const content = await db.query(sql);

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

exports.storePolicyContent = async (req, res) => {
    try {
        const sql = "select first_image,title,content from pages where slug = 'online-store-policy' and section = 'First Section'";
        const content = await db.query(sql);

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

exports.returnPolicyContent = async (req, res) => {
    try {
        const sql = "select first_image,title,content from pages where slug = 'return-policy' and section = 'First Section'";
        const content = await db.query(sql);

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

exports.termAndConditionContent = async (req, res) => {
    try {
        const sql = "select first_image,title,content from pages where slug = 'terms-and-condition' and section = 'First Section'";
        const content = await db.query(sql);

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

exports.apiWishlistContent = async(req, res) => {
    try {
        const sql = "select first_image,title,sub_title,sub_categorie,child_sub_categories from `pages` where slug = 'wishlist' and section = 'First Section'";
        const pagecontent = await db.query(sql);
        const allCategories = {};
        
        const subCategoriesID = JSON.parse(pagecontent[0].sub_categorie)
        if(subCategoriesID.sub_categorie !== undefined){
            const subCategoriesSql = "SELECT name,slug FROM `sub_categories` WHERE id IN (?)";
            const sub_categories = await db.query(subCategoriesSql,[JSON.parse(subCategoriesID.sub_categorie)]);
            allCategories['sub_categories'] = sub_categories;
        }
        const childSubCategoriesID = JSON.parse(pagecontent[0].child_sub_categories)
        
        if(childSubCategoriesID.child_sub_categories !== undefined){
            const childSubCategorieSql = "SELECT sub_cat_id,csc.name as csc_name,csc.slug as csc_slug, sc.name as sc_name, sc.slug as sc_slug FROM `child_sub_categories` csc left join sub_categories as sc on csc.sub_cat_id = sc.id WHERE csc.id IN (?)";
            const child_sub_categories = await db.query(childSubCategorieSql,[JSON.parse(childSubCategoriesID.child_sub_categories)]);
            allCategories['child_sub_categories'] = child_sub_categories;
        }
        
        res.status(200).send({
            status: true,
            result: {
                pagecontent : pagecontent[0],
                categories : allCategories
            },
            errors: "",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: false,
            result: "",
            errors: " Error: " + error,
            errorData: error,
        });
    }
}

exports.apiContactUsPageContent = async(req,res) => {
    try {
        const sql = "select * from pages where slug = 'contact-us' and section = 'First Section'";
        const contactUs = await db.query(sql);
        if(contactUs.length > 0){
            const contentJsonParse = JSON.parse(contactUs[0].content);
            const content = {
                title : contactUs[0].title,
                first_image : contactUs[0].first_image,
                monday_friday_time : contentJsonParse.monday_friday_time,
                saturday_time : contentJsonParse.saturday_time,
                sunday_time : contentJsonParse.sunday_time,
                phone : contentJsonParse.phone,
                email : contentJsonParse.email,
                content_1 : contentJsonParse.content_1,
                content_2 : contentJsonParse.content_2,
            }
            res.status(200).send({ status : true, result : { content : content } });
        }else{
            res.status(200).send({ status  : false, message : "Page content not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: false,
            result: "",
            errors: " Error: " + error,
            errorData: error,
        });
    }
}

exports.apiCustomerFormSave = async(req,res) => {
    const { topic, first_name, last_name, address, no, street, additional_address, postcode, country_id, city_id, phone, email, message, order_number } = req.body;
    try {
        const sql = "insert into customer_queries set topic=?, first_name=?, last_name=?, address=?, no=?, street=?, additional_address=?, postcode=?, country_id=?, city_id=?,  phone=?, email=?, message=?, order_number=? ";
        const result = await db.query(sql, [topic, first_name, last_name, address, no, street, additional_address, postcode, country_id, city_id, phone, email, message, order_number]);

        if (result.insertId > 0) {
            res.status(200).send({ status : true, message : "Form submit successfully" });
        }else{
            res.status(200).send({ status : false, message : "Sorry! something wrong" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: false,
            result: "",
            errors: " Error: " + error,
            errorData: error,
        });
    }
}

exports.apiBusinessFormSave = async (req, res) => {
    const { topic, partnership_inquiry_type, first_name, last_name, email, phone, company_name, job_title, address, no, street, additional_address, country_id,  city_id, postcode, message } = req.body;
    const contact_persion_name = `${first_name} ${last_name}`;
    try {
        const sql = "insert into business_contact_queries set topic=?, partnership_inquiry_type=?, contact_persion_name=?, email=?, phone=?, company_name=?, job_title=?, address=?, no=?, street=?, additional_address=?, country_id=?, city_id=?, postcode=?, message=?";
        const result = await db.query(sql, [topic, partnership_inquiry_type, contact_persion_name, email, phone, company_name, job_title, address, no, street, additional_address, country_id, city_id, postcode, message]);

        if (result.insertId > 0) {
            res.status(200).send({ status : true, message : "Form submit successfully" });
        }else{
            res.status(200).send({ status : false, message : "Sorry! something wrong" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: false,
            result: "",
            errors: " Error: " + error,
            errorData: error,
        });
    }
}