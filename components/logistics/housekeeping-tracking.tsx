"use client"

import { useState } from "react"

interface Task {
  id: string
  area: string
  assignedTo: string
  status: "Pending" | "In Progress" | "Done"
  due: string
}

export default function HousekeepingTracking() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "HK-001", area: "Ward A - Room 101", assignedTo: "Anita", status: "Pending", due: "10:30" },
    { id: "HK-002", area: "ER - Bay 3", assignedTo: "Mahesh", status: "In Progress", due: "ASAP" },
    { id: "HK-003", area: "ICU - Corridor", assignedTo: "Ravi", status: "Done", due: "09:00" },
  ])

  const [newArea, setNewArea] = useState("")
  const [newPerson, setNewPerson] = useState("")

  const createTask = () => {
    if (!newArea.trim() || !newPerson.trim()) return
    setTasks((prev) => [
      { id: `HK-${String(prev.length + 1).padStart(3, "0")}`, area: newArea, assignedTo: newPerson, status: "Pending", due: "--:--" },
      ...prev,
    ])
    setNewArea("")
    setNewPerson("")
  }

  const updateStatus = (id: string, status: Task["status"]) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  const badgeColor = (status: Task["status"]) =>
    ({ Pending: "#f59e0b", "In Progress": "#3b82f6", Done: "#10b981" }[status])

  return (
    <div style={{ background: "white", border: "1px solid #e5e7eb", padding: "1.5rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1rem" }}>Housekeeping Tracking</h2>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          placeholder="Area / Room"
          value={newArea}
          onChange={(e) => setNewArea(e.target.value)}
          style={{ padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb" }}
        />
        <input
          placeholder="Assign to"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          style={{ padding: "0.5rem 0.75rem", border: "1px solid #e5e7eb" }}
        />
        <button
          onClick={createTask}
          style={{ padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", background: "#f9fafb", fontWeight: 600 }}
        >
          Add Task
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#6b7280", fontSize: "0.875rem" }}>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Task</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Area</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Assigned To</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Status</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Due</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} style={{ color: "#111827" }}>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{t.id}</td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{t.area}</td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{t.assignedTo}</td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>
                  <span
                    style={{
                      background: `${badgeColor(t.status)}15`,
                      color: badgeColor(t.status),
                      padding: "0.25rem 0.5rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{t.due}</td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => updateStatus(t.id, "Pending")} style={{ padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", background: "#f9fafb" }}>
                      Pending
                    </button>
                    <button onClick={() => updateStatus(t.id, "In Progress")} style={{ padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", background: "#f9fafb" }}>
                      In Progress
                    </button>
                    <button onClick={() => updateStatus(t.id, "Done")} style={{ padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", background: "#f9fafb" }}>
                      Done
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
