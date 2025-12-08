"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import AmbulanceManagement from "@/components/logistics/ambulance-management"
import WardManagement from "@/components/logistics/ward-management"
import HousekeepingTracking from "@/components/logistics/housekeeping-tracking"

export default function LogisticsDashboard() {
  const [activeTab, setActiveTab] = useState("ambulance")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("userId") || "User"
    setUserName(user)
  }, [])

  const sidebarItems = [
    { label: "Ambulance Management", href: "#", icon: "🚑" },
    { label: "Ward Management", href: "#", icon: "🏥" },
    { label: "Housekeeping Tracking", href: "#", icon: "🧹" },
  ]

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#ffffff" }}>
      <Sidebar role="logistics" items={sidebarItems} userName={userName} />

      <div style={{ marginLeft: "30%", width: "70%", padding: "2rem", overflowY: "auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.5rem" }}>
            Logistics Dashboard
          </h1>
          <p style={{ color: "#6b7280" }}>Manage ambulances, wards, and housekeeping</p>
        </div>

        {/* Tab Navigation */}
        <div
          style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid #e0e0e0", overflowX: "auto" }}
        >
          {[
            { id: "ambulance", label: "Ambulance Management", color: "#10b981" },
            { id: "wards", label: "Ward Management", color: "#10b981" },
            { id: "housekeeping", label: "Housekeeping Tracking", color: "#10b981" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                background: "transparent",
                color: activeTab === tab.id ? tab.color : "#6b7280",
                borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : "2px solid transparent",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: activeTab === tab.id ? 600 : 500,
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "ambulance" && <AmbulanceManagement />}
          {activeTab === "wards" && <WardManagement />}
          {activeTab === "housekeeping" && <HousekeepingTracking />}
        </div>
      </div>
    </div>
  )
}
