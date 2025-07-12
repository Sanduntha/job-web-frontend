// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <main style={{ flexGrow: 1, padding: "1rem" }}>{children}</main>
      <Footer />
    </div>
  );
}
