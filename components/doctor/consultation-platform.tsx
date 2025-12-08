"use client"

import type React from "react"

import { useState } from "react"

export default function ConsultationPlatform() {
  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    diagnosis: "",
    symptoms: "",
    treatment: "",
    followUp: "",
  })

  const [consultations, setConsultations] = useState<any[]>([])
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newConsultation = {
      id: `CON${Date.now()}`,
      ...formData,
      consultationDate: new Date().toLocaleDateString(),
      consultationTime: new Date().toLocaleTimeString(),
    }
    setConsultations((prev) => [newConsultation, ...prev])
    setMessage("Consultation recorded successfully!")
    setFormData({
      patientId: "",
      patientName: "",
      diagnosis: "",
      symptoms: "",
      treatment: "",
      followUp: "",
    })
    setTimeout(() => setMessage(""), 3000)
  }

  return (
    <div>
      {message && (
        <div
          style={{
            background: "rgba(5, 150, 105, 0.1)",
            color: "#059669",
            padding: "1rem",
            marginBottom: "1.5rem",
            borderLeft: "4px solid #059669",
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
          Record Consultation
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
              Patient Name *
            </label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
            Symptoms *
          </label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            required
            rows={3}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #e0e0e0",
              fontSize: "0.95rem",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
            Diagnosis *
          </label>
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            required
            rows={3}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #e0e0e0",
              fontSize: "0.95rem",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
            Treatment Plan *
          </label>
          <textarea
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
            required
            rows={3}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #e0e0e0",
              fontSize: "0.95rem",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
            Follow-up Instructions
          </label>
          <textarea
            name="followUp"
            value={formData.followUp}
            onChange={handleChange}
            rows={2}
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
          style={{
            padding: "0.75rem 2rem",
            background: "#06b6d4",
            color: "white",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#0891b2")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#06b6d4")}
        >
          Record Consultation
        </button>
      </form>

      {/* Consultations List */}
      {consultations.length > 0 && (
        <div style={{ background: "#f8f9fa", padding: "2rem", border: "1px solid #e0e0e0" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
            Consultation Records
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ background: "#e0e0e0" }}>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Consultation ID
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Patient
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Diagnosis
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((con) => (
                <tr key={con.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td style={{ padding: "1rem", color: "#06b6d4", fontWeight: "600" }}>{con.id}</td>
                  <td style={{ padding: "1rem" }}>{con.patientName}</td>
                  <td style={{ padding: "1rem", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {con.diagnosis}
                  </td>
                  <td style={{ padding: "1rem", color: "#6b7280", fontSize: "0.9rem" }}>
                    {con.consultationDate} {con.consultationTime}
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
