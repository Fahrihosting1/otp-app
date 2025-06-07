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

app.get("/api/send-email", async (req, res) => {
  const { to, from_email, from_pass, subject, text } = req.query;

  if (!to || !from_email || !from_pass || !subject || !text) {
    return res.status(400).json({ success: false, error: "Semua query harus diisi" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: from_email,
      pass: from_pass
    }
  });

  try {
    await transporter.sendMail({
      from: `"${from_email}" <${from_email}>`,
      to,
      subject,
      text
    });

    res.json({ success: true, message: "Email berhasil dikirim dari URL" });
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
