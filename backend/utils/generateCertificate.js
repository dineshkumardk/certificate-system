const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");
const PDFDocument = require("pdfkit");

/* =========================
   REGISTER FONT (CRITICAL)
========================= */
registerFont(
  path.join(__dirname, "../fonts/Roboto-Regular.ttf"),
  { family: "Roboto" }
);

/* =========================
   WRAP LONG ADDRESS
========================= */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}

async function generateCertificate({
  name,
  businessName,
  gst,
  businessAddress
}) {
  const width = 1200;
  const height = 800;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  /* =========================
     BACKGROUND IMAGE
  ========================= */
  const bg = await loadImage(
    path.join(__dirname, "../templates/certificate-bg.png")
  );
  ctx.drawImage(bg, 0, 0, width, height);

  ctx.fillStyle = "#2b2b2b";
  ctx.textAlign = "center";

  /* =========================
     NAME
  ========================= */
  ctx.font = "bold 46px Roboto";
  ctx.fillText(name, width / 2, 340);

  /* =========================
     BUSINESS NAME
  ========================= */
  ctx.font = "bold 28px Roboto";
  ctx.fillText(businessName, width / 2, 420);

  /* =========================
     GST
  ========================= */
  ctx.font = "22px Roboto";
  ctx.fillText(`GST Number: ${gst}`, width / 2, 460);

  /* =========================
     ADDRESS
  ========================= */
  ctx.font = "20px Roboto";
  wrapText(
    ctx,
    `Address: ${businessAddress}`,
    width / 2,
    495,
    720,
    28
  );

  /* =========================
     CERTIFICATE NO (LEFT)
  ========================= */
  ctx.textAlign = "left";
  ctx.font = "18px Roboto";

  const certificateNo =
    "CERT-" + Math.random().toString(36).substring(2, 7).toUpperCase();

  ctx.fillText("Certificate No.", 90, 720);
  ctx.fillText(certificateNo, 90, 745);

  /* =========================
     ISSUE DATE (RIGHT)
  ========================= */
  ctx.fillText("Issue Date:", width - 300, 720);
  ctx.fillText(
    new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }),
    width - 300,
    745
  );

  /* =========================
     SAVE FILES (CLOUD SAFE)
  ========================= */
  const outputDir = "/tmp/certificates";
  fs.mkdirSync(outputDir, { recursive: true });

  const fileName = `${Date.now()}_${name.replace(/\s+/g, "_")}`;
  const jpgPath = `${outputDir}/${fileName}.jpg`;
  const pdfPath = `${outputDir}/${fileName}.pdf`;

  fs.writeFileSync(jpgPath, canvas.toBuffer("image/jpeg"));

  const doc = new PDFDocument({ size: [width, height] });
  doc.pipe(fs.createWriteStream(pdfPath));
  doc.image(jpgPath, 0, 0, { width, height });
  doc.end();

  return { jpgPath, pdfPath };
}

module.exports = generateCertificate;