"use client"

import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PrescriptionFulfillment() {
  const [message, setMessage] = useState("")
  const { data: prescriptions, mutate } = useSWR("/api/prescriptions", fetcher, { refreshInterval: 2000 })

  const prescriptionList = Array.isArray(prescriptions) ? prescriptions : []
  const pendingPrescriptions = prescriptionList.filter((rx: any) => rx.status === "pending")

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch("/api/prescriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (response.ok) {
        setMessage(`Prescription status updated to ${newStatus}`)
        mutate()
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      console.error("Error updating prescription:", error)
    }
  }

  const statusColors: Record<string, string> = {
    pending: "#f59e0b",
    dispensed: "#059669",
    cancelled: "#dc2626",
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

      <div style={{ background: "#f8f9fa", padding: "2rem", border: "1px solid #e0e0e0" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
          Prescription Queue ({pendingPrescriptions.length} pending)
        </h3>

        {pendingPrescriptions.length > 0 ? (
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
                  Quantity
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Status
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {pendingPrescriptions.map((rx: any) => (
                <tr key={rx.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td style={{ padding: "1rem", color: "#f59e0b", fontWeight: "600" }}>{rx.patient_id}</td>
                  <td style={{ padding: "1rem" }}>{rx.medication_name}</td>
                  <td style={{ padding: "1rem" }}>{rx.dosage}</td>
                  <td style={{ padding: "1rem" }}>{rx.frequency}</td>
                  <td style={{ padding: "1rem" }}>{rx.quantity || "-"}</td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        background: `${statusColors[rx.status]}20`,
                        color: statusColors[rx.status],
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                      }}
                    >
                      {rx.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <select
                      value={rx.status}
                      onChange={(e) => updateStatus(rx.id, e.target.value)}
                      style={{
                        padding: "0.5rem",
                        border: "1px solid #e0e0e0",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="dispensed">Dispensed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No pending prescriptions</div>
        )}
      </div>
    </div>
  )
}
