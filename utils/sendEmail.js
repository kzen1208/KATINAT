const nodemailer = require('nodemailer');
const config = require('../config/config');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: config.EMAIL_SERVICE,
    auth: {
      user: config.EMAIL_USERNAME,
      pass: config.EMAIL_PASSWORD
    }
  });

  // Define email options
  const mailOptions = {
    from: `${config.EMAIL_FROM} <${config.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);

  console.log(`Message sent: ${info.messageId}`);
};

module.exports = sendEmail;