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

export async function fetchApiKeys() {
  const token = typeof window !== "undefined" ? localStorage.getItem("sachai_token") : null;
  if (!token) throw new Error("Please sign in to view API keys");

  const res = await fetch(`${API_URL}/api/v1/api-keys`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch API keys");
  }

  return await res.json();
}

export async function createApiKey(name: string, rate_limit_rpm: number = 60) {
  const token = typeof window !== "undefined" ? localStorage.getItem("sachai_token") : null;
  if (!token) throw new Error("Please sign in to generate API keys");

  const res = await fetch(`${API_URL}/api/v1/api-keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, rate_limit_rpm }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to generate API key");
  }

  return await res.json();
}

export async function deleteApiKey(keyId: string) {
  const token = typeof window !== "undefined" ? localStorage.getItem("sachai_token") : null;
  if (!token) throw new Error("Please sign in to revoke API keys");

  const res = await fetch(`${API_URL}/api/v1/api-keys/${keyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to revoke API key");
  }

  return await res.json();
}

export async function runApiTestWithKey(apiKey: string, input: string, inputType: string = "TEXT") {
  const res = await fetch(`${API_URL}/api/v1/checks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({
      input,
      input_type: inputType,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.detail || `API request failed with status ${res.status}`);
  }
  return data;
}

