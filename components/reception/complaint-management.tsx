"use client"

import type React from "react"

import { useState } from "react"

export default function ComplaintManagement() {
  const [formData, setFormData] = useState({
    patientId: "",
    complaintText: "",
    category: "",
  })

  const [complaints, setComplaints] = useState<any[]>([])
  const [message, setMessage] = useState("")

  const categories = ["Service Quality", "Staff Behavior", "Billing", "Facility", "Other"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newComplaint = {
      id: `CMP${Date.now()}`,
      ...formData,
      status: "New",
      createdDate: new Date().toLocaleDateString(),
    }
    setComplaints((prev) => [newComplaint, ...prev])
    setMessage("Complaint registered successfully!")
    setFormData({
      patientId: "",
      complaintText: "",
      category: "",
    })
    setTimeout(() => setMessage(""), 3000)
  }

  const updateStatus = (id: string, newStatus: string) => {
    setComplaints((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)))
  }

  const statusColors: Record<string, string> = {
    New: "#f59e0b",
    "In Progress": "#06b6d4",
    Resolved: "#059669",
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
          Register Complaint
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
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
            Complaint Details *
          </label>
          <textarea
            name="complaintText"
            value={formData.complaintText}
            onChange={handleChange}
            required
            rows={4}
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
            background: "#3b82f6",
            color: "white",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2563eb")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#3b82f6")}
        >
          Register Complaint
        </button>
      </form>

      {/* Complaints List */}
      {complaints.length > 0 && (
        <div style={{ background: "#f8f9fa", padding: "2rem", border: "1px solid #e0e0e0" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
            Complaints Log
          </h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ background: "#e0e0e0" }}>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Complaint ID
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Patient ID
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Category
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Details
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Status
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td style={{ padding: "1rem", color: "#3b82f6", fontWeight: "600" }}>{complaint.id}</td>
                  <td style={{ padding: "1rem" }}>{complaint.patientId}</td>
                  <td style={{ padding: "1rem" }}>{complaint.category}</td>
                  <td style={{ padding: "1rem", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {complaint.complaintText}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <select
                      value={complaint.status}
                      onChange={(e) => updateStatus(complaint.id, e.target.value)}
                      style={{
                        padding: "0.5rem",
                        border: "1px solid #e0e0e0",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        background: `${statusColors[complaint.status]}15`,
                        color: statusColors[complaint.status],
                        fontWeight: "500",
                      }}
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td style={{ padding: "1rem", color: "#6b7280" }}>{complaint.createdDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
