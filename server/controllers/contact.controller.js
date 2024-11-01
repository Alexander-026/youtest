import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user:  process.env.SMTP_USER,
    pass:  process.env.SMTP_PASS,
  },
  secure: true
});

const sendEmail = async (req, res, next) => {
  try {
    const { fullName, email, text } = req.body;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "Sending Email using Node.js",
      text: `
              fullName: ${fullName}
              email: ${email} 
              text: ${text}
            `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ message: "Ошибка при отправке сообщения" });
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({ message: "Ваше сообщение отправлено" });
      }
    });
   
  } catch (error) {
    next(error);
  }
};


export {sendEmail}
