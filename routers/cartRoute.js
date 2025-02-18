const express = require("express");
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({ extended: false });
const verifyToken = require("../middeleware/verifyToken");
const verifyPrintToken = require("../middeleware/verifyPrintToken");

const {
    apiwishlists,
    apiRemoveWishlists,
    apiAllWishlistProducts,
    apiSavePregress,
    apifirstPage,
    apiAddCart,
    apiGetCart,
    removeCartItem,
    apiUpdateCart,
    apiDeleteCartItem,
    apiUpdateShippingInfo,
    apiCheckCoupon,
    apiCheckCouponGiftCard,
    getOrder,
    apiRemoveCoupon,
    apiPayment,
    apiAddGiftCard,
    updateQty,
    getCartContent
} = require("../controllers/api/CartController");

const router = express.Router();

router.get("/api/V1/cart/get-content", urlencodeParser, getCartContent);
router.post("/api/V1/wishlists", urlencodeParser, apiwishlists);
router.post("/api/V1/remove/wishlists", urlencodeParser, apiRemoveWishlists);
router.get("/api/V1/all-wishlists", urlencodeParser, apiAllWishlistProducts);

router.get("/api/V1/getCart/", urlencodeParser, apiGetCart);
router.post("/api/V1/remove-cart-item", urlencodeParser, removeCartItem);
router.post("/api/V1/process-payment", urlencodeParser, apiPayment);
router.post("/api/V1/checkCoupon", urlencodeParser, apiCheckCoupon);
router.post("/api/V1/checkCouponGiftCard", urlencodeParser, apiCheckCouponGiftCard);
router.get("/api/V1/get-order", urlencodeParser, getOrder);
router.post("/api/V1/update-qty", urlencodeParser, updateQty);

router.post("/api/V1/firstPage", 
            urlencodeParser, 
            apifirstPage);

router.post("/api/V1/addCart", 
            urlencodeParser,  
            apiAddCart);

router.post("/api/V1/addGiftCard", 
            urlencodeParser,  
            verifyToken,
            apiAddGiftCard);
router.post("/api/V1/updateCart", 
            urlencodeParser,
            apiUpdateCart);
router.post("/api/V1/deleteCartItem", 
            urlencodeParser,
            apiDeleteCartItem);
router.post("/api/V1/updateShippingInfo", 
            urlencodeParser,
            apiUpdateShippingInfo);

router.post("/api/V1/removeCoupon", 
            urlencodeParser, 
            apiRemoveCoupon);
module.exports = router;