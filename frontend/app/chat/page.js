"use client";

import { useState, useEffect } from "react";
import { listKb, chat } from "../../lib/api.js";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[2.5rem]";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";
const btnPrimary =
  "min-h-[2.5rem] cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function ChatPage() {
  const [kbs, setKbs] = useState([]);
  const [kbId, setKbId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listKb()
      .then((data) => {
        setKbs(data);
        if (data.length && !kbId) setKbId(String(data[0].id));
      })
      .catch(() => setError("Failed to load knowledge bases."));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    const userMsg = message.trim();
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    setError("");
    try {
      const res = await chat({
        message: userMsg,
        kb_id: kbId ? parseInt(kbId, 10) : undefined,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.answer, sources: res.sources || [] },
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err.message}`, sources: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Chat</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label htmlFor="chat-kb" className={labelClass}>
              Knowledge base
            </label>
            <select
              id="chat-kb"
              value={kbId}
              onChange={(e) => setKbId(e.target.value)}
              className={inputClass}
            >
              {kbs.map((kb) => (
                <option key={kb.id} value={kb.id}>{kb.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <input
              id="chat-message"
              type="text"
              placeholder="Ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              className={inputClass}
              aria-label="Message"
            />
            <button type="submit" disabled={loading} className={btnPrimary}>
              {loading ? "Sending…" : "Send"}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-xl border p-4 ${
              m.role === "user"
                ? "ml-0 mr-4 border-blue-200 bg-blue-50"
                : "ml-4 mr-0 border-slate-200 bg-slate-50"
            }`}
          >
            <p className="text-sm font-semibold text-slate-700">
              {m.role === "user" ? "You" : "Assistant"}
            </p>
            <div className="mt-1 text-slate-800 whitespace-pre-wrap">{m.content}</div>
            {m.sources?.length > 0 && (
              <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Sources
                </p>
                <ul className="mt-2 space-y-2">
                  {m.sources.map((s, j) => (
                    <li key={j} className="text-sm text-slate-600">
                      {s.snippet?.slice(0, 200)}
                      {(s.snippet?.length ?? 0) > 200 && "…"}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
