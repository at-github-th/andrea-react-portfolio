import React, { useEffect, useRef, useState } from "react";
import Modal from "./Modal.jsx";

export default function ContactModal({ open, onClose }){
  const siteKey = import.meta.env.VITE_TURNSTILE_SITEKEY || "";
  const widgetRef = useRef(null);
  const [token, setToken] = useState("");

  useEffect(()=>{
    if (!open) return;
    if (!siteKey) return; // no-op if not configured
    if (!window.turnstile) {
      const s = document.createElement("script");
      s.src="https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true; s.defer = true;
      s.onload = render; document.head.appendChild(s);
    } else { render(); }
    function render(){
      if (!widgetRef.current) return;
      if (widgetRef.current.dataset.rendered) return;
      widgetRef.current.dataset.rendered = "1";
      window.turnstile.render(widgetRef.current, {
        sitekey: siteKey,
        callback: (t)=>setToken(t),
        "error-callback": ()=>setToken(""),
        "expired-callback": ()=>setToken("")
      });
    }
  },[open, siteKey]);

  const onSubmit = async (e)=>{
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    if (token) payload.captchaToken = token;
    const r = await fetch("/api/contact", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    });
    const d = await r.json().catch(()=>({ok:false}));
    if (d.ok) onClose?.(); else alert("Send failed — try again or email me directly.");
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Contact">
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="name" required placeholder="Your name" className="card p-3 rounded-xl" />
          <input name="email" required type="email" placeholder="Your email" className="card p-3 rounded-xl" />
        </div>
        <input name="subject" required placeholder="Subject" className="card p-3 rounded-xl w-full" />
        <textarea name="message" required placeholder="Message" rows="4" className="card p-3 rounded-xl w-full"></textarea>

        {siteKey ? (<div ref={widgetRef} className="cf-turnstile my-2" />) : null}

        <div className="flex justify-end gap-2">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn">Send</button>
        </div>
      </form>
    </Modal>
  );
}
