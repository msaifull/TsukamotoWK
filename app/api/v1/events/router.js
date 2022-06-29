const router = require("express").Router();
const {
  getAllEvent,
  createEvent,
  getOneEvent,
  updateEvent,
  deleteEvent,
//   getAllSpeaker,
//   createSpeaker,
//   getOneSpeaker,
//   updateSpeaker,
//   deleteSpeaker,
} = require("./controller");

const { authenticateUser } = require("../../../middlewares/auth");
const upload = require("../../../middlewares/multer");

router.get("/", authenticateUser, getAllEvent);
router.post("/", authenticateUser, upload.single("cover"), createEvent);
router.get("/:id", authenticateUser, getOneEvent);
// router.get("/:id", authenticateUser, getOneCategory);
router.put("/:id", authenticateUser, upload.single("cover"), updateEvent);
router.delete("/:id", authenticateUser, deleteEvent);

module.exports = router;
