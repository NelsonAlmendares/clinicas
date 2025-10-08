"use client";

import React from "react";
import { Typography } from "antd";

export default function PageShell({ title }) {
  return (
    <div className="p-6">
      <Typography.Title level={3}>{title}</Typography.Title>
      <div className="mt-6 rounded-2xl border border-dashed" style={{ minHeight: 320 }} >
        <p>Hola</p>
      </div>
    </div>
  );
}
