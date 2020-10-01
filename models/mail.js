const nodemailer = require("nodemailer");
const config = require("config");
const transporter = nodemailer.createTransport({
  // service: config.get("myEmailService"),
  service: "gmail",
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "rameshwarik2@gmail.com",
    pass:" Rameshwari@111"
    // user: config.get("myEmail"),
    // pass: config.get("myEmailPassword")
  }
});
exports.transporter = transporter;
