const OmaxeLead = require("../models/OmaxeLead");
const LamboLead = require("../models/LamboLead");
const InvestorLead = require("../models/InvestorLead");
const cloudinary = require("../config/cloudinary");

// ================= GET MODEL =================

const getLeadModel = (eventType) => {

  if (eventType === "omaxe") {
    return OmaxeLead;
  }

  if (eventType === "lambo") {
    return LamboLead;
  }

  return InvestorLead;
};

// ================= CREATE LEAD =================

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

    const LeadModel =
        getLeadModel(eventType);

    // ================= VALIDATION =================

    if (!clientName || !phone) {

      return res.status(400).json({
        message:
            "Client name & phone required",
      });
    }

    if (!req.file) {

      return res.status(400).json({
        message: "Photo is required",
      });
    }

    // ================= CLOUDINARY =================

    const result =
        await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "leads",
      },
    );

    // ================= SAVE =================

    const lead = await LeadModel.create({

      salesperson: req.user._id,

      clientName,
      phone,
      email,
      project,
      notes,

      photo: result.secure_url,
    });

    res.status(201).json(lead);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ALL LEADS =================

exports.getAllLeads = async (
  req,
  res,
) => {

  try {

    const { eventType } = req.query;

    const LeadModel =
        getLeadModel(eventType);

    const leads =
        await LeadModel.find()

      .populate(
        "salesperson",
        "name email",
      )

      .sort({
        createdAt: -1,
      });

    res.json(leads);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET MY LEADS =================

exports.getMyLeads = async (
  req,
  res,
) => {

  try {

    const { eventType } = req.query;

    const LeadModel =
        getLeadModel(eventType);

    const leads =
        await LeadModel.find({
      salesperson: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(leads);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= UPDATE STATUS =================

exports.updateLeadStatus =
    async (req, res) => {

  try {

    const { status, eventType } =
        req.body;

    const LeadModel =
        getLeadModel(eventType);

    const lead =
        await LeadModel.findById(
      req.params.id,
    );

    if (!lead) {

      return res.status(404).json({
        message: "Lead not found",
      });
    }

    lead.status = status;

    await lead.save();

    res.json(lead);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE LEAD =================

exports.deleteLead = async (
  req,
  res,
) => {

  try {

    const { eventType } = req.query;

    const LeadModel =
        getLeadModel(eventType);

    const lead =
        await LeadModel.findById(
      req.params.id,
    );

    if (!lead) {

      return res.status(404).json({
        message: "Lead not found",
      });
    }

    await lead.deleteOne();

    res.json({
      message: "Lead deleted",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};