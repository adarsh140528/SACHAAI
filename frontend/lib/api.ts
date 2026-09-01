const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_URL}/health`, { cache: "no-store" });
    if (!res.ok) throw new Error("Health check failed");
    return await res.json();
  } catch (err: any) {
    return { status: "error", message: err.message };
  }
}

export async function submitCheck(payload: {
  input: string;
  input_type: string;
  language?: string;
}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("sachai_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api/v1/checks`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to submit claim for verification");
  }

  return await res.json();
}

export async function getCheckById(id: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("sachai_token") : null;
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api/v1/checks/${id}`, {
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Check result not found");
  }

  return await res.json();
}
