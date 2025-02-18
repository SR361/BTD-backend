const express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });

const {
    getUserProfile,
    updateUserProfile,
    getAddress,
    updateAddress,
    getCountries,
    getState,
    getCities,
    userOrders,
    userOrdersTrack,
    orderCancel,
    apiAddSubscriber
} = require("../controllers/api/ProfileController");

const router = express.Router();

router.post("/api/V1/get-user-profile", urlencodeParser, getUserProfile);
router.post("/api/V1/update-user-profile", urlencodeParser, updateUserProfile);
router.post("/api/V1/profile/get-address", urlencodeParser, getAddress);
router.post("/api/V1/profile/update-address", urlencodeParser, updateAddress);
router.get("/api/V1/get-countries", getCountries);
router.get("/api/V1/get-state", urlencodeParser, getState);
router.get("/api/V1/get-cities", urlencodeParser, getCities);
router.get("/api/V1/user-orders", urlencodeParser, userOrders);
router.get("/api/V1/user-orders-track", urlencodeParser, userOrdersTrack);
router.post("/api/V1/orders-cancel", urlencodeParser, orderCancel);

router.post("/api/V1/subscribe", urlencodeParser, apiAddSubscriber);

module.exports = router;