"use client";

import { useState, useEffect } from "react";
import { listKb, uploadFile, documentStatus } from "../../lib/api.js";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[2.5rem]";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";
const btnPrimary =
  "min-h-[2.5rem] cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function UploadPage() {
  const [kbs, setKbs] = useState([]);
  const [kbId, setKbId] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [docId, setDocId] = useState(null);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    listKb()
      .then((data) => {
        setKbs(data);
        if (data.length && !kbId) setKbId(String(data[0].id));
      })
      .catch(() => setStatus("Failed to load knowledge bases."));
  }, []);

  useEffect(() => {
    if (!docId || !polling) return;
    const t = setInterval(() => {
      documentStatus(docId)
        .then((d) => {
          setStatus(`Document status: ${d.status}`);
          if (d.status === "indexed" || d.status === "failed") {
            setPolling(false);
          }
        })
        .catch(() => setPolling(false));
    }, 2000);
    return () => clearInterval(t);
  }, [docId, polling]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setStatus("Uploading...");
    try {
      const res = await uploadFile(file, kbId ? parseInt(kbId, 10) : undefined);
      setStatus(`Queued. Document ID: ${res.document_id}`);
      setDocId(res.document_id);
      if (res.document_id) setPolling(true);
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("401") || msg.includes("authenticated") || msg.toLowerCase().includes("unauthorized"))
        setStatus("Please log in to upload.");
      else
        setStatus(`Error: ${err.message}`);
    }
  };

  const isAuthError = status === "Please log in to upload.";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Upload document</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="upload-kb" className={labelClass}>
              Knowledge base
            </label>
            <select
              id="upload-kb"
              value={kbId}
              onChange={(e) => setKbId(e.target.value)}
              className={inputClass}
            >
              {kbs.map((kb) => (
                <option key={kb.id} value={kb.id}>{kb.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="upload-file" className={labelClass}>
              File
            </label>
            <input
              id="upload-file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <button type="submit" disabled={!file} className={btnPrimary}>
            Upload
          </button>
        </form>
      </div>

      {status && (
        <div
          className={`rounded-lg border p-3 ${
            isAuthError
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : status.startsWith("Error") || status.startsWith("Failed")
                ? "border-red-200 bg-red-50 text-red-800"
                : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          {status}
          {isAuthError && (
            <>
              {" "}
              <a href="/login" className="font-medium text-blue-600 underline hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
                Log in
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
