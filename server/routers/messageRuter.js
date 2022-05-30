const router = require("express").Router();
const messageCtrl = require("../controller/messageCtrl");
const auth = require("../middleware/auth");

router.post("/message", auth, messageCtrl.createMessage);
router.get("/conversations", auth, messageCtrl.getConversation);
router.get("/messages/:id", auth, messageCtrl.getMessages);
router.delete("/message/:id", auth, messageCtrl.deleteMessage);
router.delete("/conversation/:id", auth, messageCtrl.deleteConversation);

module.exports = router;
