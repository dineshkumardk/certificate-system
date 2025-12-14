require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const generateCertificate = require("./utils/generateCertificate");
const sendEmail = require("./utils/sendEmail");

const app = express();

/* ======================
   MIDDLEWARES
====================== */
app.use(cors({
  origin: "http://localhost:5173" // React frontend
}));
app.use(express.json());

/* ======================
   ENSURE FOLDERS EXIST
====================== */
fs.mkdirSync(path.join(__dirname, "generated", "certificates"), {
  recursive: true
});

/* ======================
   API ROUTE
====================== */
app.post("/generate-certificate", async (req, res) => {
  try {
    const {
      name,
      email,
      gst,
      businessName,
      businessAddress
    } = req.body;

    if (!name || !email || !gst) {
      return res.status(400).json({
        message: "Name, Email and GST are required"
      });
    }

    // 1️⃣ Generate certificate (JPG + PDF)
    const files = await generateCertificate({
      name,
      gst,
      businessName,
      businessAddress
    });

    // 2️⃣ Send email with attachments
    await sendEmail(email, files);

    return res.status(200).json({
      message: "Certificate generated and emailed successfully"
    });

  } catch (error) {
    console.error("ERROR:", error);
    return res.status(500).json({
      message: "Failed to generate or send certificate"
    });
  }
});

/* ======================
   SERVER START
====================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});