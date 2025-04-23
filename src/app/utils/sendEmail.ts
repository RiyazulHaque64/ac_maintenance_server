import nodemailer from "nodemailer";
import config from "../config";
const sendEmail = async (receiverEmail: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.dreamestate_email,
      pass: config.email_app_pass,
    },
  });

  const info = await transporter.sendMail({
    from: `${config.app_name} <${config.dreamestate_email}>`,
    to: receiverEmail,
    subject: `${config.app_name}- Password Reset OTP`,
    html,
  });

  return info;
};

export default sendEmail;
