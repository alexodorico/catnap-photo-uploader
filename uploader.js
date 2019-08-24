const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const cloudinary = require('cloudinary').v2;
const fs = require("fs");
const db = require("./db");

const catUpload = async (req, res) => {
  try {
    const file = req.file.path;
    const [result] = await client.labelDetection(file);
    const annotations = result.labelAnnotations;
    const cat = checkForCat(annotations);

    if (cat) {
      const secure_url = await upload(file);

      if (secure_url) {
        deleteFile(file);
        return res.send({ success: true, url: secure_url });
      }

      deleteFile(file);
      return res.status(400).json({
        success: false,
        message: "Oops! Something went wrong while trying to post your photo."
      })
    }

    deleteFile(file);
    return res.status(400).json({ success: false, message: "Please upload a picture of a cat!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Oops! Something went wrong while trying to post your photo."
    })
  }
}

const userAvatarUpload = async (req, res) => {
  try {
    const file = req.file.path;
    const secure_url = await upload(file);

    if (secure_url) {
      deleteFile(file);
      return res.status(201).json({ success: true, url: secure_url });
    } else {
      deleteFile(file);
      return res.status(400).json({ success: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Oops! Something went wrong while trying to post your photo."
    })
  }
}

const checkForCat = annotations => {
  for (label of annotations) {
    if (label.description === "Cat") {
      return true;
      break;
    }

    return false;
  }
}

const upload = async file => {
  const { secure_url } = await cloudinary.uploader.upload(file);

  if (secure_url) {
    return secure_url;
  }

  return false;
}

const deleteFile = file => {
  fs.unlink(file, err => {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = {
  catUpload,
  userAvatarUpload,
}