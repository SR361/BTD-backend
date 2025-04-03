const db = require('../../database/db');
require("dotenv").config();

exports.getArchives = async (req, res) => {
    try {
        const archivesql = "select title,slug,image,description from archives";
        const archives = await db.query(archivesql);

        if(archives.length > 0){
            res.status(200).send({ status : true, result : archives, message : "" });
        }else{
            res.status(200).send({ status : false, result : "", message : "Sorry! our archives don't not exits record." });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors:"Error: "+error, errorData:error });
    }
}
