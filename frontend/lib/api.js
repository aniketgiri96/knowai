const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("knowai_token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export async function listKb() {
  const res = await fetch(`${API}/kb/`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function uploadFile(file, kbId) {
  const form = new FormData();
  form.append("file", file);
  const url = kbId != null ? `${API}/upload/?kb_id=${kbId}` : `${API}/upload/`;
  const headers = {};
  if (typeof window !== "undefined" && localStorage.getItem("knowai_token"))
    headers["Authorization"] = `Bearer ${localStorage.getItem("knowai_token")}`;
  const res = await fetch(url, { method: "POST", body: form, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function search(query, kbId) {
  const params = new URLSearchParams({ query });
  if (kbId != null) params.set("kb_id", String(kbId));
  const res = await fetch(`${API}/search/?${params}`, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function chat(body) {
  const res = await fetch(`${API}/chat/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      message: body.message,
      kb_id: body.kb_id ?? undefined,
      session_id: body.session_id ?? undefined,
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function documentStatus(id) {
  const res = await fetch(`${API}/documents/${id}/status`, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
