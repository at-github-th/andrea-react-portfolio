import React, { useState } from "react";

export default function ContactModal({ open, onClose }){
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [status, setStatus] = useState("idle"); // idle | sending | ok | err
  const disabled = status === "sending";

  if(!open) return null;

  const submit = async(e)=>{
    e.preventDefault();
    setStatus("sending");
    try{
      const res = await fetch("http://localhost:3001/api/contact", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify(form)
      });
      if(res.ok){ setStatus("ok"); }
      else { setStatus("err"); }
    }catch{
      setStatus("err");
    }
  };

  const banner = status==="ok" ? "Message sent — check your inbox." :
                 status==="err" ? "Send failed — try again or email me directly." :
                 status==="sending" ? "Sending…" : "";

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <button className="absolute right-6 top-6 text-white/70 hover:text-white" onClick={onClose}>✕</button>
      <form onSubmit={submit} className="card w-[min(680px,94vw)] p-6 space-y-3">
        <h3 className="text-xl tracking-[0.18em]">SAY HELLO TO ANDREA</h3>

        <input className="card px-3 py-2" placeholder="Your name…" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input className="card px-3 py-2" placeholder="Your email…" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/>
        <input className="card px-3 py-2" placeholder="Subject…" value={form.subject} onChange={e=>setForm({...form, subject:e.target.value})}/>
        <textarea rows={6} className="card px-3 py-2" placeholder="Your message…" value={form.message} onChange={e=>setForm({...form, message:e.target.value})}/>

        {!!banner && (
          <div className={`text-sm ${status==="ok" ? "text-teal-300" : status==="err" ? "text-rose-300" : "opacity-70"}`}>
            {banner}
          </div>
        )}

        <div className="pt-2">
          <button disabled={disabled} className="badge border-white/30 hover:border-white/60">
            {status==="sending" ? "Sending…" : "Send message now"}
          </button>
        </div>
      </form>
    </div>
  );
}
