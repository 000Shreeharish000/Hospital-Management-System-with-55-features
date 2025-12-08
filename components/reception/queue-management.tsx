"use client"

import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function QueueManagement() {
  const { data: queue, mutate } = useSWR("/api/queue?queueType=consultation", fetcher, { refreshInterval: 2000 })

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch("/api/queue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error("Error updating queue:", error)
    }
  }

  const removeFromQueue = async (id: string) => {
    try {
      const response = await fetch("/api/queue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "completed" }),
      })

      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error("Error removing from queue:", error)
    }
  }

  const statusColors: Record<string, string> = {
    waiting: "#f59e0b",
    "in-progress": "#06b6d4",
    completed: "#059669",
  }

  const queueList = queue || []
  const waitingCount = queueList.filter((q: any) => q.status === "waiting").length
  const inProgressCount = queueList.filter((q: any) => q.status === "in-progress").length
  const completedCount = queueList.filter((q: any) => q.status === "completed").length

  return (
    <div>
      <div style={{ background: "#f8f9fa", padding: "2rem", marginBottom: "2rem", border: "1px solid #e0e0e0" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
          Today's Queue ({queueList.length} patients)
        </h3>

        {queueList.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ background: "#e0e0e0" }}>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Position
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Patient ID
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Check-in Time
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Status
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {queueList.map((item: any, index: number) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td style={{ padding: "1rem", fontWeight: "600", color: "#1e40af" }}>{index + 1}</td>
                  <td style={{ padding: "1rem" }}>{item.patient_id}</td>
                  <td style={{ padding: "1rem", fontSize: "0.9rem" }}>
                    {new Date(item.created_at).toLocaleTimeString()}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        background: `${statusColors[item.status]}20`,
                        color: statusColors[item.status],
                        padding: "0.25rem 0.75rem",
                        fontSize: "0.85rem",
                        fontWeight: "500",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                      style={{
                        padding: "0.5rem",
                        border: "1px solid #e0e0e0",
                        fontSize: "0.85rem",
                        marginRight: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <option value="waiting">Waiting</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => removeFromQueue(item.id)}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#b91c1c")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#dc2626")}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No patients in queue</div>
        )}
      </div>

      {/* Queue Statistics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
        <div style={{ background: "#f8f9fa", padding: "1.5rem", border: "1px solid #e0e0e0" }}>
          <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>WAITING</div>
          <div style={{ fontSize: "2rem", fontWeight: "700", color: "#f59e0b" }}>{waitingCount}</div>
        </div>
        <div style={{ background: "#f8f9fa", padding: "1.5rem", border: "1px solid #e0e0e0" }}>
          <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>IN PROGRESS</div>
          <div style={{ fontSize: "2rem", fontWeight: "700", color: "#06b6d4" }}>{inProgressCount}</div>
        </div>
        <div style={{ background: "#f8f9fa", padding: "1.5rem", border: "1px solid #e0e0e0" }}>
          <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>COMPLETED</div>
          <div style={{ fontSize: "2rem", fontWeight: "700", color: "#059669" }}>{completedCount}</div>
        </div>
      </div>
    </div>
  )
}
