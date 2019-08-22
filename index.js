const express = require("express");
const app = express();
const cors = require("cors");
const auth = require("./auth");
const uploader = require("./uploader");
const port = process.env.PORT || 3000;

app.use(cors());

app.post("/upload/post/:userId", auth.verifyToken, uploader.postUpload);
app.post("/upload/user/:userId", auth.verifyToken, uploader.userAvatarUpload);
app.post("/upload/cat/:catId", auth.verifyToken, uploader.catAvatarUpload);

app.listen(port, _ => console.log(`Listenin' on port ${port} 🔥`));
