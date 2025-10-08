"use client";

import React from "react";
import PageShell from "../page_shell/pacientes";
import AppFrame from "../AppFrame";

export default function Page() {
  return (
    <AppFrame>
      <PageShell title="Pacientes" />
    </AppFrame>
  );
}
