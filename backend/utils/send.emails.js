import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./email.templates.js";
import { apiInstance } from "./brevo.config.js";

export async function sendVerificationEmail(email, name, verificationToken) {
  const sendSmtpEmail = {
    to: [{ email, name }],
    sender: { name: "Shop Sphere", email: "shopsphereke@gmail.com" },
    subject: "Verify Your Email",
    htmlContent: VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    ),
    category: "verification",
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    throw new Error("Failed to send email:", error);
  }
}

export async function sendWelcomeEmail(email, name) {
  const sendSmtpEmail = {
    to: [{ email, name }],
    sender: { name: "Shop Sphere", email: "shopsphereke@gmail.com" },
    subject: "Welcome to Shop Sphere",
    htmlContent: WELCOME_EMAIL_TEMPLATE.replace("{name}", name).replace(
      "{loginUrl}",
      process.env.CLIENT_URL
    ),
    category: "welcome",
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
    throw new Error("Failed to send email:", error);
  }
}
