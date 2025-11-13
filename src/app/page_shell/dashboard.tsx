"use client";

import React, { useEffect, useState } from "react";
import { Typography } from "antd";

export default function PageShell({ title }: { title: string }) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch("/api/pacientes/token", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(
            data.error ||
              `Error obteniendo token (status ${res.status})`
          );
        }

        if (!data.access_token) {
          throw new Error("No se recibió access_token en la respuesta");
        }

        setToken(data.access_token);
      } catch (err: any) {
        console.error("❌ Error en fetchToken:", err);
        setError(err.message || "Error obteniendo token");
      }
    };

    fetchToken();
  }, []);

  return (
    <div className="p-6">
      <Typography.Title level={3}>{title}</Typography.Title>

      <div
        className="mt-6 rounded-2xl border border-dashed"
        style={{ minHeight: 320 }}
      >
        {error && <p>{error}</p>}
        {!error && !token && <p>Cargando token...</p>}
        {token && (
          <p>
            <strong>Token:</strong> {token}
          </p>
        )}
      </div>
    </div>
  );
}
