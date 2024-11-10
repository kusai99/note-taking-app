const NoteRepository = require("../repositories/NoteRepository");
const redisClient = require("../config/Redis");
const NoteFactory = require("../services/NoteFactory");
const logger = require("../utils/Logger");
const { Op } = require("sequelize");
const NoteType = require("../types/NoteType");

const NoteService = {
  //Get all the notes of the validated user from the cache (if there is valid notes cache) or from the Notes table through the NoteRepository
  getNotesByUser: async (userId) => {
    try {
      logger.log(`Fetching notes for user ${userId}`);
      if (!redisClient.isOpen) {
        const errorMessage = "Redis client is not connected.";
        logger.log(errorMessage);
        throw new Error(errorMessage);
      }

      const cacheKey = `user:${userId}:notes`;
      const cachedNotes = await redisClient.get(cacheKey);
      if (cachedNotes) return JSON.parse(cachedNotes);

      const notes = await NoteRepository.findByUserId(userId);
      await redisClient.set(cacheKey, JSON.stringify(notes), "EX", 3600);
      return notes;
    } catch (error) {
      logger.log(`Error fetching notes for user ${userId}: ${error.message}`);
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }
  },

  /*
  Get all the notes of the authenticated user and filter them by the specified criteria in searchCriteria .
  all the criteria are nullable, and if the request payload is empty, then getNotes() method will be called; this is so that
  we return the cached list of all the notes in case they were already cached.
  
  Search Criteria:
  noteType: exact match
  title and content: titles and contents that contain the search query.
  dateFrom: note updatedDate after (inclusive)
  dateFrom: updateDate before (inclusive)
  */
  getNotesByUserAndCriteria: async (userId, searchCriteria) => {
    try {
      const { noteType, title, content, dateFrom, dateTo } = searchCriteria;
      logger.log(`Fetching notes for user ${userId}`);

      const filters = { userId };

      const isSearchCriteriaEmpty =
        Object.values(searchCriteria).every((value) => value === null) ||
        searchCriteria.length === 0;
      if (isSearchCriteriaEmpty) {
        return NoteService.getNotesByUser(userId);
      }

      if (noteType) {
        filters.noteType = { [Op.eq]: noteType };
      }
      if (title) {
        filters.title = { [Op.like]: `%${title}%` };
      }
      if (content) {
        filters.content = { [Op.like]: `%${content}%` };
      }
      if (dateFrom) {
        filters.updatedAt = {
          ...filters.updatedAt,
          [Op.gte]: new Date(dateFrom),
        };
      }
      if (dateTo) {
        filters.updatedAt = {
          ...filters.updatedAt,
          [Op.lte]: new Date(dateTo),
        };
      }

      const notes = await NoteRepository.findByUserIdAndFilters(
        userId,
        filters
      );

      return notes;
    } catch (error) {
      logger.log(`Error fetching notes for user ${userId}: ${error.message}`);
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }
  },

  //Get a single note of the validated user with the specified noteId
  getNoteById: async (noteId, userId) => {
    try {
      logger.log(`Fetching note with ID ${noteId} for user ${userId}`);
      return await NoteRepository.findByIdAndUserId(noteId, userId);
    } catch (error) {
      logger.log(
        `Error fetching note ${noteId} for user ${userId}: ${error.message}`
      );
      throw new Error(`Failed to fetch note  ${error.message}`);
    }
  },

  /*Create a new note and invalidate notes cache for data consistency with DB for data consistency with DB
  in the getNotesByUser calls (which rely on notes cache) */
  createNote: async (noteData) => {
    try {
      logger.log(
        `Creating note for user ${noteData.userId} of type ${noteData.noteType}`
      );
      const note = await NoteFactory.createNote(noteData);
      await redisClient.del(`user:${noteData.userId}:notes`);
      return note;
    } catch (error) {
      logger.log(
        `Error creating note for user ${noteData.userId}: ${error.message}`
      );
      throw new Error(`Failed to create note: ${error.message}`);
    }
  },

  /*Update a single note of the validated user with the specified noteId and invalidate the notes cache for data consistency with DB
  in the getNotesByUser calls (which rely on notes cache)*/
  updateNote: async (noteId, userId, updatedData) => {
    try {
      logger.log(`Updating note ${noteId} for user ${userId}`);

      if (!Object.values(NoteType).includes(updatedData.noteType)) {
        const errorMessage = `Invalid note type provided: ${
          updatedData.noteType
        }. Must be one of the following: [${Object.values(NoteType).join(
          ", "
        )}]`;
        logger.log(errorMessage);
        throw new Error(errorMessage);
      }

      await NoteRepository.updateNote(noteId, { ...updatedData, userId });

      await redisClient.del(`user:${userId}:notes`);

      return { message: "Note updated successfully" };
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        logger.log(
          `A ${updatedData.noteType} note with title '${updatedData.title}' already exists.`
        );
        throw new Error(
          `A ${updatedData.noteType} note with title '${updatedData.title}' already exists.`
        );
      }
      logger.log(
        `Error updating note ${noteId} for user ${userId}: ${error.message}`
      );
      throw new Error(
        `Failed to update note with ID ${noteId} for user ${userId}: ${error.message}`
      );
    }
  },

  /*
  Update a single note of the validated user with the specified noteId and invalidate the notes cache for data consistency with DB
  in the getNotesByUser calls (which rely on notes cache)
  */
  deleteNote: async (noteId, userId) => {
    try {
      logger.log(`Deleting note ${noteId} for user ${userId}`);
      await NoteRepository.deleteNote(noteId);

      await redisClient.del(`user:${userId}:notes`);

      return { message: "Note deleted successfully" };
    } catch (error) {
      logger.log(
        `Error deleting note ${noteId} for user ${userId}: ${error.message}`
      );
      throw new Error(
        `Failed to delete note with ID ${noteId} for user ${userId}: ${error.message}`
      );
    }
  },
};

module.exports = NoteService;
