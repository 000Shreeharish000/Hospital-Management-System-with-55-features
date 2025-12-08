"use client"

import type React from "react"
import { useEffect, useState } from "react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const mockQRData = [
    {
        "fullName": "Pragatheesh S",
        "phoneNumber": "9893284928",
        "dateOfBirth": "15-08-2005",
        "gender": "male",
        "bloodGroup": "b+",
        "address": "12 vasu nagar trichy",
        "emergencyContact": { // Correctly nested object structure
            "name": "paefga",
            "relation": "frnd",
            "phoneNumber": "0293019"
        },
        "medicalInformation": {
            "medicalHistory": "aids.",
            "allergies": "nothing"
        }
    }, // <-- Missing comma added here
    {
        "fullName": "Jane Smith", // Added fullName for consistency
        "phoneNumber": "5551234567", // Renamed from 'phone' for consistency
        "dateOfBirth": "1985-05-20",
        "gender": "F",
        "bloodGroup": "A-", // Renamed from 'bloodType' for consistency
        "address": "456 Oak Ave, Othertown, USA",
        "emergencyContact": { // Structured as an object for consistency
            "name": "John Smith",
            "relation": "Husband/Other", // Added a sample relation
            "phoneNumber": "5559876543"
        },
        "medicalInformation": { // Grouped medical info for consistency
            "medicalHistory": "Asthma",
            "allergies": "None"
        }
    }
];

export default function PatientRegistration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    bloodType: "",
    emergencyContact: "",
    emergencyPhone: "",
    allergies: "",
    medicalHistory: "",
  })

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: patients, mutate } = useSWR("/api/patients", fetcher, { refreshInterval: 2000 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleScanSuccess = (data: any) => {
    setFormData({
      ...formData,
      ...data,
    })
    setIsModalOpen(false)
    setMessage("Patient data pre-filled from QR scan.")
    setTimeout(() => setMessage(""), 3000)
  }

  const simulateScan = () => {
    const randomPatient = mockQRData[Math.floor(Math.random() * mockQRData.length)]
    handleScanSuccess(randomPatient)
  }

  useEffect(() => {
    let scanTimeout: NodeJS.Timeout
    if (isModalOpen) {
      // Simulate a delay for scanning
      scanTimeout = setTimeout(() => {
        simulateScan()
      }, 2500)
    }
    return () => {
      clearTimeout(scanTimeout)
    }
  }, [isModalOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setMessage("Patient registered successfully!")
        setFormData({
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          gender: "",
          email: "",
          phone: "",
          address: "",
          bloodType: "",
          emergencyContact: "",
          emergencyPhone: "",
          allergies: "",
          medicalHistory: "",
        })
        mutate() // Refresh patient list
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      setMessage("Error registering patient")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "black",
              width: "80%",
              maxWidth: "500px",
              height: "auto",
              aspectRatio: "1 / 1",
              borderRadius: "12px",
              position: "relative",
              overflow: "hidden",
              border: "2px solid #333",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "70%",
                height: "70%",
                border: "2px dashed #10b981",
                borderRadius: "8px",
              }}
            />
            <div
              className="scan-line"
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                right: "0",
                height: "3px",
                background: "linear-gradient(to right, transparent, #10b981, transparent)",
                animation: "scan 2.5s linear infinite",
              }}
            />
            <p
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                color: "white",
                fontSize: "1rem",
              }}
            >
              Scanning for QR Code...
            </p>
          </div>
          <style>
            {`
              @keyframes scan {
                0% { top: 0; }
                100% { top: 100%; }
              }
            `}
          </style>
        </div>
      )}
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

      <form
        onSubmit={handleSubmit}
        style={{ background: "#f8f9fa", padding: "2rem", marginBottom: "2rem", border: "1px solid #e0e0e0" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600", color: "#1a1a1a" }}>New Patient Registration</h3>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: "0.5rem 1rem",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Scan QR Code
          </button>
        </div>

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
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Date of Birth *
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            >
              <option value="">Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Blood Type
            </label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            >
              <option value="">Select Blood Type</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Emergency Contact
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
              Emergency Phone
            </label>
            <input
              type="tel"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #e0e0e0", fontSize: "0.95rem" }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
            Allergies
          </label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            rows={2}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #e0e0e0",
              fontSize: "0.95rem",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#1a1a1a" }}>
            Medical History
          </label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            rows={2}
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
            background: loading ? "#9ca3af" : "#3b82f6",
            color: "white",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {loading ? "Registering..." : "Register Patient"}
        </button>
      </form>

      {/* Registered Patients List */}
      {patients && patients.length > 0 && (
        <div style={{ background: "#f8f9fa", padding: "2rem", border: "1px solid #e0e0e0" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1a1a1a" }}>
            Recently Registered Patients
          </h3>
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
                  Name
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Phone
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Blood Type
                </th>
                <th
                  style={{ padding: "1rem", textAlign: "left", fontWeight: "600", borderBottom: "2px solid #d0d0d0" }}
                >
                  Registered
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.slice(0, 10).map((patient: any) => (
                <tr key={patient.id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td style={{ padding: "1rem", color: "#3b82f6", fontWeight: "600" }}>{patient.patient_id}</td>
                  <td style={{ padding: "1rem" }}>
                    {patient.first_name} {patient.last_name}
                  </td>
                  <td style={{ padding: "1rem" }}>{patient.phone}</td>
                  <td style={{ padding: "1rem" }}>{patient.blood_type || "-"}</td>
                  <td style={{ padding: "1rem", color: "#6b7280", fontSize: "0.9rem" }}>
                    {new Date(patient.created_at).toLocaleDateString()}
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
