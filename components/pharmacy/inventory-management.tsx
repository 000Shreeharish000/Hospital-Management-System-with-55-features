"use client"

import type React from "react"
import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function InventoryManagement() {
  const [formData, setFormData] = useState({
    medicationName: "",
    unit: "",
    quantity: "",
    reorderLevel: "",
    supplier: "",
    price: "",
  })

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { data: inventory, mutate } = useSWR("/api/inventory", fetcher, { refreshInterval: 3000 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medication_name: formData.medicationName,
          unit: formData.unit,
          quantity: Number.parseInt(formData.quantity),
          reorder_level: Number.parseInt(formData.reorderLevel),
          supplier: formData.supplier,
          price: Number.parseFloat(formData.price),
        }),
      })

      if (response.ok) {
        setMessage("Medication added to inventory successfully!")
        setFormData({
          medicationName: "",
          unit: "",
          quantity: "",
          reorderLevel: "",
          supplier: "",
          price: "",
        })
        mutate()
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Error adding medication")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const lowStockItems = inventory?.filter((item: any) => item.quantity <= item.reorder_level) || []

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

      {lowStockItems.length > 0 && (
        <div
          style={{
            background: "rgba(217, 119, 6, 0.1)",
            color: "#d97706",
            padding: "1rem",
            marginBottom: "1.5rem",
            borderLeft: "4px solid #d97706",
          }}
        >
          <strong>Low Stock Alert:</strong> {lowStockItems.length} medication(s) need reordering
        </div>
      )}

      <form
        onSubmit={handleAddStock}
        style={{ background: "#f8f9fa", padding: "2rem", marginBottom: "2rem", border: "1px solid #e0e0e0" }}
      >
        <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
          Add Medication to Inventory
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
              Unit *
            </label>
            <input
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g., tablets, ml"
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Reorder Level *
            </label>
            <input
              type="number"
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Supplier *
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Price
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
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
            background: loading ? "#9ca3af" : "#f59e0b",
            color: "white",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {loading ? "Adding..." : "Add to Inventory"}
        </button>
      </form>

      {/* Inventory List */}
      <div style={{ background: "#f8f9fa", padding: "2rem", border: "1px solid #e0e0e0" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
          Current Inventory
        </h3>

        {inventory && inventory.length > 0 ? (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
            <thead>
              <tr style={{ background: "#e0e0e0" }}>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Medication
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Unit
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Quantity
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Reorder Level
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Status
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Supplier
                </th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item: any) => {
                const isLowStock = item.quantity <= item.reorder_level
                return (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: "1px solid #e0e0e0",
                      background: isLowStock ? "rgba(217, 119, 6, 0.05)" : "transparent",
                    }}
                  >
                    <td style={{ padding: "1rem", fontWeight: "600", color: "#1a1a1a" }}>{item.medication_name}</td>
                    <td style={{ padding: "1rem" }}>{item.unit}</td>
                    <td style={{ padding: "1rem", fontWeight: "600", color: isLowStock ? "#d97706" : "#1a1a1a" }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: "1rem" }}>{item.reorder_level}</td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          background: isLowStock ? "rgba(217, 119, 6, 0.1)" : "rgba(5, 150, 105, 0.1)",
                          color: isLowStock ? "#d97706" : "#059669",
                          padding: "0.25rem 0.75rem",
                          fontSize: "0.85rem",
                          fontWeight: "500",
                        }}
                      >
                        {isLowStock ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>{item.supplier}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>No inventory items</div>
        )}
      </div>
    </div>
  )
}
