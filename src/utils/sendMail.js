import nodemailer from "nodemailer";

import { SMTP } from "../constants/indexConstants.js";
import { env } from "../utils/env.js";

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});

const sendMail = async (options) => {
  await transporter.sendMail(options);
};

export default sendMail;
