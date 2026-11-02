const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'anda@gmail.com',
    pass: process.env.SMTP_PASS || 'nqzmldpjubfnksvu'
  }
});

// Laluan Health Check untuk Fly.io (Penting untuk elak ralat)
app.get('/', (req, res) => {
  res.status(200).send('API Pelayan Norlee Legacy Aktif!');
});

app.post('/send-otp', async (req, res) => {
  const { email, otp } = req.body;
  const mailOptions = {
    from: process.env.SMTP_USER || 'anda@gmail.com',
    to: email,
    subject: 'Kod Pengesahan OTP Anda',
    text: `Kod OTP anda ialah: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'OTP berjaya dihantar!' });
  } catch (error) {
    console.error('Ralat hantar emel:', error);
    res.status(500).json({ success: false, error: error.toString() });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Pelayan sedang berjalan di port ${PORT}`);
});
