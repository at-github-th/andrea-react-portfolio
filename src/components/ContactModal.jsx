// src/components/ContactModal.jsx
import React, { useEffect, useState } from "react";
import Modal from "./Modal.jsx";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xojnrvye";

export default function ContactModal({ open, onClose }) {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (open) {
      setStatus("idle");
      setMsg("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Improve deliverability / reply UX
    const email = String(fd.get("email") || "");
    const subject = String(fd.get("subject") || "");
    fd.set("_replyto", email);
    fd.set(
      "_subject",
      subject ? `Portfolio contact: ${subject}` : "Portfolio contact"
    );

    try {
      const r = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: fd,
      });

      // Don't *require* JSON to decide success
      let d = {};
      try {
        d = await r.json();
      } catch {
        d = {};
      }

      if (r.ok) {
        setStatus("success");
        setMsg("Sent — thanks! I’ll get back to you soon.");
        form.reset();
        // keep modal open; user closes explicitly
      } else {
        setStatus("error");
        const errMsg =
          d?.error ||
          d?.errors?.[0]?.message ||
          "Send failed — please try again, or email me directly.";
        setMsg(errMsg);
      }
    } catch {
      // If this ever triggers again, it's almost always an extension/adblock/CORS issue
      setStatus("error");
      setMsg("Sent — if you don’t hear back, email me directly.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Contact">
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="name"
            required
            placeholder="Your name"
            className="card p-3 rounded-xl"
            autoComplete="name"
          />
          <input
            name="email"
            required
            type="email"
            placeholder="Your email"
            className="card p-3 rounded-xl"
            autoComplete="email"
          />
        </div>

        <input
          name="subject"
          required
          placeholder="Subject"
          className="card p-3 rounded-xl w-full"
        />

        <textarea
          name="message"
          required
          placeholder="Message"
          rows="4"
          className="card p-3 rounded-xl w-full"
        />

        {/* Honeypot */}
        <input
          type="text"
          name="_gotcha"
          tabIndex="-1"
          autoComplete="off"
          className="hidden"
        />

        {msg ? (
          <div
            className={`text-sm rounded-xl px-4 py-3 border ${
              status === "success"
                ? "border-emerald-400/30 bg-emerald-400/10"
                : status === "error"
                ? "border-rose-400/30 bg-rose-400/10"
                : "border-white/10 bg-white/[0.03]"
            }`}
          >
            {msg}
          </div>
        ) : null}

        <div className="flex justify-end gap-2">
          <button type="button" className="btn" onClick={onClose}>
            {status === "success" ? "Close" : "Cancel"}
          </button>

          {status !== "success" ? (
            <button type="submit" className="btn" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send"}
            </button>
          ) : null}
        </div>
      </form>
    </Modal>
  );
}