const Note = require("../models/Note");
const NoteRepository = require("../repositories/NoteRepository");
const NoteType = require("../types/NoteType");
const logger = require("../utils/Logger");

/*Handle note creation logic, validate the provided noteType against the NoteType enum, set the appropriate note type,
 and then create the Note user NoteRepository*/
class NoteFactory {
  static async createNote(noteData) {
    const { noteType, title, content, userId } = noteData;
    if (!Object.values(NoteType).includes(noteType)) {
      const errorMessage = `Invalid note type provided: ${noteType}. Must be one of the following: [${Object.values(
        NoteType
      ).join(", ")}]`;
      logger.log(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      return await NoteRepository.createNote(noteData);
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        const errorMessage = `A ${noteData.noteType} note with title '${noteData.title}' already exists.`;
        logger.log(errorMessage);
        throw new Error(errorMessage);
      }
      logger.log(`Error creating note for user ${userId}: ${error.message}`);
      throw new Error(`Error creating note: ${error.message}`);
    }
  }
}

module.exports = NoteFactory;
