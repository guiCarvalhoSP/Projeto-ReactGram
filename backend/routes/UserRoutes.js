const express = require("express");
const router = express.Router();

const { register, login, getCurrentUser } = require("../controllers/UserController");

const authGuard = require("../middlewares/authGuard");
const validate = require("../middlewares/handleValidation");
const { userCreateValidation, loginValidation } = require("../middlewares/userValidation");

router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);

module.exports = router;