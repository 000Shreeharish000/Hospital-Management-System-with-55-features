"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/sidebar"
import PatientRegistration from "@/components/reception/patient-registration"
import AppointmentScheduler from "@/components/reception/appointment-scheduler"
import QueueManagement from "@/components/reception/queue-management"
import ComplaintManagement from "@/components/reception/complaint-management"
import ViewPatient from "@/components/reception/view-patient"
import BillingConsole from "@/components/reception/billing-console"
import DischargeSummaryGenerator from "@/components/reception/discharge-summary"

export default function ReceptionDashboard() {
  const [activeTab, setActiveTab] = useState("registration")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("userId") || "User"
    setUserName(user)
  }, [])

  const sidebarItems = [
    { label: "Patient Registration", href: "#registration", icon: "👤" },
    { label: "View Patient", href: "#view", icon: "🔍" },
    { label: "Appointment Scheduler", href: "#appointment", icon: "📅" },
    { label: "Queue Management", href: "#queue", icon: "📋" },
    { label: "Complaint Management", href: "#complaint", icon: "⚠️" },
    { label: "Billing Console", href: "#billing", icon: "💳" },
    { label: "Discharge Summary", href: "#discharge", icon: "📄" },
  ]

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#ffffff" }}>
      <Sidebar role="reception" items={sidebarItems} userName={userName} />

      <div style={{ marginLeft: "30%", width: "70%", padding: "2rem", overflowY: "auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: "700", color: "#1a1a1a", marginBottom: "0.5rem" }}>
            Reception Dashboard
          </h1>
          <p style={{ color: "#6b7280" }}>Manage patient registrations, appointments, and inquiries</p>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "2rem",
            borderBottom: "1px solid #e0e0e0",
            overflowX: "auto",
          }}
        >
          {[
            { id: "registration", label: "Patient Registration" },
            { id: "view", label: "View Patient" },
            { id: "appointment", label: "Appointment Scheduler" },
            { id: "queue", label: "Queue Management" },
            { id: "complaint", label: "Complaint Management" },
            { id: "billing", label: "Billing Console" },
            { id: "discharge", label: "Discharge Summary" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "0.75rem 1.5rem",
                border: "none",
                background: "transparent",
                color: activeTab === tab.id ? "#3b82f6" : "#6b7280",
                borderBottom: activeTab === tab.id ? "2px solid #3b82f6" : "2px solid transparent",
                cursor: "pointer",
                fontSize: "0.95rem",
                fontWeight: activeTab === tab.id ? "600" : "500",
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
          {activeTab === "registration" && <PatientRegistration />}
          {activeTab === "view" && <ViewPatient />}
          {activeTab === "appointment" && <AppointmentScheduler />}
          {activeTab === "queue" && <QueueManagement />}
          {activeTab === "complaint" && <ComplaintManagement />}
          {activeTab === "billing" && <BillingConsole />}
          {activeTab === "discharge" && <DischargeSummaryGenerator />}
        </div>
      </div>
    </div>
  )
}
