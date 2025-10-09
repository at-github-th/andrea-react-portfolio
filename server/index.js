import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import { z } from "zod";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "200kb" }));
app.use(rateLimit({ windowMs: 60_000, max: 30 }));

const {
  SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS,
  MAIL_FROM, MAIL_TO, TURNSTILE_SECRET
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST, port: Number(SMTP_PORT||0)||587, secure: SMTP_SECURE==="1",
  auth: { user: SMTP_USER, pass: SMTP_PASS }
});

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(3),
  captchaToken: z.string().optional()
});

app.get("/api/health", (_req,res)=>res.json({ ok:true }));

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message, captchaToken } = schema.parse(req.body);

    if (TURNSTILE_SECRET) {
      const body = new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: captchaToken || "",
        remoteip: req.ip || ""
      });
      const vf = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      });
      const vd = await vf.json().catch(()=>({ success:false }));
      if (!vd.success) return res.status(400).json({ ok:false, error:"CAPTCHA_FAILED" });
    }

    await transporter.sendMail({
      from: MAIL_FROM, to: MAIL_TO, replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g,"<br>")}</p>`
    });

    return res.json({ ok:true });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ ok:false, error:"SEND_FAILED" });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, ()=>console.log(`Server listening on ${port}`));
