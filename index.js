var app = require("express")();

var express = require("express");
require("dotenv").config();
var path = require("path");
var http = require("http").Server(app);
var validator = require("express-validator");
const db = require("./database/db"); // Adjust the path as needed
var cors = require("cors");

// import controller
var AuthController = require("./controllers/admin/AuthController.js");

// import Router file
var pageRouter = require("./routers/route");
var dashboardRouter = require("./routers/dashboardRoute");
var authRouter = require("./routers/AuthRoute");
var serviceRouter = require("./routers/serviceRoute");
var userRouter = require("./routers/userRoute");
var adminRouter = require("./routers/adminRoute");
var pagesRouter = require("./routers/pagesRoute");
var categoryRouter = require("./routers/categoryRoute");
var blogRouter = require("./routers/blogRoute");
var blogCategorieRouter = require("./routers/blogCategorieRoute");
var blogTagRouter = require("./routers/tagRoute");
var contactQueriesRouter = require("./routers/contactQueriesRoute");
var SocialMediaRouter = require("./routers/SocialMediaRoute");
var testimonialRouter = require("./routers/testimonialRoute");
var CMSRouter = require("./routers/CMSRoute");

var APIProfileRouter = require("./routers/APIProfileRoute");
var APIContacustRouter = require("./routers/APIContactRoute");
var articleRouter = require("./routers/articleRoute");
var archiveRouter = require("./routers/archiveRoute");
var ourPartnerRouter = require("./routers/ourPartnerRoute");


var session = require("express-session");
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var i18n = require("i18n-express");
app.use(bodyParser.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://beyond.neuronsit.in"], // Add your frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
const tokenBlacklist = new Set();
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "user_sid",
    secret: "somerandonstuffs",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: 1200000,
    },
  })
);

// app.use(
//   session({ resave: false, saveUninitialized: true, secret: "nodedemo" })
// );
app.use(flash());
app.use(
  i18n({
    translationsPath: path.join(__dirname, "i18n"), // <--- use here. Specify translations files path.
    siteLangs: ["es", "en", "de", "ru", "it", "fr"],
    textsVarName: "translation",
  })
);
if (process.env.NODE_ENV == "production") {
  const allowCrossDomain = (req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `https://beyond.neuronsit.in`,"http://localhost:5173");

    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    next();
  };
  app.use(allowCrossDomain);
}
app.use("/uploads", (req, res, next) => {
  // setting the response headers
  if (process.env.NODE_ENV == "production") {
    res.header("Access-Control-Allow-Origin", "https://beyond.neuronsit.in","http://localhost:5173");
  }
  // cache control header
  // next middleware or route handler
  next();
});

//app.use('/public', express.static('public'));
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("public/uploads"));

app.get("/layouts/", function (req, res) {
  res.render("view");
});

// Define middleware to pass common parameters
app.use((req, res, next) => {
  res.locals.SiteTitle = process.env.APP_NAME; // Example common parameter
  res.locals.currentUser = req.session.user; // Example user information
  // You can add more common parameters here as needed
  next();
});

// apply controller
AuthController(app);

//For set layouts of html view
var expressLayouts = require("express-ejs-layouts");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);

// Define All Route
pageRouter(app);
app.use(authRouter);
app.use(dashboardRouter);
app.use(userRouter);
app.use(serviceRouter);
app.use(adminRouter);
app.use(pagesRouter);
app.use(categoryRouter);
app.use(blogRouter);
app.use(blogCategorieRouter);
app.use(blogTagRouter);
app.use(contactQueriesRouter);
app.use(SocialMediaRouter);
app.use(testimonialRouter);
app.use(CMSRouter);

app.use(APIProfileRouter);
app.use(APIContacustRouter);
app.use(articleRouter);
app.use(archiveRouter);
app.use(ourPartnerRouter);

app.get("/", function (req, res) {
  res.redirect("/");
});

http.listen(8000, function () {
  console.log("listening on *:8000");
});
