"use client"

import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ViewPatient() {
  const [searchType, setSearchType] = useState<"phone" | "patientId">("phone")
  const [searchValue, setSearchValue] = useState("")
  const [patientData, setPatientData] = useState<any>(null)
  const [vitals, setVitals] = useState<any[]>([])
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!searchValue.trim()) return

    setLoading(true)
    try {
      const query = searchType === "phone" ? `?phone=${searchValue}` : `?patientId=${searchValue}`
      const res = await fetch(`/api/patients${query}`)
      const patients = await res.json()

      if (patients.length > 0) {
        const patient = patients[0]
        setPatientData(patient)

        const vitalsRes = await fetch(`/api/vitals?patientId=${patient.id}`)
        const vitalsData = await vitalsRes.json()
        setVitals(vitalsData)

        const prescriptionsRes = await fetch(`/api/prescriptions?patientId=${patient.id}`)
        const prescriptionsData = await prescriptionsRes.json()
        setPrescriptions(prescriptionsData)
      } else {
        setPatientData(null)
        setVitals([])
        setPrescriptions([])
      }
    } catch (error) {
      console.error("Error searching patient:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ background: "#f8f9fa", padding: "2rem", marginBottom: "2rem", border: "1px solid #e0e0e0" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
          View Patient Details
        </h3>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as "phone" | "patientId")}
            style={{ padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
          >
            <option value="phone">Search by Phone</option>
            <option value="patientId">Search by Patient ID</option>
          </select>

          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={searchType === "phone" ? "Enter phone number" : "Enter patient ID"}
            style={{ flex: 1, padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem", minWidth: "200px" }}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: "0.75rem 2rem",
              background: loading ? "#9ca3af" : "#3b82f6",
              color: "white",
              border: "none",
              fontSize: "0.95rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {patientData && (
        <div style={{ background: "#f8f9fa", padding: "2rem", border: "1px solid #e0e0e0" }}>
          {/* Patient Info */}
          <div style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #e0e0e0" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
              Patient Information
            </h3>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}
            >
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>PATIENT ID</div>
                <div style={{ fontSize: "1rem", fontWeight: "600", color: "#3b82f6" }}>{patientData.patient_id}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>NAME</div>
                <div style={{ fontSize: "1rem", fontWeight: "600", color: "#1a1a1a" }}>
                  {patientData.first_name} {patientData.last_name}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>DATE OF BIRTH</div>
                <div style={{ fontSize: "1rem", fontWeight: "600", color: "#1a1a1a" }}>{patientData.date_of_birth}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>GENDER</div>
                <div style={{ fontSize: "1rem", fontWeight: "600", color: "#1a1a1a" }}>{patientData.gender}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>BLOOD TYPE</div>
                <div style={{ fontSize: "1rem", fontWeight: "600", color: "#1a1a1a" }}>{patientData.blood_type}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>PHONE</div>
                <div style={{ fontSize: "1rem", fontWeight: "600", color: "#1a1a1a" }}>{patientData.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>EMAIL</div>
                <div style={{ fontSize: "1rem", fontWeight: "600", color: "#1a1a1a" }}>{patientData.email}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>ADDRESS</div>
                <div style={{ fontSize: "1rem", fontWeight: "600", color: "#1a1a1a" }}>{patientData.address}</div>
              </div>
            </div>
          </div>

          {/* Allergies & Medical History */}
          <div style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #e0e0e0" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
              Medical Information
            </h3>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.75rem", color: "#1a1a1a" }}>
                Allergies
              </div>
              <div style={{ fontSize: "0.95rem", color: "#1a1a1a" }}>{patientData.allergies || "None recorded"}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.75rem", color: "#1a1a1a" }}>
                Medical History
              </div>
              <div style={{ fontSize: "0.95rem", color: "#1a1a1a" }}>
                {patientData.medical_history || "None recorded"}
              </div>
            </div>
          </div>

          {/* Recent Vitals */}
          {vitals.length > 0 && (
            <div style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #e0e0e0" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
                Recent Vitals
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "#e0e0e0" }}>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: "2px solid #d0d0d0",
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: "2px solid #d0d0d0",
                      }}
                    >
                      BP
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: "2px solid #d0d0d0",
                      }}
                    >
                      HR
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: "2px solid #d0d0d0",
                      }}
                    >
                      Temp
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: "2px solid #d0d0d0",
                      }}
                    >
                      SpO2
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vitals.slice(0, 5).map((vital: any) => (
                    <tr key={vital.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                      <td style={{ padding: "1rem" }}>{new Date(vital.recorded_at).toLocaleDateString()}</td>
                      <td style={{ padding: "1rem" }}>
                        {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}
                      </td>
                      <td style={{ padding: "1rem" }}>{vital.heart_rate}</td>
                      <td style={{ padding: "1rem" }}>{vital.temperature}°C</td>
                      <td style={{ padding: "1rem" }}>{vital.oxygen_saturation}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Active Prescriptions */}
          {prescriptions.length > 0 && (
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
                Active Prescriptions
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "#e0e0e0" }}>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: "2px solid #d0d0d0",
                      }}
                    >
                      Medication
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: "2px solid #d0d0d0",
                      }}
                    >
                      Dosage
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: "2px solid #d0d0d0",
                      }}
                    >
                      Frequency
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: "2px solid #d0d0d0",
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((rx: any) => (
                    <tr key={rx.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
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
      )}

      {!patientData && searchValue && !loading && (
        <div
          style={{
            background: "rgba(220, 38, 38, 0.1)",
            color: "#dc2626",
            padding: "1rem",
            borderLeft: "4px solid #dc2626",
          }}
        >
          No patient found with {searchType === "phone" ? "phone" : "patient ID"}: {searchValue}
        </div>
      )}
    </div>
  )
}
