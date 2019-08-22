const vision = require('@google-cloud/vision');
const cloudinary = require('cloudinary').v2;
const client = new vision.ImageAnnotatorClient();
const db = require("./db");

const postUpload = async (req, res) => {
  const { secure_url } = await cloudinary.uploader.upload(req.body.data, (error, result) => console.log(result));
  const success = await updateDb("posts", "photo_url", secure_url, req.params.postId);

  if (success) {
    return res.status(201).json({ success: true, url: secure_url });
  } else {
    return res.status(400).json({ success: false });
  }
}

const userAvatarUpload = async _ => {
  const { secure_url } = await cloudinary.uploader.upload(req.body.data, (error, result) => console.log(result));
  const success = await updateDb("users", "avatar_url", url, req.params.userId);

  if (success) {
    return res.status(201).json({ success: true, url: secure_url });
  } else {
    return res.status(400).json({ success: false });
  }
}

const catAvatarUpload = async _ => {
  const { secure_url } = await cloudinary.uploader.upload(req.body.data, (error, result) => console.log(result));
  const success = await updateDb("cats", "avatar_url", url, req.params.catId);

  if (success) {
    return res.status(201).json({ success: true, url: secure_url });
  } else {
    return res.status(400).json({ success: false });
  }
}

async function updateDb(table, column, url, id) {
  const query = `UPDATE ${table} SET ${column} = $1 WHERE id = $2`;

  try {
    await db.query(query, [url, id]);
    return true
  } catch (error) {
    return false
  }
}

module.exports = {
  postUpload,
  userAvatarUpload,
  catAvatarUpload
}