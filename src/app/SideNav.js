"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import { DashboardOutlined, UserOutlined, SettingOutlined, ReadOutlined, ShopOutlined, BarcodeOutlined } from "@ant-design/icons";

export default function SideNav({ onNavigate }) {
  const pathname = usePathname();
  const selectedKey = useMemo(() => {
    if (pathname.startsWith("/pacientes")) return "users";
    if (pathname.startsWith("/apointments")) return "appointment";
    if (pathname.startsWith("/purchases")) return "purchases";
    if (pathname.startsWith("/invoices")) return "invoices";
    if (pathname.startsWith("/conf_page")) return "settings";
    return "dashboard";
  }, [pathname]);

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={[
        { key: "dashboard", icon: <DashboardOutlined />, label: <Link href="/" onClick={onNavigate}>Dashboard</Link> },
        { key: "users", icon: <UserOutlined />, label: <Link href="/pacientes" onClick={onNavigate}>Pacientes</Link> },
        { key: "appointment", icon: <ReadOutlined />, label: <Link href="/apointments" onClick={onNavigate}>Citas</Link> },
        { key: "purchases", icon: <ShopOutlined />, label: <Link href="/purchases" onClick={onNavigate}>Compras</Link> },
        { key: "invoices", icon: <BarcodeOutlined />, label: <Link href="/invoices" onClick={onNavigate}>Facturacion</Link> },
        { key: "settings", icon: <SettingOutlined />, label: <Link href="/conf_page" onClick={onNavigate}>Configuración</Link> },
      ]}
    />
  );
}
