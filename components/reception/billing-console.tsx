"use client"

import { useMemo, useState } from "react"

type StatusTone = "info" | "success" | "error"

interface InvoiceItem {
  description: string
  amount: number
}

interface Invoice {
  reference: string
  generatedAt: string
  items: InvoiceItem[]
  total: number
  paymentMethod: string
}

const BASE_ITEMS: InvoiceItem[] = [
  { description: "Consultation Charges", amount: 950 },
  { description: "Lab Investigations", amount: 1420 },
  { description: "Pharmacy Dispensation", amount: 675 },
  { description: "Consumables", amount: 180 },
]

const PAYMENT_OPTIONS = [
  { id: "upi", label: "UPI", helper: "Supports hospital UPI handle and popular apps" },
  { id: "net-banking", label: "Net Banking", helper: "Secure redirect to partner bank gateway" },
  { id: "card", label: "Credit / Debit Card", helper: "Chip, swipe, and contactless cards accepted" },
  { id: "cash", label: "Cash", helper: "Record cash payment with teller acknowledgement" },
]

const statusStyles: Record<StatusTone, { background: string; border: string; color: string }> = {
  info: { background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8" },
  success: { background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#047857" },
  error: { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c" },
}

export default function BillingConsole() {
  const [patientId, setPatientId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [statusMessage, setStatusMessage] = useState("")
  const [statusTone, setStatusTone] = useState<StatusTone>("info")

  const formattedTotal = useMemo(() => {
    if (!invoice) return "0.00"
    return invoice.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })
  }, [invoice])

  const handleGenerate = () => {
    if (!patientId.trim()) {
      setStatusTone("error")
      setStatusMessage("Enter a patient ID before generating a payment request.")
      setInvoice(null)
      return
    }

    const total = BASE_ITEMS.reduce((acc, item) => acc + item.amount, 0)
    const reference = `INV-${patientId.replace(/[^a-z0-9]/gi, "").slice(-4).toUpperCase().padStart(4, "0")}-${
      Date.now() % 10000
    }`

    setInvoice({
      reference,
      generatedAt: new Date().toLocaleString(),
      items: BASE_ITEMS,
      total,
      paymentMethod,
    })
    setStatusTone("info")
    setStatusMessage("Payment request generated. Awaiting confirmation from the payer.")
  }

  const handleCheckStatus = () => {
    if (!invoice) {
      setStatusTone("error")
      setStatusMessage("Generate a payment request before checking payment status.")
      return
    }

    setStatusTone("success")
    setStatusMessage("Payment confirmed. Invoice closed and receipt ready for collection.")
  }

  return (
    <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", padding: "1.75rem" }}>
      <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#111827", marginBottom: "1rem" }}>
        Billing Console
      </h2>
      <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
        Create payment requests, share QR codes, and confirm settlements for front desk collections.
      </p>

      {statusMessage && (
        <div style={{ padding: "1rem", marginBottom: "1.5rem", ...statusStyles[statusTone] }}>{statusMessage}</div>
      )}

      <div style={{ display: "grid", gap: "1.25rem", marginBottom: "1.5rem" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <span style={{ fontWeight: 600, color: "#111827" }}>Patient ID</span>
          <input
            value={patientId}
            onChange={(e) => setPatientId(e.target.value.toUpperCase())}
            placeholder="Enter patient identifier"
            style={{ padding: "0.75rem", border: "1px solid #d1d5db", fontSize: "0.95rem", letterSpacing: "0.05em" }}
          />
        </label>

        <div>
          <span style={{ display: "block", fontWeight: 600, color: "#111827", marginBottom: "0.75rem" }}>
            Payment Method
          </span>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {PAYMENT_OPTIONS.map((option) => (
              <label
                key={option.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  border: paymentMethod === option.id ? "1px solid #3b82f6" : "1px solid #e5e7eb",
                  padding: "0.75rem 1rem",
                  background: paymentMethod === option.id ? "#eff6ff" : "#f9fafb",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={option.id}
                  checked={paymentMethod === option.id}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  style={{ marginTop: "0.2rem" }}
                />
                <span>
                  <span style={{ display: "block", fontWeight: 600, color: "#1f2937" }}>{option.label}</span>
                  <span style={{ display: "block", color: "#6b7280", fontSize: "0.85rem" }}>{option.helper}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <button
          onClick={handleGenerate}
          style={{
            padding: "0.75rem 1.5rem",
            border: "none",
            background: "#1d4ed8",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Generate Payment Request
        </button>
        <button
          onClick={handleCheckStatus}
          style={{
            padding: "0.75rem 1.5rem",
            border: "1px solid #1d4ed8",
            background: "white",
            color: "#1d4ed8",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Check Status
        </button>
      </div>

      {invoice && (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ display: "grid", gap: "0.75rem", justifyItems: "center" }}>
              <div
                aria-hidden
                style={{
                  width: "190px",
                  height: "190px",
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #111827 0, #111827 12px, #f3f4f6 12px, #f3f4f6 24px)",
                  display: "grid",
                  placeItems: "center",
                  color: "#f9fafb",
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                }}
              >
                QR
              </div>
              <p style={{ color: "#4b5563", fontSize: "0.9rem", textAlign: "center", maxWidth: "16rem" }}>
                Scan to pay via {PAYMENT_OPTIONS.find((option) => option.id === invoice.paymentMethod)?.label}.
              </p>
            </div>

            <div style={{ flex: "1 1 280px" }}>
              <div style={{ marginBottom: "1rem" }}>
                <span style={{ display: "block", fontSize: "0.85rem", color: "#6b7280" }}>Invoice Reference</span>
                <span style={{ fontWeight: 600, color: "#1f2937", letterSpacing: "0.08em" }}>{invoice.reference}</span>
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                <span style={{ display: "block", fontSize: "0.85rem", color: "#6b7280" }}>Generated</span>
                <span style={{ color: "#1f2937" }}>{invoice.generatedAt}</span>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#6b7280", fontSize: "0.85rem" }}>
                    <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb" }}>Billable Item</th>
                    <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.description} style={{ color: "#111827" }}>
                      <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{item.description}</td>
                      <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6", textAlign: "right" }}>
                        INR {item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td style={{ padding: "0.75rem", fontWeight: 700, color: "#1f2937" }}>Total</td>
                    <td style={{ padding: "0.75rem", textAlign: "right", fontWeight: 700, color: "#1f2937" }}>INR {formattedTotal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
