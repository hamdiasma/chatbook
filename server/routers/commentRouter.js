const router = require("express").Router();
const auth = require("../middleware/auth");
const commentCtrl = require("../controller/commentCtrl");

// router.route("/posts").get().post()

router.post("/comments", auth, commentCtrl.createComment);

router.patch("/comments/:id", auth, commentCtrl.updateComment);

router.patch("/comments/:id/like", auth, commentCtrl.likeComment);

router.patch("/comments/:id/unlike", auth, commentCtrl.unLikePost);

router.delete("/comments/:id", auth, commentCtrl.deleteComment);

module.exports = router;
