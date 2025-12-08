"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import VitalsRecording from "@/components/nurse/vitals-recording"
import PatientMonitoring from "@/components/nurse/patient-monitoring"

export default function NurseDashboard() {
  const [activeTab, setActiveTab] = useState("vitals")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("userId") || "User"
    setUserName(user)
  }, [])

  const sidebarItems = [
    { label: "Vitals Recording", href: "#", icon: "📊" },
    { label: "Patient Monitoring", href: "#", icon: "👁️" },
  ]

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#ffffff" }}>
      <Sidebar role="nurse" items={sidebarItems} userName={userName} />

      <div style={{ marginLeft: "30%", width: "70%", padding: "2rem", overflowY: "auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#1a1a1a", marginBottom: "0.5rem" }}>
            Nurse Dashboard
          </h1>
          <p style={{ color: "#6b7280" }}>Record and monitor patient vitals</p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid #e0e0e0" }}>
          {[
            { id: "vitals", label: "Vitals Recording" },
            { id: "monitoring", label: "Patient Monitoring" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                background: "transparent",
                color: activeTab === tab.id ? "#8b5cf6" : "#6b7280",
                borderBottom: activeTab === tab.id ? "2px solid #8b5cf6" : "2px solid transparent",
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
          {activeTab === "vitals" && <VitalsRecording />}
          {activeTab === "monitoring" && <PatientMonitoring />}
        </div>
      </div>
    </div>
  )
}
