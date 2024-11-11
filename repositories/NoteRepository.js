const Note = require("../models/Note");

// Find notes by userId and filters
async function findByUserIdAndFilters(userId, filters) {
  const searchFilters = { userId, ...filters };
  try {
    return await Note.findAll({ where: searchFilters });
  } catch (error) {
    throw new Error(`Error in findByUserIdAndFilters: ${error.message}`);
  }
}

// Find notes by userId
async function findByUserId(userId) {
  try {
    return await Note.findAll({ where: { userId } });
  } catch (error) {
    throw new Error(`Error in findByUserId: ${error.message}`);
  }
}

// Find note by noteId and userId
async function findByIdAndUserId(noteId, userId) {
  try {
    return await Note.findOne({ where: { id: noteId, userId } });
  } catch (error) {
    throw new Error(`Error in findByIdAndUserId: ${error.message}`);
  }
}

// Create a new note
async function createNote(noteData) {
  try {
    return await Note.create(noteData);
  } catch (error) {
    throw new Error(`Error in createNote: ${error.message}`);
  }
}

// Update an existing note
async function updateNote(noteId, updatedData) {
  try {
    return await Note.update(updatedData, { where: { id: noteId } });
  } catch (error) {
    throw new Error(`Error in updateNote: ${error.message}`);
  }
}

// Delete a note
async function deleteNote(noteId) {
  try {
    return await Note.destroy({ where: { id: noteId } });
  } catch (error) {
    throw new Error(`Error in deleteNote: ${error.message}`);
  }
}

// Export all functions
module.exports = {
  findByUserIdAndFilters,
  findByUserId,
  findByIdAndUserId,
  createNote,
  updateNote,
  deleteNote,
};
