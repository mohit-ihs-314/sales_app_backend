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

    // FORCE COLLECTION
    collection: "investor_leads_01_10_2026",
  }
);

// Use a unique model name so there can be NO collision
const InvestorLead = mongoose.model(
  "InvestorLead2026",
  leadSchema
);

console.log(
  "🔥 INVESTOR MODEL COLLECTION:",
  InvestorLead.collection.name
);

module.exports = InvestorLead;