const jwt = require("jsonwebtoken");
const User = require("../models/User");

// PROTECT ROUTES (JWT REQUIRED)
exports.protect = async (req, res, next) => {
  let token;

  // CHECK AUTH HEADER
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // VERIFY TOKEN
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // GET USER (WITHOUT PASSWORD)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// ADMIN ONLY
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

// SALES ONLY
exports.salesOnly = (req, res, next) => {
  if (req.user && req.user.role === "sales") {
    next();
  } else {
    res.status(403).json({ message: "Sales access only" });
  }
};
