const express = require("express");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const { login, signup, updateUser, getUser } = require("../controllers/users");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", login);
router.get("/users/me", auth, getUser);
router.post("/users/me", auth, upload.single("avatar"), updateUser);

module.exports = router;
