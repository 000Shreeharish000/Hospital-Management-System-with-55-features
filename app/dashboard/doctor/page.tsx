"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import ConsultationPlatform from "@/components/doctor/consultation-platform"
import PrescriptionWriter from "@/components/doctor/prescription-writer"
import PatientHistory from "@/components/doctor/patient-history"

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("consultation")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("userId") || "User"
    setUserName(user)
  }, [])

  const sidebarItems = [
    { label: "Consultation", href: "#", icon: "🏥" },
    { label: "Write Prescription", href: "#", icon: "💊" },
    { label: "Patient History", href: "#", icon: "📋" },
  ]

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#ffffff" }}>
      <Sidebar role="doctor" items={sidebarItems} userName={userName} />

      <div style={{ marginLeft: "30%", width: "70%", padding: "2rem", overflowY: "auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#1a1a1a", marginBottom: "0.5rem" }}>
            Doctor Dashboard
          </h1>
          <p style={{ color: "#6b7280" }}>Manage consultations, prescriptions, and patient records</p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid #e0e0e0" }}>
          {[
            { id: "consultation", label: "Consultation" },
            { id: "prescription", label: "Write Prescription" },
            { id: "history", label: "Patient History" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                background: "transparent",
                color: activeTab === tab.id ? "#06b6d4" : "#6b7280",
                borderBottom: activeTab === tab.id ? "2px solid #06b6d4" : "2px solid transparent",
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
          {activeTab === "consultation" && <ConsultationPlatform />}
          {activeTab === "prescription" && <PrescriptionWriter />}
          {activeTab === "history" && <PatientHistory />}
        </div>
      </div>
    </div>
  )
}
