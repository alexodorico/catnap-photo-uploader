require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const auth = require("./auth");
const uploader = require("./uploader");
const cloudinary = require('cloudinary').v2;
const port = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const upload = multer({
  dest: "./uploads"
});


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/upload/post/", auth.verifyToken, upload.single("file"), uploader.catUpload);
app.post("/api/upload/user/", auth.verifyToken, upload.single("file"), uploader.userAvatarUpload);
app.post("/api/upload/cat/", auth.verifyToken, upload.single("file"), uploader.catUpload);

app.listen(port, _ => console.log(`Listenin' on port ${port} 🔥`));
