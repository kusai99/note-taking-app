const NoteService = require("../services/NoteService");
const logger = require("../utils/Logger");
const { validationResult } = require("express-validator");
const NoteValidation = require("../validators/NoteValidation");
const validationErrorHandler = require("../validators/ValidationErrorHandler");

const NoteController = {
  // Get all the notes of the authenticated user
  getNotes: async (req, res) => {
    try {
      const notes = await NoteService.getNotesByUser(req.user.userId);

      if (!notes || notes.length === 0) {
        return res.status(404).json({ error: "No notes found" });
      }

      res.json(notes);
    } catch (error) {
      logger.log(
        "Error fetching notes for user ID " +
          req.user.userId +
          ": " +
          error.message
      );
      res.status(500).json({ error: error.message });
    }
  },

  // Get all the notes of the authenticated user and filter them by the specified criteria in the request payload.
  searchNotes: async (req, res) => {
    try {
      const searchCriteria = req.body;
      const notes = await NoteService.getNotesByUserAndCriteria(
        req.user.userId,
        searchCriteria
      );

      if (!notes || notes.length === 0) {
        return res.status(404).json({ error: "No notes found" });
      }

      res.json(notes);
    } catch (error) {
      logger.log(
        "Error fetching notes for user ID " +
          req.user.userId +
          ": " +
          error.message
      );
      res.status(500).json({ error: error.message });
    }
  },

  // Get a single note for the authenticated user with the note id specified in the request params.
  getNote: [
    NoteValidation.validateNoteId(),
    async (req, res) => {
      try {
        const note = await NoteService.getNoteById(
          req.params.id,
          req.user.userId
        );

        if (!note) {
          logger.log(
            `Note not found with ID: ${req.params.id} for user ID: ${req.user.userId}`
          );
          return res.status(404).json({ error: "Note not found" });
        }

        res.json(note);
      } catch (error) {
        logger.log(
          `Error fetching note with ID: ${req.params.id} for user ID: ${req.user.userId}: ${error.message}`
        );
        res.status(500).json({ error: error.message });
      }
    },
  ],

  // Create a new note and invalidate the notes cache
  createNote: [
    ...NoteValidation.createOrUpdateNoteValidation(),
    validationErrorHandler,
    async (req, res) => {
      const noteData = {
        noteType: req.body.noteType,
        title: req.body.title,
        content: req.body.content,
        userId: req.user.userId,
      };

      try {
        logger.log("Creating note: " + JSON.stringify(noteData));
        const note = await NoteService.createNote(noteData);
        return res.status(201).json(note);
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
          return res.status(409).json({ error: error.message });
        }
        logger.log("Error creating note: " + error.message);
        return res.status(500).json({ error: error.message });
      }
    },
  ],

  // Update a single note for the authenticated user with the note id specified in the request param
  updateNote: [
    NoteValidation.validateNoteId(),
    ...NoteValidation.createOrUpdateNoteValidation(),
    validationErrorHandler,
    async (req, res) => {
      try {
        const existingNote = await NoteService.getNoteById(
          req.params.id,
          req.user.userId
        );
        if (!existingNote) {
          return res.status(404).json({ error: "Note not found" });
        }

        const { noteType, title, content } = req.body;
        if (
          existingNote.noteType === noteType &&
          existingNote.title === title &&
          existingNote.content === content
        ) {
          logger.log("No changes detected, skip update.");
          return res.status(200).json({ message: "No changes detected" });
        }

        await NoteService.updateNote(req.params.id, req.user.userId, req.body);
        return res.status(200).json({ message: "Note updated successfully" });
      } catch (error) {
        logger.log(
          "Error updating note with ID " + req.params.id + ": " + error.message
        );
        if (error.name === "SequelizeUniqueConstraintError") {
          return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
      }
    },
  ],

  // Delete a single note for the authenticated user with the note id specified in the request param
  deleteNote: [
    NoteValidation.validateNoteId(),
    async (req, res) => {
      try {
        const existingNote = await NoteService.getNoteById(
          req.params.id,
          req.user.userId
        );
        if (!existingNote) {
          return res.status(404).json({ error: "Note not found" });
        }

        await NoteService.deleteNote(req.params.id, req.user.userId);
        res.status(204).send();
      } catch (error) {
        logger.log(
          "Error deleting note with ID " + req.params.id + ": " + error.message
        );
        res.status(500).json({ error: error.message });
      }
    },
  ],
};

module.exports = NoteController;
