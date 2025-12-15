const fs = require("fs");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (toEmail, files) => {
  try {
    const msg = {
      to: toEmail,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: "Certificate System",
      },
      subject: "Your Business Certificate",
      text: "Please find your certificate attached.",
      attachments: [
        {
          content: fs.readFileSync(files.jpgPath).toString("base64"),
          filename: "certificate.jpg",
          type: "image/jpeg",
          disposition: "attachment",
        },
        {
          content: fs.readFileSync(files.pdfPath).toString("base64"),
          filename: "certificate.pdf",
          type: "application/pdf",
          disposition: "attachment",
        },
      ],
    };

    await sgMail.send(msg);
    console.log("✅ Email sent successfully via SendGrid");
  } catch (error) {
    console.error("❌ SendGrid Email Error:", error.response?.body || error);
    throw error;
  }
};

module.exports = sendEmail;