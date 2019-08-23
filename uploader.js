const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
const cloudinary = require('cloudinary').v2;
const fs = require("fs");
const db = require("./db");

const catUpload = async (req, res) => {
  const error = res.status(400).json({
    success: false,
    message: "Oops! Something went wrong while trying to post your photo."
  });

  try {
    const file = req.file.path;
    const [result] = await client.labelDetection(file);
    const annotations = result.labelAnnotations;
    const cat = checkForCat(annotations);

    if (cat) {
      const secure_url = await upload(file);

      if (secure_url) {
        const success = await updateDb("posts", "photo_url", secure_url, req.params.postId);

        if (success) {
          deleteFile(file);
          return res.status(201).json({ success: true, url: secure_url });
        }

        deleteFile(file);
        return error;
      }

      deleteFile(file);
      return error;
    }

    deleteFile(file);
    return res.status(400).json({ success: false, message: "Please upload a picture of a cat!" });
  } catch (e) {
    return error;
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

const updateDb = async (table, column, url, id) => {
  const query = `UPDATE ${table} SET ${column} = $1 WHERE id = $2`;

  try {
    await db.query(query, [url, id]);
    return true
  } catch (error) {
    return false
  }
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