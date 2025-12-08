"use client"

import type React from "react"
import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AppointmentScheduler() {
  const [formData, setFormData] = useState({
    patientId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  })

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { data: appointments, mutate } = useSWR("/api/appointments", fetcher, { refreshInterval: 3000 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`)

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: formData.patientId,
          appointmentDate: appointmentDateTime.toISOString(),
          reason: formData.reason,
          status: "scheduled",
        }),
      })

      if (response.ok) {
        setMessage("Appointment scheduled successfully!")
        setFormData({
          patientId: "",
          appointmentDate: "",
          appointmentTime: "",
          reason: "",
        })
        mutate()
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Error scheduling appointment")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {message && (
        <div
          style={{
            background: message.includes("Error") ? "rgba(220, 38, 38, 0.1)" : "rgba(5, 150, 105, 0.1)",
            color: message.includes("Error") ? "#dc2626" : "#059669",
            padding: "1rem",
            marginBottom: "1.5rem",
            borderLeft: message.includes("Error") ? "4px solid #dc2626" : "4px solid #059669",
          }}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ background: "#f8f9fa", padding: "2rem", marginBottom: "2rem", border: "1px solid #e0e0e0" }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
          Schedule Appointment
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Patient ID *
            </label>
            <input
              type="text"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              placeholder="e.g., P1234567890"
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Appointment Date *
            </label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Appointment Time *
            </label>
            <input
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Reason for Visit
            </label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem 2rem",
            background: loading ? "#9ca3af" : "#3b82f6",
            color: "white",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {loading ? "Scheduling..." : "Schedule Appointment"}
        </button>
      </form>

      {/* Appointments List */}
      {appointments && appointments.length > 0 && (
        <div style={{ background: "#f8f9fa", padding: "2rem", border: "1px solid #e0e0e0" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
            Scheduled Appointments
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ background: "#e0e0e0" }}>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Patient ID
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Date & Time
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Reason
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 10).map((apt: any) => (
                <tr key={apt.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td style={{ padding: "1rem", color: "#3b82f6", fontWeight: "600" }}>{apt.patient_id}</td>
                  <td style={{ padding: "1rem", fontSize: "0.9rem" }}>
                    {new Date(apt.appointment_date).toLocaleString()}
                  </td>
                  <td style={{ padding: "1rem" }}>{apt.reason || "-"}</td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        background: "rgba(5, 150, 105, 0.1)",
                        color: "#059669",
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                      }}
                    >
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
