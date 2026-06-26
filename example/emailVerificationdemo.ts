const verificationToken = "XYZ123456789"; // A unique token generated for this user
const verificationLink = `http://localhost:5000/verify-email?token=${verificationToken}`;

const mailOptions = {
  from: 'security@yourapp.com',
  to: user.email,
  subject: 'Verify Email',
  html: `<a href="${verificationLink}">Click here to verify your account</a>`
};