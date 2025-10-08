import React, { useEffect, useState } from "react";

export default function ContactModal({ open, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState(null);

  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await r.json().catch(() => ({}));
      setOk(Boolean(data?.ok));
      if (data?.ok) setTimeout(() => onClose?.(), 800);
    } catch (_) {
      setOk(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="relative w-[92vw] max-w-md rounded-2xl bg-slate-900/95 border border-white/10 p-6">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full px-2 leading-none text-xl border border-white/10 hover:bg-white/10"
        >
          ×
        </button>

        <h3 className="text-xl mb-4 tracking-widest">Say hello</h3>
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="name" placeholder="Name" required className="w-full rounded-lg bg-black/20 border border-white/10 p-2" />
          <input name="email" type="email" placeholder="Email" required className="w-full rounded-lg bg-black/20 border border-white/10 p-2" />
          <input name="subject" placeholder="Subject" required className="w-full rounded-lg bg-black/20 border border-white/10 p-2" />
          <textarea name="message" placeholder="Message" rows={5} required className="w-full rounded-lg bg-black/20 border border-white/10 p-2" />
          <button disabled={submitting} className="w-full rounded-lg border border-white/10 hover:bg-white/10 py-2">
            {submitting ? "Sending…" : "Send message"}
          </button>
          {ok === true && <p className="text-emerald-400 text-sm">Sent — thanks!</p>}
          {ok === false && <p className="text-rose-400 text-sm">Send failed — try again.</p>}
        </form>
      </div>
    </div>
  );
}
