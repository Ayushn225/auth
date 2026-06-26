import Nodemailer from 'nodemailer';

// 1. Configure the transporter to point to Mailtrap
const transport = Nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "fb49c28cf4e5f8", // Paste your string from Step 2
    pass: "996db0268c12ec"  // Paste your string from Step 2
  }
});

// 2. Define the email payload
const mailOptions = {
  from: '"Practice Auth" <security@practiceauth.com>',
  to: 'any-user@example.com', // This doesn't need to be real! Mailtrap catches it anyway.
  subject: 'Test: Your 2FA Verification Code',
  html: `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Testing Mailtrap Setup</h2>
      <p>Your practice auth confirmation code is:</p>
      <h1 style="color: #4F46E5;">992 481</h1>
    </div>
  `
};

// 3. Send the email
async function runTest() {
  try {
    console.log("Sending email via Mailtrap...");
    const info = await transport.sendMail(mailOptions);
    console.log("Success! Message sent ID:", info.messageId);
    console.log("Go check your Mailtrap dashboard dashboard inbox!");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

runTest();