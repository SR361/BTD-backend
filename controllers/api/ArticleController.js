const db = require('../../database/db');
require("dotenv").config();

exports.getArticles = async (req, res) => {
    var slug = req.params.slug;
    try {
        const ourpartnersql = "select category,title,slug,image,description,created_at from articles where category=?";
        const ourpartners = await db.query(ourpartnersql,[slug]);

        if(ourpartners.length > 0){
            res.status(200).send({ status : true, result : ourpartners, message : "" });
        }else{
            res.status(200).send({ status : false, result : "", message : "Sorry! our partners don't not exits record." });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors:"Error: "+error, errorData:error });
    }
}
