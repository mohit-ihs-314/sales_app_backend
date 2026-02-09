const express = require("express");
const {
  protect,
  adminOnly,
  salesOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ANY LOGGED-IN USER
router.get("/protected", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// ADMIN ONLY
router.get("/admin", protect, adminOnly, (req, res) => {
  res.json({
    message: "Admin route accessed",
    admin: req.user,
  });
});

// SALES ONLY
router.get("/sales", protect, salesOnly, (req, res) => {
  res.json({
    message: "Sales route accessed",
    sales: req.user,
  });
});

module.exports = router;
