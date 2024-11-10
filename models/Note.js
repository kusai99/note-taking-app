const { DataTypes } = require("sequelize");
const sequelize = require("../config/Database");
const User = require("./User");

//Note Model with all the necessary database fields
const Note = sequelize.define(
  "Note",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
    },
    noteType: {
      type: DataTypes.ENUM("personal", "work"),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    /*composite index on "userId", "title", "noteType" since there is a frequent check on the uniqueness of 
    the request's "userId", "title", "noteType" combination in create and update requests.
    */
    indexes: [
      {
        unique: true,
        fields: ["userId", "title", "noteType"],
        name: "userId_title_noteType_unique",
      },
    ],
  }
);

//one to many relationship with User table using userId as a foreign key.
User.hasMany(Note, { foreignKey: "userId" });
Note.belongsTo(User, { foreignKey: "userId" });

module.exports = Note;
