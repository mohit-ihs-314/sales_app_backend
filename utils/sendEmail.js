const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"Investor Home Solutions" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT SUCCESSFULLY");
  } catch (err) {
    console.log("EMAIL ERROR:", err);
  }
};

module.exports = sendEmail;
