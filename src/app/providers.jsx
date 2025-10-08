"use client";

import { ConfigProvider } from "antd";
import "antd/dist/reset.css"; // 👈 Importa el reset de AntD UNA sola vez aquí

export default function Providers({ children }) {
  return (
    <ConfigProvider
      theme={{
        token: { borderRadius: 12 },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
