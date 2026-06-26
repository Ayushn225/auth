import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

const requiredEnvs = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_FROM'];

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.warn(`Missing email environment variable: ${env}`);
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || '"Auth App" <noreply@example.com>',
    to,
    subject,
    html,
  });
};
