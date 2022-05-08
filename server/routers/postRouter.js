const router = require("express").Router();
const auth = require("../middleware/auth");
const postCtrl = require("../controller/postCtrl");

// router.route("/posts").get().post()

router.post("/posts", auth, postCtrl.createPost);
router.get("/posts", auth, postCtrl.getPosts);
router.get("/post/:id", auth, postCtrl.getPost);
router.patch("/posts/:id", auth, postCtrl.updatePost);
router.patch("/posts/:id/like", auth, postCtrl.likePost);
router.patch("/posts/:id/unlike", auth, postCtrl.unLikePost);
router.get("/user_posts/:id", auth, postCtrl.getUserPosts);
router.get("/post_discover", auth, postCtrl.getPostDiscover);
router.delete("/post/:id", auth, postCtrl.deletePost);
router.patch("/savePost/:id", auth, postCtrl.savedPost);
router.patch("/unSavePost/:id", auth, postCtrl.unSavedPost);
router.get("/getSavePost", auth, postCtrl.getSavedPost);

module.exports = router;
