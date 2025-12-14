const nodemailer = require("nodemailer");

const sendEmail = async (toEmail, files) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // APP PASSWORD (NO SPACES)
      }
    });

    // 🔑 VERY IMPORTANT for Render
    await transporter.verify();

    await transporter.sendMail({
      from: `"Certificate System" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Business Certificate",
      text: `Dear User,

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

    console.log("✅ Email sent successfully to:", toEmail);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error; // important so server.js can respond properly
  }
};

module.exports = sendEmail;