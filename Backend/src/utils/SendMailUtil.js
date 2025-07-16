import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (to,subject,text,html,attachments) => {
    try {
        const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        text,
        html,
        attachments,
        };
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        throw new ApiError(500, "Failed to send email");
    }
}

export {sendMail}

