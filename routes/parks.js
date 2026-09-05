const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  getComments,
  createComment,
  deleteComment,
} = require("../controllers/parks");

router.get("/park/comments", auth, getComments);
router.post("/park/comments", auth, createComment);
router.delete("/park/comments/:_id", auth, deleteComment);
// router.put("/:_id/saves");
// router.delete("/:_id/saves");

module.exports = router;
