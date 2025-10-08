import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import { z } from "zod";

const app = express();
const PORT = 3001;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173"
}));

const limiter = rateLimit({
  windowMs: 60_000,
  max: 10,
});
app.use("/api/", limiter);

app.get("/api/health", (_req,res)=>res.json({ ok:true }));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: !!Number(process.env.SMTP_SECURE || 1),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(3),
  captchaToken: z.string().optional(),
});

app.post("/api/contact", async (req, res) => {
  try{
    const data = schema.parse(req.body);

    if(process.env.TURNSTILE_SECRET){
      const vf = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type":"application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.TURNSTILE_SECRET,
          response: data.captchaToken || "",
          remoteip: req.ip || ""
        })
      });
      const vd = await vf.json().catch(()=>({ success:false }));
      if(!vd.success) return res.status(400).json({ ok:false, error:"CAPTCHA_FAILED" });
    }

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      replyTo: data.email,
      subject: `[Portfolio] ${data.subject}`,
      text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
      html: `<p><strong>From:</strong> ${data.name} &lt;${data.email}&gt;</p><p>${data.message.replace(/\n/g,"<br>")}</p>`
    });

    return res.json({ ok:true });
  }catch(err){
    console.error(err);
    return res.status(400).json({ ok:false, error:"SEND_FAILED" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
