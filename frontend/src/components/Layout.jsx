// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useTheme } from "@emotion/react";

const Layout = () => {
  const theme = useTheme();
  return (
    <div
      className="flex"
      style={{
        backgroundColor: theme.palette.background.paper,
        height: "100%",
      }}
    >
      <Sidebar />
      <main className="flex-1 p-5">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
