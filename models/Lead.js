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
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    project: {
      type: String,
    },

    notes: {
      type: String,
    },

    rm: {
      type: String, // event invite RM
    },

    leadType: {
      type: String,
      enum: ["walkin", "event"],
      default: "walkin",
    },

    photo: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "new",
        "called",
        "visited",
        "follow_up",
        "refused",
        "converted",
      ],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "InvestorLead",
  leadSchema,
  "investor_leads_01_10_2026"
);