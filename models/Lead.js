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

    rm: {
      type: String,
      default: "",
    },

    leadType: {
      type: String,
      enum: ["walkin", "event"],
      default: "event",
    },

    // IHS leads do NOT require a photo
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

// IMPORTANT:
// Explicitly use the new collection.
const InvestorLead = mongoose.model(
  "InvestorLead",
  leadSchema,
  "investor_leads_01_10_2026"
);

// Debug: confirms which MongoDB collection is being used
console.log(
  "InvestorLead MongoDB collection:",
  InvestorLead.collection.name
);

module.exports = InvestorLead;