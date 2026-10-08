const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    salesperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    project: {
      type: String,
      default: "",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "GangaLead",
  leadSchema,
  "ganga_leads"
);