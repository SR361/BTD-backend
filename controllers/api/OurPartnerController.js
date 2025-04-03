const db = require('../../database/db');
require("dotenv").config();

exports.getOurPartners = async (req, res) => {
    try {
        const ourpartnersql = "select image,name,position,description from our_partners";
        const ourpartners = await db.query(ourpartnersql);

        if(ourpartners.length > 0){
            res.status(200).send({ status : true, result : ourpartners, message : "" });
        }else{
            res.status(200).send({ status : false, result : "", message : "Sorry! our partners don't not exits record." });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors:"Error: "+error, errorData:error });
    }
}
