"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import PrescriptionFulfillment from "@/components/pharmacy/prescription-fulfillment"
import InventoryManagement from "@/components/pharmacy/inventory-management"

export default function PharmacyDashboard() {
  const [activeTab, setActiveTab] = useState("fulfillment")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("userId") || "User"
    setUserName(user)
  }, [])

  const sidebarItems = [
    { label: "Prescription Fulfillment", href: "#", icon: "💊" },
    { label: "Inventory Management", href: "#", icon: "📦" },
  ]

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#ffffff" }}>
      <Sidebar role="pharmacy" items={sidebarItems} userName={userName} />

      <div style={{ marginLeft: "30%", width: "70%", padding: "2rem", overflowY: "auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#1a1a1a", marginBottom: "0.5rem" }}>
            Pharmacy Dashboard
          </h1>
          <p style={{ color: "#6b7280" }}>Manage prescriptions and medication inventory</p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid #e0e0e0" }}>
          {[
            { id: "fulfillment", label: "Prescription Fulfillment" },
            { id: "inventory", label: "Inventory Management" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                background: "transparent",
                color: activeTab === tab.id ? "#f59e0b" : "#6b7280",
                borderBottom: activeTab === tab.id ? "2px solid #f59e0b" : "2px solid transparent",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: activeTab === tab.id ? "600" : "500",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "fulfillment" && <PrescriptionFulfillment />}
          {activeTab === "inventory" && <InventoryManagement />}
        </div>
      </div>
    </div>
  )
}
