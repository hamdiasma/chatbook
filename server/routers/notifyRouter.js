const router = require("express").Router();
const notifyCtrl = require("../controller/notifyCtrl");
const auth = require("../middleware/auth");

router.post("/create_notify", auth, notifyCtrl.createNotify);
router.delete("/delete_notify/:id", auth, notifyCtrl.removeNotify);
router.get("/notifies", auth, notifyCtrl.getNotifies);
router.patch("/isread_notify/:id", auth, notifyCtrl.isReadNotify);
router.delete("/delate_all_notifies", auth, notifyCtrl.deletaAllNotifies);

module.exports = router;
