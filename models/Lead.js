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
    photo: {
      type: String, // Cloudinary URL
      required: true,
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
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);
