const express = require("express");
const router = express.Router();

const { 
  insertPhoto,
  deletePhoto, 
  getAllPhotos, 
  getUserPhotos, 
  getPhotoById, 
  updatePhoto, 
  likePhoto,
  commentPhoto,
  searchPhotosByTitle} = require('../controllers/PhotoControler');

const { photoInsertValidation, photoUpdateValidation, commentValidation } = require("../middlewares/photoValidation");
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

router.get("/", authGuard, getAllPhotos);
router.get("/user/:id", authGuard, getUserPhotos);
router.get("/search", authGuard, searchPhotosByTitle);
router.get("/:id", authGuard, getPhotoById);

router.put("/like/:id", authGuard, likePhoto);
router.put("/comment/:id", authGuard, commentValidation(), validate, commentPhoto);
router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);

module.exports = router;
