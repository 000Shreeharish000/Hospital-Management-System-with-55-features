"use client"

import { useState } from "react"

export default function PatientMonitoring() {
  const [monitoredPatients] = useState<any[]>([
    {
      id: "P001",
      name: "John Doe",
      room: "101",
      condition: "Stable",
      lastVitals: { bp: "120/80", hr: 72, temp: 37.2, spo2: 98 },
      alerts: [],
    },
    {
      id: "P002",
      name: "Jane Smith",
      room: "102",
      condition: "Critical",
      lastVitals: { bp: "145/95", hr: 105, temp: 38.5, spo2: 92 },
      alerts: ["High BP", "High Temp", "Low SpO2"],
    },
    {
      id: "P003",
      name: "Robert Johnson",
      room: "103",
      condition: "Stable",
      lastVitals: { bp: "118/78", hr: 68, temp: 36.8, spo2: 99 },
      alerts: [],
    },
  ])

  const conditionColors: Record<string, string> = {
    Stable: "#059669",
    Critical: "#dc2626",
    Warning: "#d97706",
  }

  return (
    <div>
      <div style={{ background: "#f8f9fa", padding: "2rem", border: "1px solid #e0e0e0" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
          Patient Monitoring Dashboard
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
          {monitoredPatients.map((patient) => (
            <div
              key={patient.id}
              style={{
                background: "white",
                border: `2px solid ${patient.alerts.length > 0 ? "#dc2626" : "#e0e0e0"}`,
                padding: "1.5rem",
              }}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>PATIENT ID</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1a1a1a" }}>{patient.name}</div>
                  <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>{patient.id}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.25rem" }}>ROOM</div>
                  <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1e40af" }}>{patient.room}</div>
                </div>
              </div>

              <div style={{ marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #e0e0e0" }}>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>CONDITION</div>
                <span
                  style={{
                    background: `${conditionColors[patient.condition]}20`,
                    color: conditionColors[patient.condition],
                    padding: "0.5rem 1rem",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  {patient.condition}
                </span>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem", fontWeight: "500" }}>
                  LAST VITALS
                </div>
                <div
                  style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem", fontSize: "0.9rem" }}
                >
                  <div>
                    <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>BP</div>
                    <div style={{ fontWeight: "600", color: "#1a1a1a" }}>{patient.lastVitals.bp}</div>
                  </div>
                  <div>
                    <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>HR</div>
                    <div style={{ fontWeight: "600", color: "#1a1a1a" }}>{patient.lastVitals.hr} bpm</div>
                  </div>
                  <div>
                    <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>Temp</div>
                    <div style={{ fontWeight: "600", color: "#1a1a1a" }}>{patient.lastVitals.temp}°C</div>
                  </div>
                  <div>
                    <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>SpO2</div>
                    <div style={{ fontWeight: "600", color: "#1a1a1a" }}>{patient.lastVitals.spo2}%</div>
                  </div>
                </div>
              </div>

              {patient.alerts.length > 0 && (
                <div style={{ background: "rgba(220, 38, 38, 0.1)", padding: "1rem", borderLeft: "4px solid #dc2626" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "#dc2626", marginBottom: "0.5rem" }}>
                    ACTIVE ALERTS
                  </div>
                  <ul style={{ marginLeft: "1.5rem", color: "#dc2626", fontSize: "0.9rem" }}>
                    {patient.alerts.map((alert, idx) => (
                      <li key={idx}>{alert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
