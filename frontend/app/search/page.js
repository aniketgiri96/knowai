"use client";

import { useState, useEffect } from "react";
import { listKb, search } from "../../lib/api.js";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[2.5rem]";
const labelClass = "mb-1 block text-sm font-medium text-slate-700";
const btnPrimary =
  "min-h-[2.5rem] cursor-pointer rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function SearchPage() {
  const [kbs, setKbs] = useState([]);
  const [kbId, setKbId] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await search(query, kbId ? parseInt(kbId, 10) : undefined);
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Search</h1>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="search-kb" className={labelClass}>
              Knowledge base
            </label>
            <select
              id="search-kb"
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
            <label htmlFor="search-query" className={labelClass}>
              Query
            </label>
            <input
              id="search-query"
              type="text"
              placeholder="Search your documents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={inputClass}
            />
          </div>
          <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? "Searching…" : "Search"}
          </button>
        </form>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}

      <ul className="space-y-3">
        {results.map((r, i) => (
          <li
            key={i}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-slate-800">{r.snippet}</p>
            {r.score != null && (
              <p className="mt-2 text-sm text-slate-500">Score: {r.score.toFixed(3)}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
