import nodemailer from 'nodemailer';

// Function to handle sending the email
export const sendAdminAccessRequest = async (req, res) => {
  const { name, email, role, reason } = req.body;
  // console.log(process.env.EMAIL_USER, process.env.RECIPIENT_EMAIL);

  // Configure the transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  

  // Email content and recipient details
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECIPIENT_EMAIL,
    subject: 'Admin Access Request',
    text: `
      Admin Access Request:
      Name: ${name}
      Email: ${email}
      Role: ${role}
      Reason: ${reason}
    `,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Request sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending request' });
  }
};
