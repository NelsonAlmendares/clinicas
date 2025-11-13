// src/lib/ords.ts

const ORDS_TOKEN_URL =
  process.env.ORDS_TOKEN_URL ??
  "https://g0575431ea754e6-clinicas.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/oauth/token";

const ORDS_BASIC_AUTH =
  process.env.ORDS_BASIC_AUTH ??
  "Basic a1pSZVpyUmdpQ2dDbDNBTTc4Nll4QS4uOmN3YmpaNTRRUVNVV0ZRcTFzOFp1Z1EuLg==";

export async function getOrdsToken(): Promise<string> {
  const body = new URLSearchParams();
  body.set("grant_type", "client_credentials");

  const res = await fetch(ORDS_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: ORDS_BASIC_AUTH,
    },
    body,
    cache: "no-store",
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("❌ ORDS token error:", res.status, text);
    throw new Error(`ORDS token error ${res.status}`);
  }

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    console.error("❌ Invalid JSON from ORDS token:", text);
    throw new Error("Invalid JSON from ORDS token");
  }

  if (!data.access_token) {
    throw new Error("No access_token in ORDS response");
  }

  return data.access_token;
}
