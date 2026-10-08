const OmaxeLead = require("../models/OmaxeLead");
const LamboLead = require("../models/LamboLead");
const LoftLead = require("../models/loftLead");
const InvestorLead = require("../models/InvestorLead");
const GangaLead = require("../models/gangaLead");

const cloudinary = require("../config/cloudinary");

// ============================================================
// GET MODEL
// ============================================================

const getLeadModel = (eventType) => {
  switch (eventType) {
    case "omaxe":
      return OmaxeLead;

    case "lambo":
      return LamboLead;

    case "loft":
      return LoftLead;

    case "ganga":
      return GangaLead;

    case "investor":
    default:
      return InvestorLead;
  }
};

// ============================================================
// CREATE LEAD
// ============================================================

exports.createLead = async (req, res) => {
  try {
    const {
      clientName,
      phone,
      email,
      project,
      notes,
      eventType,
    } = req.body;

    console.log("=================================");
    console.log("CREATE LEAD");
    console.log("Event Type:", eventType);
    console.log("Client:", clientName);
    console.log("Phone:", phone);
    console.log("=================================");

    const LeadModel = getLeadModel(eventType);

    // ========================================================
    // VALIDATION
    // ========================================================

    if (!clientName || !phone) {
      return res.status(400).json({
        message: "Client name & phone required",
      });
    }

    // ========================================================
    // PHOTO VALIDATION
    // Investor does NOT require photo
    // Ganga DOES require photo
    // Other events also require photo
    // ========================================================

    if (eventType !== "investor" && !req.file) {
      return res.status(400).json({
        message: "Photo is required",
      });
    }

    // ========================================================
    // CLOUDINARY UPLOAD
    // ========================================================

    let photoUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        req.file.path,
        {
          folder: "leads",
        }
      );

      photoUrl = result.secure_url;

      console.log("Cloudinary photo:", photoUrl);
    }

    // ========================================================
    // SAVE LEAD
    // ========================================================

    const lead = await LeadModel.create({
      salesperson: req.user._id,

      clientName,
      phone,
      email: email || "",
      project: project || "",
      notes: notes || "",

      photo: photoUrl,

      status: "New",
    });

    console.log("Lead created:", lead._id);

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(201).json(lead);

  } catch (error) {
    console.error("CREATE LEAD ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ============================================================
// GET ALL LEADS
// ============================================================

exports.getAllLeads = async (req, res) => {
  try {
    const { eventType } = req.query;

    const LeadModel = getLeadModel(eventType);

    const leads = await LeadModel.find()
      .populate(
        "salesperson",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    return res.json(leads);

  } catch (error) {
    console.error("GET ALL LEADS ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ============================================================
// GET MY LEADS
// ============================================================

exports.getMyLeads = async (req, res) => {
  try {
    const { eventType } = req.query;

    const LeadModel = getLeadModel(eventType);

    const leads = await LeadModel.find({
      salesperson: req.user._id,
    }).sort({
      createdAt: -1,
    });

    return res.json(leads);

  } catch (error) {
    console.error("GET MY LEADS ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ============================================================
// UPDATE STATUS
// ============================================================

exports.updateLeadStatus = async (req, res) => {
  try {
    const {
      status,
      eventType,
    } = req.body;

    const LeadModel = getLeadModel(eventType);

    const lead = await LeadModel.findById(
      req.params.id
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    lead.status = status;

    await lead.save();

    return res.json(lead);

  } catch (error) {
    console.error("UPDATE STATUS ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// ============================================================
// DELETE LEAD
// ============================================================

exports.deleteLead = async (req, res) => {
  try {
    const { eventType } = req.query;

    const LeadModel = getLeadModel(eventType);

    const lead = await LeadModel.findById(
      req.params.id
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    await lead.deleteOne();

    return res.json({
      message: "Lead deleted",
    });

  } catch (error) {
    console.error("DELETE LEAD ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};