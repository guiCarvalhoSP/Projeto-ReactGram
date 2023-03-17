const express = require("express");
const router = express.Router();

const { insertPhoto, deletePhoto } = require('../controllers/PhotoControler');

const { photoInsertValidation } = require("../middlewares/photoValidation");
const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { imageUpload } = require('../middlewares/imageUpload');

router.post(
  "/",
  authGuard,
  imageUpload.single("image"),
  photoInsertValidation(),
  validate,
  insertPhoto
);

router.delete(
  "/:id",
  authGuard,
  deletePhoto
);

module.exports = router;
