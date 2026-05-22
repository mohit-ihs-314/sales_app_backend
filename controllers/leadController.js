const OmaxeLead = require("../models/OmaxeLead");
const LamboLead = require("../models/LamboLead");
const InvestorLead = require("../models/InvestorLead");
const cloudinary = require("../config/cloudinary");

// CREATE LEAD (SALES)
exports.createLead = async (req, res) => {
  try {

    const {
      clientName,
      phone,
      email,
      project,
      notes,
      eventType
    } = req.body;

    let LeadModel;

    if (eventType === "omaxe") {
      LeadModel = OmaxeLead;
    } else if (eventType === "lambo") {
      LeadModel = LamboLead;
    } else {
      LeadModel = InvestorLead;
    }

    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "leads",
      }
    );

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

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL LEADS (ADMIN)
exports.getAllLeads = async (req, res) => {
  const leads = await Lead.find()
    .populate("salesperson", "name email")
    .sort({ createdAt: -1 });

  res.json(leads);
};

// GET MY LEADS (SALES)
exports.getMyLeads = async (req, res) => {
  const leads = await Lead.find({ salesperson: req.user._id }).sort({
    createdAt: -1,
  });

  res.json(leads);
};

// UPDATE LEAD STATUS (ADMIN)
exports.updateLeadStatus = async (req, res) => {
  const { status } = req.body;

  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  lead.status = status;
  await lead.save();

  res.json(lead);
};

exports.deleteLead = async (req, res) => {

  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    return res.status(404).json({ message: "Lead not found" });
  }

  await lead.deleteOne();

  res.json({ message: "Lead deleted" });
};