const db = require('../../database/db');
require("dotenv").config();

exports.getTestimonial = async (req, res) => {
    try {
        const testimonialsql = "select image,name,company,position,testimonial,content from testimonials";
        const testimonials = await db.query(testimonialsql);

        if(testimonials.length > 0){
            res.status(200).send({ status : true, result : testimonials, message : "" });
        }else{
            res.status(200).send({ status : false, result : "", message : "Sorry! testimonials don't not exits record." });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors:"Error: "+error, errorData:error });
    }
}
