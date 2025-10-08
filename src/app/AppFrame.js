"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Layout,
  Menu,
  Grid,
  Button,
  Breadcrumb,
  Drawer,
  Dropdown,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  ReconciliationOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  HeartOutlined,
  CloseCircleOutlined,
  EditOutlined
} from "@ant-design/icons";
import SideNav from "./SideNav";
import styles from "./page.css";

const { Header, Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

// Menú superior (Header)
const headerItems = [
  { label: "Gestión de inventario", key: "mail", icon: <ReconciliationOutlined /> },
  { label: "Aseguradoras", key: "app", icon: <HeartOutlined />, disabled: false },
  {
    label: "Generación de reportes",
    key: "SubMenu",
    icon: <EditOutlined />,
    children: [
      {
        type: "group", label: "Inventario", children: [
          { label: "Parametrizado", key: "setting:1", icon: <FileExcelOutlined /> },
          { label: "General", key: "setting:2", icon: <FilePdfOutlined />  },
        ]
      },
      {
        type: "group", label: "Clínico", children: [
          { label: "Mensual", key: "setting:3", icon: <FileExcelOutlined /> },
          { label: "Estadístico", key: "setting:4", icon: <FilePdfOutlined /> },
        ]
      },
    ],
  },
  {
    key: "alipay",
    label: (
      <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
        Cierre de sesión
      </a>
    ), icon: <CloseCircleOutlined />
  },
];

export default function AppFrame({ children }) {
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentTop, setCurrentTop] = useState("mail");
  const pathname = usePathname();
  const isMobile = !screens.lg;

  const breadcrumbItems = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    return [
      { title: <Link href="/">Inicio</Link> },
      ...parts.map((_, idx) => {
        const url = "/" + parts.slice(0, idx + 1).join("/");
        const label = parts[idx].replaceAll("-", " ").replace(/^[a-z]/, (c) => c.toUpperCase());
        return { title: <Link href={url}>{label}</Link> };
      }),
    ];
  }, [pathname]);

  const onTopMenuClick = (e) => setCurrentTop(e.key);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sider solo desktop */}
      {!isMobile && (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={240}>
          <div className="px-4 py-4 text-center">
            <div className="mx-auto h-10 w-full rounded-xl" />
          </div>
          <SideNav />
        </Sider>
      )}

      <Layout>
        <Header style={{ padding: 1, background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
          <div className="flex items-center px-4" style={{ gap: 8, width: "100%" }}>
            {/* IZQUIERDA: botón y logo */}
            {isMobile ? (
              <Button type="text" onClick={() => setOpenDrawer(true)} icon={<MenuUnfoldOutlined />} style={{ marginTop: 10 }} />
            ) : (
              <Button
                type="text"
                onClick={() => setCollapsed((c) => !c)}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              />
            )}
            <div className="ml-2 h-8 w-28 rounded" />
            
            <div style={{ flex: 1 }} />

            {/* MENÚ A LA DERECHA */}
            {isMobile ? (
              <Dropdown
                trigger={["click"]}
                menu={{ items: headerItems, onClick: onTopMenuClick }}
                placement="bottomRight"
              >
                <Button
                  type="default"
                  icon={<AppstoreOutlined />}
                  style={{ marginLeft: "auto", marginTop: 10}} // asegura alineado derecho
                >
                  Menú
                </Button>
              </Dropdown>
            ) : (
              <div
                style={{
                  marginLeft: "auto", // alinea todo este bloque a la derecha
                  minWidth: 0,
                  maxWidth: "100%",
                }}
              >
                <Menu
                  onClick={onTopMenuClick}
                  selectedKeys={[currentTop]}
                  mode="horizontal"
                  items={headerItems}
                  style={{
                    borderBottom: "none",
                    minWidth: "max-content", // no se comprime
                  }}
                />
              </div>
            )}
          </div>
        </Header>


        {/* Drawer mobile (side nav) */}
        {isMobile && (
          <Drawer
            title="Menú"
            placement="left"
            onClose={() => setOpenDrawer(false)}
            open={openDrawer}
            styles={{ body: { padding: 0 } }}
          >
            <SideNav onNavigate={() => setOpenDrawer(false)} />
          </Drawer>
        )}

        <Content style={{ margin: "16px" }}>
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-4 rounded-2xl bg-white shadow-sm" style={{ minHeight: 320 }}>
            {children}
          </div>
        </Content>

        <Footer style={{ textAlign: "center", background: "#fff" }} />
      </Layout>
    </Layout>
  );
}
