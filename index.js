require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const auth = require("./auth");
const uploader = require("./uploader");
const cloudinary = require('cloudinary').v2;
const port = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});


app.use(cors());

app.post("/upload/post/:userId", auth.verifyToken, uploader.postUpload);
app.post("/upload/user/:userId", auth.verifyToken, uploader.userAvatarUpload);
app.post("/upload/cat/:catId", auth.verifyToken, uploader.catAvatarUpload);

app.listen(port, _ => console.log(`Listenin' on port ${port} 🔥`));
