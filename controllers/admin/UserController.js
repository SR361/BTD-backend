const db = require("../../database/db");
const crypto = require("../../services/crypto");
const { createObjectCsvWriter } = require("csv-writer");
require("dotenv").config();
const path = require("path");
const fs = require("fs/promises");
const baseUrl = process.env.BASEURL;

exports.getAllUsers = async (req, res) => {
    var page = req.query.page || 1;
    var search = req.query.search || "";
    var perPage = 20;
    var offset = (page - 1) * perPage;

    try {
        var con = "";
        if (search != "" && search != null) {
            con = `WHERE first_name LIKE '%${search.trim()}%' OR last_name LIKE '%${search.trim()}%' OR email LIKE '%${search.trim()}%' OR phone LIKE '%${search.trim()}%'`;
        }

        const sqlCount = `SELECT COUNT(*) AS totalUsers FROM users ${con} `;
        const [countRows] = await db.query(sqlCount);
        const totalUsers = countRows.totalUsers;

        //check the email id  is exists in user table or not
        const sql = `SELECT * FROM users ${con} ORDER BY id DESC LIMIT ? OFFSET ?`;
        const users = await db.query(sql, [perPage, offset]);

        res.render("Users/index", {
            title: "Users",
            users: users,
            baseUrl: baseUrl,
            paginationUrl: "users",
            currentPage: page,
            search: search,
            totalPages: Math.ceil(totalUsers / perPage),
            message: req.flash("message"),
            error: req.flash("error"),
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.redirect("back");
    }
};

exports.addUser = async (req, res) => {
    res.render("Users/add", {
        title: "Add User",
        message: req.flash("message"),
        error: req.flash("error"),
    });
};

exports.insertUser = async (req, res) => {
    const {
        first_name,
        last_name,
        email,
        phone,
        address
    } = req.body;
    const hashedPassword = crypto.encrypt(req.body.password);
    const status = 1;

    try {
        //check the email id  is exists in user table or not
        const sql = "SELECT * FROM `users` WHERE email=?";
        const user = await db.query(sql, [email]);
        const checkPhoneSql = "select * from users where  phone = ?";
        const chechPhone = await db.query(checkPhoneSql, [phone]);
        if(chechPhone.length > 0){
            req.flash("error", "Sorry! Phone number already taken");
            res.redirect("back");
            return;
        }

        if (user.length === 0) {
            // insert data from the user table
            
            const sql = "INSERT INTO `users` SET first_name=?, last_name=?, email=?, password=?, phone=?, address=?, status='?'";
            const results = await db.query(sql, [first_name, last_name, email, hashedPassword, phone, address,status ]);

            if (results.insertId > 0) {
                console.log("User inserted:", results.insertId);
                req.flash("message", "User registered successfully");
                res.redirect("/admin/users");
            } else {
                req.flash("error", "Error fetching data:", error);
                res.redirect("back");
            }
        } else {
            req.flash("error", "Sorry. This email is already exists!");
            res.redirect("back");
        }
    } catch (error) {
        req.flash("error", "Error fetching data:", error);
        console.log("Error fetching data:", error);
        res.redirect("back");
    }
};

exports.editUser = async (req, res) => {
    var user_id = req.params.id;

    try {
        //check the email id  is exists in user table or not
        const sql = "SELECT * FROM `users` WHERE id = ?";
        const user = await db.query(sql, [user_id]);
        if (user.length > 0) {
            res.render("Users/edit", {
                title: "Edit User",
                user: user[0],
                baseUrl: baseUrl,
                message: req.flash("message"),
                error: req.flash("error"),
            });
        } else {
            req.flash("error", "Sorry. No user records exists!");
            res.redirect("/admin/users");
        }
    } catch (error) {
        console.log("Error fetching data:", error);
        res.redirect("back");
    }
};

exports.updateUser = async (req, res) => {
    console.log(req.body);
    const {id, first_name, last_name, email, phone, address} = req.body;

    try {
        //check the email id  is exists in user table or not
        const sql = "SELECT * FROM `users` WHERE id = ?";
        const user = await db.query(sql, [id]);

        const checkEmailSql = "select * from users where id != and email = ?";
        const checkEmail = await db.query(checkEmailSql[id, email]);
        if(checkEmail.length > 0){
            req.flash("error", "Sorry! Email id already taken");
            res.redirect("back");
            return;
        }

        const checkPhoneSql = "select * from users where id != ? and phone = ?";
        const chechPhone = await db.query(checkPhoneSql, [id,phone]);
        if(chechPhone.length > 0){
            req.flash("error", "Sorry! Phone number already taken");
            res.redirect("back");
            return;
        }

        if (user.length > 0) {
            const sql ="UPDATE `users` SET first_name=?, last_name=?, email=?, phone=?, address=? WHERE id=?";
            const edit_results = await db.query(sql, [first_name, last_name, email, phone, address, id]);

            if (edit_results.affectedRows > 0) {
                console.log("User affected:", edit_results.affectedRows);
                req.flash("message", "User has been updated successfully");
                res.redirect("back");
            } else {
                console.log(edit_results);
                req.flash("error", "User record has not updated");
                res.redirect("back");
            }
        } else {
            req.flash(
                "error",
                "Sorry. Cannot updated with id ${id}. Maybe id is wrong"
            );
            res.redirect("back");
        }
    } catch (error) {
        req.flash("error", "Error fetching data:", error);
        console.log("Error fetching data:", error);
        res.redirect("back");
    }
};

exports.deleteUser = async (req, res) => {
    var id = req.params.id;

    try {
        //check the email id  is exists in user table or not
        const sql = "SELECT * FROM `users` WHERE id = ?";
        const user = await db.query(sql, [id]);
        if (user.length > 0) {
            var profile_img = user[0].profile_img;
            var banner_img = user[0].banner;

            // Delete the old profile image
            if (profile_img) {
                const oldProfileImagePath = path.join(
                    __dirname,
                    "../../public/",
                    profile_img
                );
                try {
                    await fs.access(oldProfileImagePath); // Check if the file exists
                    await fs.unlink(oldProfileImagePath); // Delete the file
                } catch (err) {
                    console.error("Error deleting old image:", err);
                }
            }

            // Delete the old banner image
            if (banner_img) {
                const oldBannerImagePath = path.join(
                    __dirname,
                    "../../public/",
                    banner_img
                );
                try {
                    await fs.access(oldBannerImagePath); // Check if the file exists
                    await fs.unlink(oldBannerImagePath); // Delete the file
                } catch (err) {
                    console.error("Error deleting old image:", err);
                }
            }

            // Delete data from the user table
            const sql = "DELETE FROM `users` WHERE id=?";
            const edit_results = await db.query(sql, [id]);

            if (edit_results.affectedRows > 0) {
                req.flash("message", "User has been deleted succesfully.");
                res.redirect("back");
            } else {
                req.flash("error", `Sorry! Could not delete with id ${id}.`);
                res.redirect("back");
            }
        } else {
            req.flash(
                "error",
                `Sorry! Could not delete with id ${id}. Maybe id is wrong`
            );
            res.redirect("back");
        }
    } catch (error) {
        console.log("Error fetching data:", error);
        req.flash("error", "Oops! Could not delete user.");
        res.redirect("back");
    }
};

exports.statusUser = async (req, res) => {
    var id = req.params.id;
    var status = req.params.status;

    try {
        //check the email id  is exists in user table or not
        const sql = "SELECT * FROM `users` WHERE id = ?";
        const user = await db.query(sql, [id]);
        if (user.length > 0) {
            // update status in the user table
            const sql = "UPDATE `users` SET status=?  WHERE id=?";
            const status_results = await db.query(sql, [status, id]);

            if (status_results.affectedRows > 0) {
                req.flash("message", "User status has been updated succesfully.");
                res.redirect("back");
            } else {
                req.flash("error", `Sorry! Could not update status with id ${id}.`);
                res.redirect("back");
            }
        } else {
            req.flash(
                "error",
                `Sorry! Could not update status with id ${id}. Maybe id is wrong`
            );
            res.redirect("back");
        }
    } catch (error) {
        console.log("Error fetching data:", error);
        req.flash("error", "Oops! Could not could update status.");
        res.redirect("back");
    }
};
exports.pendingUser = async (req, res) => {
    var id = req.params.id;

    var statusCode = 1;

    try {
        //check the email id  is exists in user table or not
        const sql = "SELECT * FROM `users` WHERE id = ?";
        const user = await db.query(sql, [id]);
        if (user.length > 0) {
            // update status in the user table
            const sql = "UPDATE `users` SET status='?'  WHERE id=?";
            const status_results = await db.query(sql, [statusCode, id]);

            if (status_results.affectedRows > 0) {
                req.flash("message", "User  has been approved succesfully.");
                res.redirect("back");
            } else {
                req.flash("error", `Sorry! Could approved with id ${id}.`);
                res.redirect("back");
            }
        } else {
            req.flash(
                "error",
                `Sorry! Could not update status with id ${id}. Maybe id is wrong`
            );
            res.redirect("back");
        }
    } catch (error) {
        console.log("Error fetching data:", error);
        req.flash("error", "Oops! Could not could update status.");
        res.redirect("back");
    }
};

exports.deleteUserImage = async (req, res) => {
    var id = req.params.id;
    var type = req.params.type;

    try {
        //check the id is exists in users table or not
        const sql = "SELECT * FROM `users` WHERE id = ?";
        const user = await db.query(sql, [id]);
        if (user.length > 0) {
            if (type == "banner") {
                var banner_img = user[0].banner;

                // Delete the old banner image
                if (banner_img) {
                    const oldBannerImagePath = path.join(
                        __dirname,
                        "../../public/",
                        banner_img
                    );
                    try {
                        await fs.access(oldBannerImagePath); // Check if the file exists
                        await fs.unlink(oldBannerImagePath); // Delete the file
                    } catch (err) {
                        console.error("Error deleting old image:", err);
                    }
                }
                // Delete data from the user table
                const sql = 'UPDATE `users` SET banner="" WHERE id=?';
                const edit_results = await db.query(sql, [id]);

                if (edit_results.affectedRows > 0) {
                    req.flash("message", "Banner image has been deleted succesfully.");
                    res.redirect("back");
                } else {
                    req.flash("error", `Sorry! Could not delete with id ${id}.`);
                    res.redirect("back");
                }
            } else {
                var profile_img = user[0].profile_img;

                // Delete the old banner image
                if (profile_img) {
                    const oldBannerImagePath = path.join(
                        __dirname,
                        "../../public/",
                        profile_img
                    );
                    try {
                        await fs.access(oldBannerImagePath); // Check if the file exists
                        await fs.unlink(oldBannerImagePath); // Delete the file
                    } catch (err) {
                        console.error("Error deleting old image:", err);
                    }
                }

                // Delete data from the user table
                const sql = 'UPDATE `users` SET profile_img="" WHERE id=?';
                const edit_results = await db.query(sql, [id]);

                if (edit_results.affectedRows > 0) {
                    req.flash("message", "Profile image has been deleted succesfully.");
                    res.redirect("back");
                } else {
                    req.flash("error", `Sorry! Could not delete with id ${id}.`);
                    res.redirect("back");
                }
            }
        } else {
            req.flash(
                "error",
                `Sorry! Could not delete with id ${id}. Maybe id is wrong`
            );
            res.redirect("back");
        }
    } catch (error) {
        console.log("Error fetching data:", error);
        req.flash("error", "Oops! Could not delete banner image.");
        res.redirect("back");
    }
};

exports.downloadUsers = async (req, res) => {
    var search = req.query.search || "";

    try {
        var con = "";
        if (search != "" && search != null) {
            con = `WHERE first_name LIKE '%${search.trim()}%' OR last_name LIKE '%${search.trim()}%' OR email LIKE '%${search.trim()}%' OR phone LIKE '%${search.trim()}%'`;
        }

        const SQL = `SELECT * FROM users ${con} ORDER BY id DESC`;
        const users = await db.query(SQL);

        // Define CSV file headers
        const csvWriter = createObjectCsvWriter({
            path: "users.csv",
            header: [
                { id: "id", title: "Order Id" },
                { id: "first_name", title: "First Name" },
                { id: "last_name", title: "Last Name" },
                { id: "email", title: "Email" },
                { id: "phone", title: "Phone" },
                { id: "created_date", title: "Create Date" },
                { id: "status", title: "Status" },
            ],
        });

        const userList = [];
        users.map((user) => {
            const options = {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            };
            const createDt = new Date(user.created_at);
            const createDate = new Intl.DateTimeFormat("en-GB", options).format(
                createDt
            );

            statusArr = {
                0: "Approval Pending",
                1: "Active",
                2: "Deactive",
                3: "Deleted",
            };

            userList.push({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                created_date: createDate,
                status: statusArr[user.status],
            });
        });

        //console.log(userList)
        // Write orders data to CSV file
        csvWriter
            .writeRecords(userList)
            .then(() => {
                console.log("CSV file written successfully");
                // Once the file is written, send it as a response for download
                res.download("users.csv", "users.csv", (err) => {
                    if (err) {
                        console.error("Error sending CSV file:", err);
                        res.status(500).send("Internal Server Error");
                    } else {
                        // Remove the CSV file after it's sent
                        fs.unlink("users.csv", (err) => {
                            if (err) console.error("Error deleting CSV file:", err);
                        });
                    }
                });
            })
            .catch((err) => {
                console.error("Error writing CSV file:", err);
                res.status(500).send("Internal Server Error");
            });
    } catch (error) {
        console.log("Error fetching data:", error);
        req.flash("error", "Oops! Could not download orders.");
        res.redirect("back");
    }
};
