"use client"

import { useMemo } from "react"

interface Ward {
  name: string
  beds: number
  occupied: number
}

export default function WardManagement() {
  const wards: Ward[] = [
    { name: "ICU", beds: 20, occupied: 16 },
    { name: "General Ward A", beds: 40, occupied: 28 },
    { name: "General Ward B", beds: 36, occupied: 30 },
    { name: "Maternity", beds: 18, occupied: 12 },
  ]

  const total = useMemo(() => {
    const beds = wards.reduce((s, w) => s + w.beds, 0)
    const occ = wards.reduce((s, w) => s + w.occupied, 0)
    return { beds, occ, free: beds - occ, util: Math.round((occ / beds) * 100) }
  }, [wards])

  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", padding: "1.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1rem" }}>Ward Management</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{ border: "1px solid #e5e7eb", padding: "1rem" }}>
          <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>Total Beds</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>{total.beds}</div>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: "1rem" }}>
          <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>Occupied</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111827" }}>{total.occ}</div>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: "1rem" }}>
          <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>Free</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#10b981" }}>{total.free}</div>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: "1rem" }}>
          <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>Utilization</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#3b82f6" }}>{total.util}%</div>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#6b7280", fontSize: "0.875rem" }}>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Ward</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Beds</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Occupied</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Free</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Utilization</th>
            </tr>
          </thead>
          <tbody>
            {wards.map((w) => {
              const free = w.beds - w.occupied
              const util = Math.round((w.occupied / w.beds) * 100)
              return (
                <tr key={w.name} style={{ color: "#111827" }}>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{w.name}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{w.beds}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{w.occupied}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6", color: free > 0 ? "#10b981" : "#ef4444" }}>{free}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{util}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
