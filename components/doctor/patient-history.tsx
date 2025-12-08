"use client"

import { useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function PatientHistory() {
  const [searchId, setSearchId] = useState("")
  const [patientId, setPatientId] = useState<string | null>(null)

  const { data: patients } = useSWR(searchId ? `/api/patients?patientId=${searchId}` : null, fetcher)
  const { data: vitals } = useSWR(patientId ? `/api/vitals?patientId=${patientId}` : null, fetcher, {
    refreshInterval: 3000,
  })
  const { data: consultations } = useSWR(patientId ? `/api/consultations?patientId=${patientId}` : null, fetcher)

  const patientData = patients && patients.length > 0 ? patients[0] : null

  const handleSearch = () => {
    if (searchId.trim() && patientData) {
      setPatientId(patientData.id)
    }
  }

  return (
    <div>
      <div style={{ background: "#f8f9fa", padding: "2rem", marginBottom: "2rem", border: "1px solid #e0e0e0" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
          Search Patient History
        </h3>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Patient ID"
            style={{ flex: 1, padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
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
            Search
          </button>
        </div>
      </div>

      {patientData && (
        <div style={{ background: "#f8f9fa", padding: "2rem", border: "1px solid #e0e0e0" }}>
          {/* Patient Demographics */}
          <div style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #e0e0e0" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
              Patient Demographics
            </h3>
            <div
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}
            >
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>PATIENT ID</div>
                <div style={{ fontSize: "1rem", fontWeight: "600", color: "#06b6d4" }}>{patientData.patient_id}</div>
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
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>BLOOD GROUP</div>
                <div style={{ fontSize: "1rem", fontWeight: "600", color: "#1a1a1a" }}>{patientData.blood_type}</div>
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>PHONE</div>
                <div style={{ fontSize: "1rem", fontWeight: "600", color: "#1a1a1a" }}>{patientData.phone}</div>
              </div>
            </div>
          </div>

          {/* Medical History */}
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
          {vitals && vitals.length > 0 && (
            <div style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #e0e0e0" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
                Recent Vitals (from Nurse Records)
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
                      Date & Time
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
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: "2px solid #d0d0d0",
                      }}
                    >
                      RR
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vitals.slice(0, 5).map((vital: any) => (
                    <tr key={vital.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                      <td style={{ padding: "1rem", fontSize: "0.85rem" }}>
                        {new Date(vital.recorded_at).toLocaleString()}
                      </td>
                      <td style={{ padding: "1rem" }}>
                        {vital.blood_pressure_systolic}/{vital.blood_pressure_diastolic}
                      </td>
                      <td style={{ padding: "1rem" }}>{vital.heart_rate}</td>
                      <td style={{ padding: "1rem" }}>{vital.temperature}°C</td>
                      <td style={{ padding: "1rem" }}>{vital.oxygen_saturation}%</td>
                      <td style={{ padding: "1rem" }}>{vital.respiratory_rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Previous Consultations */}
          {consultations && consultations.length > 0 && (
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
                Previous Consultations
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
                      Diagnosis
                    </th>
                    <th
                      style={{
                        padding: "1rem",
                        textAlign: "left",
                        fontWeight: "600",
                        borderBottom: "2px solid #d0d0d0",
                      }}
                    >
                      Treatment Plan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map((con: any) => (
                    <tr key={con.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                      <td style={{ padding: "1rem", fontSize: "0.85rem" }}>
                        {new Date(con.consultation_date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem" }}>{con.diagnosis}</td>
                      <td style={{ padding: "1rem" }}>{con.treatment_plan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!patientData && searchId && (
        <div
          style={{
            background: "rgba(220, 38, 38, 0.1)",
            color: "#dc2626",
            padding: "1rem",
            borderLeft: "4px solid #dc2626",
          }}
        >
          No patient found with ID: {searchId}
        </div>
      )}
    </div>
  )
}
