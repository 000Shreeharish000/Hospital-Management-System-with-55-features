"use client"

import type React from "react"
import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PrescriptionWriter() {
  const [formData, setFormData] = useState({
    patientId: "",
    medicationName: "",
    dosage: "",
    frequency: "",
    duration: "",
    quantity: "",
    instructions: "",
  })

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { data: prescriptions, mutate } = useSWR("/api/prescriptions", fetcher, { refreshInterval: 3000 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          patientId: formData.patientId,
          quantity: Number.parseInt(formData.quantity) || 1,
        }),
      })

      if (response.ok) {
        setMessage("Prescription created successfully!")
        setFormData({
          patientId: "",
          medicationName: "",
          dosage: "",
          frequency: "",
          duration: "",
          quantity: "",
          instructions: "",
        })
        mutate()
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Error creating prescription")
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
          Write Prescription
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
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Medication Name *
            </label>
            <input
              type="text"
              name="medicationName"
              value={formData.medicationName}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Dosage *
            </label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="e.g., 500mg"
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Frequency *
            </label>
            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            >
              <option value="">Select Frequency</option>
              <option value="Once daily">Once daily</option>
              <option value="Twice daily">Twice daily</option>
              <option value="Three times daily">Three times daily</option>
              <option value="Four times daily">Four times daily</option>
              <option value="As needed">As needed</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Duration *
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 7 days"
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
            Special Instructions
          </label>
          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows={3}
            placeholder="e.g., Take with food, avoid dairy products"
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #e0e0e0",
              fontSize: "0.95rem",
              fontFamily: "inherit",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem 2rem",
            background: loading ? "#9ca3af" : "#06b6d4",
            color: "white",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {loading ? "Creating..." : "Create Prescription"}
        </button>
      </form>

      {/* Prescriptions List */}
      {prescriptions && prescriptions.length > 0 && (
        <div style={{ background: "#f8f9fa", padding: "2rem", border: "1px solid #e0e0e0" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
            Recent Prescriptions
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
                  Medication
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Dosage
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Frequency
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.slice(0, 10).map((rx: any) => (
                <tr key={rx.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td style={{ padding: "1rem", color: "#06b6d4", fontWeight: "600" }}>{rx.patient_id}</td>
                  <td style={{ padding: "1rem" }}>{rx.medication_name}</td>
                  <td style={{ padding: "1rem" }}>{rx.dosage}</td>
                  <td style={{ padding: "1rem" }}>{rx.frequency}</td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        background: rx.status === "pending" ? "rgba(217, 119, 6, 0.1)" : "rgba(5, 150, 105, 0.1)",
                        color: rx.status === "pending" ? "#d97706" : "#059669",
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                      }}
                    >
                      {rx.status}
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
