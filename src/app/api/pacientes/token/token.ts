// src/app/api/pacientes/token/route.ts

export async function GET() {
  try {
	 const body = new URLSearchParams();
	 body.set("grant_type", "client_credentials");

	 const res = await fetch(
		"https://g0575431ea754e6-clinicas.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/oauth/token",
		{
		  method: "POST",
		  headers: {
			 "Content-Type": "application/x-www-form-urlencoded",
			 "Authorization":
				"Basic a1pSZVpyUmdpQ2dDbDNBTTc4Nll4QS4uOmN3YmpaNTRRUVNVV0ZRcTFzOFp1Z1EuLg==",
		  },
		  body,
		  cache: "no-store",
		}
	 );

	 const data = await res.json().catch(() => null);

	 if (!res.ok) {
		console.error("❌ Error ORDS token:", res.status, data);
		return new Response(
		  JSON.stringify({
			 error: "ORDS token request failed",
			 status: res.status,
			 detail: data,
		  }),
		  { status: 500 }
		);
	 }

	 console.log("✅ ORDS token OK:", data?.access_token);

	 return Response.json(data);
  } catch (err: any) {
	 console.error("💥 Error interno en token route:", err);

	 return new Response(
		JSON.stringify({
		  error: "Internal error in token route",
		  detail: err.message,
		}),
		{ status: 500 }
	 );
  }
}
