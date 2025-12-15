const fs = require("fs");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (toEmail, files) => {
  try {
    // Safety checks
    if (!fs.existsSync(files.pdfPath)) {
      throw new Error("PDF not found: " + files.pdfPath);
    }
    if (!fs.existsSync(files.jpgPath)) {
      throw new Error("Image not found: " + files.jpgPath);
    }

    await resend.emails.send({
      from: `Certificate System <${process.env.RESEND_FROM_EMAIL}>`,
      to: toEmail,
      subject: "Your Business Certificate",
      text: "Please find your certificate attached.",
      attachments: [
        {
          filename: "certificate.jpg",
          content: fs.readFileSync(files.jpgPath),
        },
        {
          filename: "certificate.pdf",
          content: fs.readFileSync(files.pdfPath),
        },
      ],
    });

    console.log("✅ Email sent successfully via RESEND");
  } catch (error) {
    console.error("❌ RESEND Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;