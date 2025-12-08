"use client"

import { useMemo, useState } from "react"

type TrackingType = "Live GPS" | "Shift Check-In" | "Maintenance Log"

interface Ambulance {
  id: string
  driver: string
  status: "Available" | "On Duty" | "Maintenance"
  location: string
  trackingType: TrackingType
  lastPing: string
}

export default function AmbulanceManagement() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([
    {
      id: "AMB-001",
      driver: "R. Kumar",
      status: "Available",
      location: "Bay A",
      trackingType: "Live GPS",
      lastPing: "14:32",
    },
    {
      id: "AMB-002",
      driver: "S. Das",
      status: "On Duty",
      location: "ER",
      trackingType: "Shift Check-In",
      lastPing: "14:28",
    },
    {
      id: "AMB-003",
      driver: "P. Singh",
      status: "Maintenance",
      location: "Garage",
      trackingType: "Maintenance Log",
      lastPing: "13:55",
    },
  ])

  const [filter, setFilter] = useState<"All" | Ambulance["status"]>("All")
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>(() => (ambulances[0] ? ambulances[0].id : ""))

  const updateStatus = (id: string, status: Ambulance["status"]) => {
    setAmbulances((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  const updateTrackingType = (id: string, trackingType: TrackingType) => {
    setAmbulances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, trackingType, lastPing: trackingType === "Live GPS" ? "Now" : a.lastPing } : a)),
    )
  }

  const filtered = ambulances.filter((a) => (filter === "All" ? true : a.status === filter))
  const selectedAmbulance = useMemo(
    () => ambulances.find((a) => a.id === selectedAmbulanceId) ?? null,
    [ambulances, selectedAmbulanceId],
  )

  const trackingSnapshots: Record<TrackingType, Array<{ time: string; description: string }>> = {
    "Live GPS": [
      { time: "14:32", description: "Position refreshed via GPS near Gate 3" },
      { time: "14:27", description: "Departed from Emergency Response Bay" },
      { time: "14:15", description: "Arrived at City Center pickup point" },
    ],
    "Shift Check-In": [
      { time: "14:28", description: "Team confirmed arrival at ER bay" },
      { time: "13:55", description: "Patient offloaded and handed to triage" },
      { time: "13:10", description: "Crew accepted dispatch assignment" },
    ],
    "Maintenance Log": [
      { time: "14:00", description: "Diagnostic scan completed" },
      { time: "13:45", description: "Hydraulics inspection in progress" },
      { time: "13:20", description: "Vehicle parked in maintenance bay" },
    ],
  }

  const badgeColor = (status: Ambulance["status"]) =>
    ({
      Available: "#10b981",
      "On Duty": "#3b82f6",
      Maintenance: "#f59e0b",
    }[status])

  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827" }}>Ambulance Management</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          style={{ padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb", color: "#111827" }}
        >
          <option>All</option>
          <option>Available</option>
          <option>On Duty</option>
          <option>Maintenance</option>
        </select>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#6b7280", fontSize: "0.875rem" }}>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>ID</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Driver</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Status</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Location</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Tracking</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} style={{ color: "#111827" }}>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{a.id}</td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{a.driver}</td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>
                  <span
                    style={{
                      background: `${badgeColor(a.status)}15`,
                      color: badgeColor(a.status),
                      padding: "0.25rem 0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {a.status}
                  </span>
                </td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{a.location}</td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <select
                      value={a.trackingType}
                      onChange={(e) => updateTrackingType(a.id, e.target.value as TrackingType)}
                      style={{ padding: "0.4rem 0.6rem", border: "1px solid #d1d5db", background: "#f9fafb" }}
                    >
                      <option value="Live GPS">Live GPS</option>
                      <option value="Shift Check-In">Shift Check-In</option>
                      <option value="Maintenance Log">Maintenance Log</option>
                    </select>
                    <span style={{ color: "#6b7280", fontSize: "0.75rem" }}>Last ping {a.lastPing}</span>
                  </div>
                </td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => updateStatus(a.id, "Available")}
                      style={{ padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", background: "#f9fafb" }}
                    >
                      Mark Available
                    </button>
                    <button
                      onClick={() => updateStatus(a.id, "On Duty")}
                      style={{ padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", background: "#f9fafb" }}
                    >
                      Dispatch
                    </button>
                    <button
                      onClick={() => updateStatus(a.id, "Maintenance")}
                      style={{ padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", background: "#f9fafb" }}
                    >
                      Maintenance
                    </button>
                    <button
                      onClick={() => setSelectedAmbulanceId(a.id)}
                      style={{ padding: "0.5rem 0.75rem", border: "1px solid #3b82f6", background: "#eff6ff", color: "#1d4ed8" }}
                    >
                      View Tracking
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedAmbulance && (
        <div
          style={{
            marginTop: "1.5rem",
            border: "1px solid #e5e7eb",
            padding: "1.25rem",
            background: "#f9fafb",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600, color: "#111827" }}>
                Tracking Overview · {selectedAmbulance.id}
              </h3>
              <p style={{ margin: "0.25rem 0 0", color: "#6b7280", fontSize: "0.875rem" }}>
                {selectedAmbulance.driver} · {selectedAmbulance.location}
              </p>
            </div>
            <select
              value={selectedAmbulance.trackingType}
              onChange={(e) => updateTrackingType(selectedAmbulance.id, e.target.value as TrackingType)}
              style={{ padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", background: "white", minWidth: "10rem" }}
            >
              <option value="Live GPS">Live GPS</option>
              <option value="Shift Check-In">Shift Check-In</option>
              <option value="Maintenance Log">Maintenance Log</option>
            </select>
          </div>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            {trackingSnapshots[selectedAmbulance.trackingType].map((event) => (
              <div
                key={event.time + event.description}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  background: "white",
                  border: "1px solid #e5e7eb",
                }}
              >
                <span style={{ fontWeight: 600, color: "#1f2937" }}>{event.time}</span>
                <span style={{ color: "#4b5563", textAlign: "right", maxWidth: "70%" }}>{event.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
