const express = require("express");
const {
  createLead,
  getAllLeads,
  getMyLeads,
  updateLeadStatus,
} = require("../controllers/leadController");

const { protect, adminOnly, salesOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// SALES
router.post("/", protect, salesOnly, upload.single("photo"), createLead);
router.get("/my", protect, salesOnly, getMyLeads);

// ADMIN
router.get("/", protect, adminOnly, getAllLeads);
router.put("/:id/status", protect, adminOnly, updateLeadStatus);

module.exports = router;
