const db = require("../../database/db");
require("dotenv").config();
const path = require("path");
const fs = require("fs/promises");
// const { statusCoupon } = require("../admin/CouponController");
const { subscribe } = require("diagnostics_channel");
const baseUrl = process.env.BASEURL;
const transporter = require("../../services/mailer");

exports.getUserProfile = async (req, res) => {
    const { user_id } = req.body;
    try {
        const sql =
            "select id, first_name, last_name, email, phone, address from users where id = ?";
        const user = await db.query(sql, [user_id]);

        if (user.length > 0) {
            res
                .status(200)
                .send({ status: true, result: { user: user[0] }, message: "" });
        } else {
            res.status(200).send({
                status: false,
                result: {},
                message: "Sorry! User not exits our record",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, result: "", errors: error });
    }
};

exports.updateUserProfile = async (req, res) => {
    const { user_id, first_name, last_name, email, phone, profile_address } =
        req.body;
    try {
        const checkUserSql = "select * from users where id = ?";
        const checkUser = await db.query(checkUserSql, [user_id]);

        const checkEmailSql = "select * from users where id != ? and email =?";
        const checkEmail = await db.query(checkEmailSql, [user_id, email]);
        if (checkEmail.length > 0) {
            res.status(200).send({
                status: false,
                result: {},
                message: "Sorry! This email already taken",
            });
            return;
        }

        const checkPhoneSql = "select * from users where id != ? and phone = ?";
        const checkPhone = await db.query(checkPhoneSql, [user_id, phone]);
        if (checkPhone.length > 0) {
            res.status(200).send({
                status: false,
                result: {},
                message: "Sorry! This phone number already taken",
            });
            return;
        }

        if (checkUser.length > 0) {
            const sql =
                "UPDATE `users` SET first_name=?, last_name=?, phone=?, email=?, address=? WHERE id=?";
            const edit_results = await db.query(sql, [
                first_name,
                last_name,
                phone,
                email,
                profile_address,
                user_id,
            ]);
            if (edit_results.affectedRows > 0) {
                res.status(200).send({
                    status: true,
                    result: {},
                    message: "Your profile update successfully",
                });
            } else {
                res.status(200).send({
                    status: false,
                    result: {},
                    message: "Sorry! Profile not update. Please try again",
                });
            }
        } else {
            res.status(200).send({
                status: false,
                result: {},
                message: "Sorry! User not exits our record",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, result: "", errors: error });
    }
};

exports.getAddress = async (req, res) => {
    const { user_id } = req.body;
    try {
        const addresssql =
            "select ua.id,user_id,full_name,phone,email, address, ua.city_id, ua.state_id, ua.country_id, cities.name as city_name,countries.name as countrie_name,postal_code from user_address ua left JOIN cities ON ua.city_id = cities.id left join countries on ua.country_id = countries.id where user_id = ?";
        const address = await db.query(addresssql, [user_id]);
        if (address.length > 0) {
            res.status(200).send({
                status: true,
                result: {
                    address: address[0],
                },
                errors: "",
            });
        } else {
            res.status(200).send({
                status: false,
                result: "",
                errors: "Address don't exist",
            });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors: error });
    }
};

exports.updateAddress = async (req, res) => {
    const {
        user_id,
        full_name,
        phone,
        email,
        address,
        city_id,
        country_id,
        postal_code,
    } = req.body;
    try {
        const selectSql = "select * from user_address where user_id = ?";
        const useraddress = await db.query(selectSql, [user_id]);
        if (useraddress.length > 0) {
            const sql =
                "UPDATE `user_address` SET full_name=?, phone=?, email=?, address=?, city_id=?, country_id=?, postal_code=? WHERE user_id=?";
            const edit_results = await db.query(sql, [
                full_name,
                phone,
                email,
                address,
                city_id,
                country_id,
                postal_code,
                user_id,
            ]);

            if (edit_results.affectedRows > 0) {
                res.status(200).send({
                    status: true,
                    result: {},
                    message: "Address has been updated successfully",
                    errors: "",
                });
            } else {
                res.status(200).send({
                    status: true,
                    result: {},
                    message: "Address record has not updated.",
                    errors: "",
                });
            }
        } else {
            const sql = "INSERT INTO `user_address` SET user_id=?, full_name=?, phone=?, email=?, address=?, city_id=?, country_id=?, postal_code=?";
            const results = await db.query(sql, [
                user_id,
                full_name,
                phone,
                email,
                address,
                city_id,
                country_id,
                postal_code,
            ]);
            if (results.insertId > 0) {
                res.status(200).send({
                    status: true,
                    result: {},
                    message: "Address has been added successfully",
                });
            } else {
                res.status(500).send({
                    status: true,
                    result: {},
                    message: "Address does't not addedd",
                });
            }
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors: error });
    }
};

exports.getCountries = async (req, res) => {
    try {
        const sql = "select id,name from countries";
        const countries = await db.query(sql);

        res.status(200).send({
            status: true,
            result: {
                countries: countries,
            },
            message: "",
        });
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors: error });
    }
};

exports.getState = async (req, res) => {
    const { country_id } = req.query;
    try {
        const countrieSql = "select * from countries where id = ?";
        const countrie = await db.query(countrieSql, [country_id]);
        if (countrie.length > 0) {
            const sql = "select id,name from states where country_id = ?";
            const states = await db.query(sql, [country_id]);
            res.status(200).send({
                status: true,
                result: {
                    states: states,
                },
            });
        } else {
            res.status(200).send({
                status: false,
                result: {},
                message: "Sorry! countrie id is invlid",
            });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors: error });
    }
};

exports.getCities = async (req, res) => {
    const { country_id, search } = req.query;

    try {
        const stateSql = `select * from countries where id = ? `;
        const state = await db.query(stateSql, [country_id]);
        if (state.length > 0) {
            let query = "";
            if (search != undefined) {
                query = `and name like "%${search}%"`
            }
            const sql = `select id,name from cities where country_id = ? ${query} limit 20`;
            console.log('sql', sql)
            const cities = await db.query(sql, [country_id]);

            res.status(200).send({
                status: true,
                result: {
                    cities: cities,
                },
            });
        } else {
            res.status(200).send({
                status: false,
                result: {},
                message: "Sorry! City id is invalid",
            });
        }
    } catch (error) {
        res.status(500).send({ status: false, result: "", errors: error });
    }
};

exports.userOrders = async (req, res) => {
    const { user_id } = req.query;
    try {
        const sql =
            "select * from orders where user_id = ? and delivery_status != 'pending'";
        const orders = await db.query(sql, [user_id]);
        const orderdata = [];
        for (let index = 0; index < orders.length; index++) {
            const orderdetailssql = "select * from order_details where order_id = ? ";
            const orderdeatails = await db.query(orderdetailssql, [orders[index].id]);
            for (let i = 0; i < orderdeatails.length; i++) {
                const singleOrder = {};
                const productsql = "select * from products where id = ?";
                const products = await db.query(productsql, [
                    orderdeatails[i].product_id,
                ]);

                const productvarsql =
                    "SELECT pv.id as pv_id, pv.price as pv_price, pc.name as pc_name, ps.name as ps_name FROM `product_variations` AS pv left join product_colors pc on pv.color_id = pc.id left join product_sizes ps on pv.size_id = ps.id where pv.id = ?";
                const productvariations = await db.query(productvarsql, [
                    orderdeatails[i].variation,
                ]);

                singleOrder["id"] = orders[index].id;
                singleOrder["order_detail_id"] = orderdeatails[index].id;
                singleOrder["type"] = "product";
                singleOrder["prod_name"] = products[0]?.prod_name;
                singleOrder["size"] = productvariations[0]?.ps_name;
                singleOrder["color"] = productvariations[0]?.pc_name;
                singleOrder["image"] = products[0]?.prod_image;
                singleOrder["code"] = orders[index].code;
                singleOrder["price"] = orderdeatails[i].price;
                singleOrder["status"] = orderdeatails[i].delivery_status;
                orderdata.push(singleOrder);
            }
        }
        // gift card data
        const giftSql = "select * from giftcard_order where user_id = ?";
        const gift_orders = await db.query(giftSql, [user_id]);
        const gift_orderdata = [];
        for (let index = 0; index < gift_orders.length; index++) {
            const gift_singleOrder = {};
            const giftcardsql = "select * from gift_cards where id = ?";
            const giftcard = await db.query(giftcardsql, [
                gift_orders[index].giftcard_id,
            ]);

            gift_singleOrder["id"] = gift_orders[index].id;
            gift_singleOrder["order_detail_id"] = "";
            gift_singleOrder["type"] = "gift";
            gift_singleOrder["prod_name"] = giftcard[0]?.title;
            gift_singleOrder["size"] = "";
            gift_singleOrder["color"] = "";
            gift_singleOrder["image"] = giftcard[0]?.image;
            gift_singleOrder["code"] = "";
            gift_singleOrder["price"] = gift_orders[index].grand_total;
            gift_singleOrder["status"] = "success";
            gift_orderdata.push(gift_singleOrder);
        }
        // gift card data

        // Merge orderdata and gift_orderdata
        const combinedOrders = [...orderdata, ...gift_orderdata];
        // Sort the merged array by 'id' in descending order
        combinedOrders.sort((a, b) => b.id - a.id);

        res.status(200).send({
            status: true,
            result: {
                orders: combinedOrders,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, result: "", errors: error });
    }
};

exports.userOrdersTrack = async (req, res) => {
    const { user_id, order_id, order_detail_id } = req.query;
    try {
        const sql =
            "select * from orders where user_id = ? and delivery_status != 'delivered' and delivery_status != 'cancelled' ORDER BY `id` DESC";
        const orders = await db.query(sql, [user_id]);
        const orderdata = [];
        for (let index = 0; index < orders.length; index++) {
            const orderdetailssql = "select * from order_details where order_id = ? ";
            const orderdeatails = await db.query(orderdetailssql, [orders[index].id]);
            for (let i = 0; i < orderdeatails.length; i++) {
                const singleOrder = {};
                const productsql = "select * from products where id = ?";
                const products = await db.query(productsql, [
                    orderdeatails[i].product_id,
                ]);

                const productvarsql =
                    "SELECT pv.id as pv_id, pv.price as pv_price, pc.name as pc_name, ps.name as ps_name FROM `product_variations` AS pv left join product_colors pc on pv.color_id = pc.id left join product_sizes ps on pv.size_id = ps.id where pv.id = ?";
                const productvariations = await db.query(productvarsql, [
                    orderdeatails[i].variation,
                ]);

                singleOrder["id"] = orders[index].id;
                singleOrder["order_deatail_id"] = orderdeatails[i].id;
                singleOrder["prod_name"] = products[0]?.prod_name;
                singleOrder["size"] = productvariations[0]?.ps_name;
                singleOrder["color"] = productvariations[0]?.pc_name;
                singleOrder["image"] = products[0]?.prod_image;
                singleOrder["code"] = orders[index].code;
                singleOrder["price"] = orderdeatails[i].price;
                singleOrder["delivery_status"] = orderdeatails[i].delivery_status;

                const orderhistoriesql =
                    "select * from order_historys where order_id = ?";
                const orderhistories = await db.query(orderhistoriesql, [
                    orders[index].id,
                ]);
                let width = "0%";
                let tracking = "";
                const statusObject = [];
                for (let j = 0; j < orderhistories.length; j++) {
                    const singleStatus = {};
                    const statusValue = orderhistories[j].delivery_status;
                    let status = "";

                    if (statusValue == "pending") {
                        status = "Pending";
                        width = "0%";
                    } else if (statusValue == "confirmed") {
                        status = "Confirmed";
                        width = "25%";
                    } else if (statusValue == "picked_up") {
                        status = "Shipped";
                        width = "50%";
                    } else if (statusValue == "on_the_way") {
                        status = "Out For Delivery";
                        width = "75%";
                    } else if (statusValue == "delivered") {
                        status = "Delivered";
                        width = "100%";
                    } else {
                        status = statusValue;
                        width = "100%";
                    }
                    singleStatus["status"] = status;
                    if (order_detail_id == orderdeatails[i].id) {
                        tracking = "active";
                    }

                    const monthNames = [
                        "Jan",
                        "Feb",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                    ];
                    var dateObject = new Date(orderhistories[j].created_at);
                    var year = dateObject.getFullYear();
                    var month = monthNames[dateObject.getMonth()];
                    var day = dateObject.getDate();

                    var formattedDate = day + ", " + month + " " + year;
                    singleStatus["date"] = formattedDate;
                    singleStatus["courier_name"] = orderhistories[j].courier_name;
                    singleStatus["aws_bill_no"] = orderhistories[j].aws_bill_no;
                    singleStatus["remark"] = orderhistories[j].remark;
                    statusObject.push(singleStatus);
                }
                singleOrder["width"] = width;
                singleOrder["tracking"] = tracking;
                singleOrder["status"] = statusObject;
                orderdata.push(singleOrder);
            }
        }
        res.status(200).send({
            status: true,
            result: {
                orders: orderdata,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, result: "", errors: error });
    }
};

exports.orderCancel = async (req, res) => {
    const { order_id, user_id } = req.body;
    try {
        const sql = "select * from orders where id = ?";
        const order = await db.query(sql, [order_id]);

        if (order.length > 0) {
            const sql = "UPDATE `orders` SET delivery_status=? WHERE id=?";
            const edit_results = await db.query(sql, ["cancelled", order_id]);

            const orderdetailssql =
                "update `order_details` set delivery_status=? where order_id = ?";
            const orderdetails = await db.query(orderdetailssql, [
                "cancelled",
                order_id,
            ]);

            const lasthistoriesql =
                "SELECT * FROM `order_historys` where order_id = ? ORDER BY `id` DESC limit 1";
            const lasthistorie = await db.query(lasthistoriesql, [order_id]);
            let step = "";
            if (lasthistorie.length > 0) {
                step = lasthistorie[0].step;
                step += 1;
            } else {
                step = 2;
            }
            const orderhistoriesql =
                "INSERT INTO `order_historys` SET order_id=?, user_id=?, delivery_status=?, remark=?, step=?";
            const results = await db.query(orderhistoriesql, [
                order_id,
                user_id,
                "cancelled",
                "Your order is has been cancelled",
                step,
            ]);

            const getOrderDtlSql = "select * from order_details where order_id = ?";
            const orderDtl = await db.query(getOrderDtlSql, [order_id]);
            for (let index = 0; index < orderDtl.length; index++) {
                const getVariationSql = "select * from product_variations where id = ?";
                const getVariations = await db.query(getVariationSql, [
                    orderDtl[index]?.variation,
                ]);
                let stock = getVariations[0]?.stock + orderDtl[index].quantity;

                const variationUPDSql =
                    "update product_variations set stock = ? where id = ?";
                const variation = await db.query(variationUPDSql, [
                    stock,
                    orderDtl[index]?.variation,
                ]);
            }

            res.status(200).send({
                status: true,
                results: {},
                message: "Your order has been cancelled",
            });
        } else {
            res.status(421).send({
                status: false,
                result: {},
                message: "Sorry. No FAQs Categorie records exists!",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, result: "", errors: error });
    }
};

exports.apiAddSubscriber = async (req, res) => {
    if (!req.body) {
        res.status(200).send({
            status: false,
            result: {},
            message: "Request parameters can not be empty!",
        });
    }
    const { subscribe_email } = req.body;
    try {
        const checkEmailSql = "select * from subscribes where email = ?";
        const checkEmail = await db.query(checkEmailSql, [subscribe_email]);
        if (checkEmail.length > 0) {
            res.status(200).send({
                status: false,
                result: {},
                message: "You are already subscriber",
            });
            return;
        }
        const sql = "insert into subscribes set email = ?";
        const result = await db.query(sql, [subscribe_email]);
        if (result.insertId > 0) {
            const mailOptions = {
                from: process.env.SMTP_FROM_EMAIL,
                to: process.env.ADMIN_EMAIL,
                subject: "New user subscribe",
                html: `
                    <h1>Subscribe</h1>
                    <h3>Dear Sir</h3>
                    <p>Currently new user subscribe<br><p> 
                    <p><strong>Email : ${subscribe_email}</strong></p>
                `,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.status(200).send({
                        status: false,
                        result: {},
                        message: "Error sending email",
                        error: error,
                    });
                } else {
                    console.log("Email sent: " + info.response);
                    res.status(200).send({
                        status: true,
                        result: {},
                        message: "Thank you for subscribe us.",
                    });
                }
            });
        } else {
            res.status(200).send({
                status: false,
                result: {},
                message: "Something wrong! Please try again",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, result: "", errors: error });
    }
};
