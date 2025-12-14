const nodemailer = require("nodemailer");

const sendEmail = async (toEmail, files) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // ✅ SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // 16-char app password (NO SPACES)
      }
    });

    await transporter.verify(); // must pass

    await transporter.sendMail({
      from: `"Certificate System" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Business Certificate",
      text: "Please find your certificate attached.",
      attachments: [
        { path: files.jpgPath },
        { path: files.pdfPath }
      ]
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email error:", error);
    throw error;
  }
};

module.exports = sendEmail;