const router = require("express").Router();
const auth = require("../middleware/auth");
const userCtrl = require("../controller/userCtrl");

// register new user

router.get("/search", auth, userCtrl.searchUser);

router.get("/users/:id", auth, userCtrl.getUser);

router.patch("/user", auth, userCtrl.updateUser);

router.patch("/user/:id/follow", auth, userCtrl.follow);

router.patch("/user/:id/unfollow", auth, userCtrl.unFollow);

router.get("/suggestions-user", auth, userCtrl.suggestions);

module.exports = router;
