const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;
const otpStore = {};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve HTML

// Konfigurasi email Gmail (gunakan App Password, bukan password biasa)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fahrialiff51@gmail.com", // GANTI DENGAN EMAILMU
    pass: "ekjx aazf skcu ieur"      // GANTI DENGAN APP PASSWORD (BUKAN PASSWORD EMAIL BIASA)
  }
});

// Kirim OTP
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, error: "Email kosong" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  try {
    await transporter.sendMail({
      from: `"OTP Service" <fahrialiff51@gmail.com>`,
      to: email,
      subject: "Kode OTP Anda",
      text: `Kode OTP Anda adalah: ${otp}`
    });
    res.json({ success: true, message: "OTP dikirim" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verifikasi OTP
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] === otp) {
    delete otpStore[email];
    res.json({ success: true, message: "OTP valid" });
  } else {
    res.status(400).json({ success: false, message: "OTP tidak valid" });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
