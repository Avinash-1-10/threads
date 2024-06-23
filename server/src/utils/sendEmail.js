import transporter from "../services/email.js";

const sendEmail = async (email, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to: email,
      subject,
      text,
    });
  } catch (error) {
    console.error("Error in sendEmail: ", error.message);
  }
};

export default sendEmail;
