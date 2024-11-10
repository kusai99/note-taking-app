const Note = require("../models/Note");

//Class to handle data access
const NoteRepository = {
  findByUserIdAndFilters: async (userId, filters) => {
    const searchFilters = {
      userId,
      ...filters,
    };
    return Note.findAll({
      where: searchFilters,
    });
  },
  findByUserId: (userId) => Note.findAll({ where: { userId } }),
  findByIdAndUserId: (noteId, userId) =>
    Note.findOne({ where: { id: noteId, userId } }),
  createNote: (noteData) => Note.create(noteData),
  updateNote: (noteId, updatedData) =>
    Note.update(updatedData, { where: { id: noteId } }),
  deleteNote: (noteId) => Note.destroy({ where: { id: noteId } }),
};

module.exports = NoteRepository;
