const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const Mongoose = require("./configuration/connection");
const multer = require("multer");


const app = express();

app.use((req, res, next) => {
  res.header("Cache-Control", "private,no-cache,no-store,must-revalidate");
  next();
});

//view engine
app.set("view engine", "ejs");

//static files
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// MULTER FILE UPLOADING
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  },
});
app.use(
  multer({ dest: "public/images", storage: fileStorage }).array("image",5)
);

//session and cookied
app.use(cookieParser());
app.use(
  session({
    secret: "Your_Secret_Key",
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge: 24 * 60 * 60 * 1000} // 1 day
  })
);

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

// MAIN ROUTES
app.use("/admin", adminRouter);
app.use("/", userRouter);
app.use("*",(req,res)=>{
  res.render('404')
})

app.listen("8080", () => {
  console.log("server is running on http://localhost:8080");
});
