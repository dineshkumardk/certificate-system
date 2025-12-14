const nodemailer = require("nodemailer");

const sendEmail = async (toEmail, files) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Certificate System" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Business Certificate",
    text: `
Dear User,

Please find attached your business certificate in both JPG and PDF formats.

Regards,
Certificate System
`,
    attachments: [
      {
        filename: "certificate.jpg",
        path: files.jpgPath
      },
      {
        filename: "certificate.pdf",
        path: files.pdfPath
      }
    ]
  });
};

module.exports = sendEmail;