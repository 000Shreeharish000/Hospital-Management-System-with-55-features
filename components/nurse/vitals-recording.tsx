"use client"

import type React from "react"
import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function VitalsRecording() {
  const [formData, setFormData] = useState({
    patientId: "",
    systolic: "",
    diastolic: "",
    heartRate: "",
    temperature: "",
    oxygenSaturation: "",
    respiratoryRate: "",
    weight: "",
    height: "",
    notes: "",
  })

  const [message, setMessage] = useState("")
  const [anomalies, setAnomalies] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { data: vitals, mutate } = useSWR("/api/vitals", fetcher, { refreshInterval: 3000 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const checkAnomalies = (data: any) => {
    const detected: string[] = []
    const systolic = Number.parseInt(data.systolic)
    const diastolic = Number.parseInt(data.diastolic)
    const temp = Number.parseFloat(data.temperature)
    const hr = Number.parseInt(data.heartRate)
    const spo2 = Number.parseInt(data.oxygenSaturation)

    if (systolic > 140 || systolic < 90) detected.push("Abnormal Systolic BP")
    if (diastolic > 90 || diastolic < 60) detected.push("Abnormal Diastolic BP")
    if (temp > 38.5 || temp < 36) detected.push("Abnormal Temperature")
    if (hr > 100 || hr < 60) detected.push("Abnormal Heart Rate")
    if (spo2 < 95) detected.push("Low SpO2 Level")

    return detected
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const detected = checkAnomalies(formData)
    setAnomalies(detected)

    try {
      const response = await fetch("/api/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          patientId: formData.patientId,
          systolic: Number.parseInt(formData.systolic),
          diastolic: Number.parseInt(formData.diastolic),
          heartRate: Number.parseInt(formData.heartRate),
          temperature: Number.parseFloat(formData.temperature),
          oxygenSaturation: Number.parseInt(formData.oxygenSaturation),
          respiratoryRate: Number.parseInt(formData.respiratoryRate),
          weight: formData.weight ? Number.parseFloat(formData.weight) : null,
          height: formData.height ? Number.parseFloat(formData.height) : null,
        }),
      })

      if (response.ok) {
        setMessage("Vitals recorded successfully!")
        setFormData({
          patientId: "",
          systolic: "",
          diastolic: "",
          heartRate: "",
          temperature: "",
          oxygenSaturation: "",
          respiratoryRate: "",
          weight: "",
          height: "",
          notes: "",
        })
        mutate()
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Error recording vitals")
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

      {anomalies.length > 0 && (
        <div
          style={{
            background: "rgba(217, 119, 6, 0.1)",
            color: "#d97706",
            padding: "1rem",
            marginBottom: "1.5rem",
            borderLeft: "4px solid #d97706",
          }}
        >
          <strong>Anomalies Detected:</strong>
          <ul style={{ marginTop: "0.5rem", marginLeft: "1.5rem" }}>
            {anomalies.map((anomaly, idx) => (
              <li key={idx}>{anomaly}</li>
            ))}
          </ul>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ background: "#f8f9fa", padding: "2rem", marginBottom: "2rem", border: "1px solid #e0e0e0" }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
          Record Patient Vitals
        </h3>

        <div style={{ marginBottom: "1.5rem" }}>
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Systolic BP (mmHg) *
            </label>
            <input
              type="number"
              name="systolic"
              value={formData.systolic}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Diastolic BP (mmHg) *
            </label>
            <input
              type="number"
              name="diastolic"
              value={formData.diastolic}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Heart Rate (bpm) *
            </label>
            <input
              type="number"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Temperature (°C) *
            </label>
            <input
              type="number"
              step="0.1"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              SpO2 (%) *
            </label>
            <input
              type="number"
              name="oxygenSaturation"
              value={formData.oxygenSaturation}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Respiratory Rate (breaths/min) *
            </label>
            <input
              type="number"
              name="respiratoryRate"
              value={formData.respiratoryRate}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Height (cm)
            </label>
            <input
              type="number"
              step="0.1"
              name="height"
              value={formData.height}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
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

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem 2rem",
            background: loading ? "#9ca3af" : "#8b5cf6",
            color: "white",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {loading ? "Recording..." : "Record Vitals"}
        </button>
      </form>

      {/* Vitals History */}
      {vitals && vitals.length > 0 && (
        <div style={{ background: "#f8f9fa", padding: "2rem", border: "1px solid #e0e0e0" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
            Recent Vitals Records
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
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
                  BP
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  HR
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Temp
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  SpO2
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {vitals.slice(0, 10).map((vital: any) => (
                <tr key={vital.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td style={{ padding: "1rem", color: "#8b5cf6", fontWeight: "600" }}>{vital.patient_id}</td>
                  <td style={{ padding: "1rem" }}>
                    {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}
                  </td>
                  <td style={{ padding: "1rem" }}>{vital.heart_rate}</td>
                  <td style={{ padding: "1rem" }}>{vital.temperature}°C</td>
                  <td style={{ padding: "1rem" }}>{vital.oxygen_saturation}%</td>
                  <td style={{ padding: "1rem", fontSize: "0.85rem", color: "#6b7280" }}>
                    {new Date(vital.recorded_at).toLocaleTimeString()}
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
