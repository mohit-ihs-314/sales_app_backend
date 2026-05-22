const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    salesperson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    clientName: String,
    phone: String,
    email: String,
    project: String,
    notes: String,
    photo: String,

    status: {
      type: String,
      default: "New",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "LamboLead",
  leadSchema,
  "lambo_leads"
);