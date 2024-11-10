const { body, param } = require("express-validator");
const NoteType = require("../types/NoteType");

class NoteValidation {
  static createOrUpdateNoteValidation() {
    const noteTypeValues = Object.values(NoteType).join(", ");
    return [
      //Validate that the note Type in the request body is one of the note Types in the NoteType enum
      body("noteType")
        .isIn(Object.values(NoteType))
        .withMessage(
          `noteType must be one of the following: [${noteTypeValues}]`
        ),

      //Validate note title length
      body("title")
        .isString()
        .isLength({ max: 100 })
        .withMessage("Title must be a maximum of 100 characters"),
      //Validate content data type
      body("content")
        .optional({ nullable: true })
        .isString()
        .withMessage("Content must be a string or null"),
    ];
  }

  //Validate that the provided note ID is an integer
  static validateNoteId() {
    return [
      param("id").isInt({ gt: 0 }).withMessage("ID must be a positive integer"),
    ];
  }
}

module.exports = NoteValidation;
