const express = require("express");
const NoteController = require("../controllers/NoteController");
const authMiddleware = require("../utils/Auth");

const router = express.Router();
router.use(authMiddleware);

router.get("/", NoteController.getNotes);
router.get("/:id", NoteController.getNote);
router.post("/search", NoteController.searchNotes);
router.post("/", NoteController.createNote);
router.put("/:id", NoteController.updateNote);
router.delete("/:id", NoteController.deleteNote);

module.exports = router;
