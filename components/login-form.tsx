"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

type UserRole = "reception" | "nurse" | "doctor" | "pharmacy" | "logistics"

export default function LoginForm() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("")
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const roles: { id: UserRole; name: string; description: string }[] = [
    { id: "reception", name: "Reception Staff", description: "Patient registration & appointment booking" },
    { id: "nurse", name: "Nurse", description: "Vitals recording & patient care" },
    { id: "doctor", name: "Doctor", description: "Consultations & medical records" },
    { id: "pharmacy", name: "Pharmacy", description: "Prescription fulfillment & inventory" },
    { id: "logistics", name: "Logistics", description: "Ambulance, wards & housekeeping" },
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!userId.trim() || !password.trim() || !selectedRole) {
      setError("Please fill in all fields")
      return
    }

    localStorage.setItem("userRole", selectedRole)
    localStorage.setItem("userId", userId)

    router.push(`/dashboard/${selectedRole}`)
  }

  const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    background: "url('/srm.png') center/cover no-repeat, #1f2937",
  }

  const overlayStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "1000px",
    display: "flex",
    flexDirection: "row",
    background: "rgba(255,255,255,0.95)",
    borderRadius: "0",
    overflow: "hidden",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.25)",
  }

  return (
    <div style={containerStyle}>
      <style>{`
        .login-card { display: flex; width: 100%; }
        @media (max-width: 768px) {
          .login-card { flex-direction: column; }
          .login-card-image { min-height: 200px; }
        }
      `}</style>
      <div className="login-card" style={overlayStyle}>
        <div
          className="login-card-image"
          style={{
            flex: 1,
            background: "linear-gradient(135deg, rgba(39, 55, 82, 0.95), rgba(30, 41, 59, 0.95))",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem 2rem",
            gap: "1.5rem",
            color: "#e5e7eb",
          }}
        >
          <div
            style={{
              width: "220px",
              height: "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
              padding: "1rem",
            }}
          >
            <img
              src="/srm-trichylogo-300x150.jpg"
              alt="SRM Trichy Logo"
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          </div>
          <div style={{ textAlign: "center", maxWidth: "320px" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 500, marginBottom: "0.75rem" }}>Hospital Management System</h1>
            <p style={{ fontSize: "0.95rem", color: "#cbd5f5" }}>Secure access for clinical and operational teams.</p>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: "2.5rem 2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "1.5rem",
            background: "white",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.9rem", fontWeight: 600, color: "#1f2937", marginBottom: "0.5rem" }}>
              Welcome Back
            </h2>
            <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>Sign in to access your personalized dashboard.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "#1f2937" }}>
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your username"
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "0",
                  border: "2px solid #e5e7eb",
                  fontSize: "1rem",
                  background: "#f9fafb",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#334155")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "#1f2937" }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "0",
                  border: "2px solid #e5e7eb",
                  fontSize: "1rem",
                  background: "#f9fafb",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#334155")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: "#1f2937" }}>
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                style={{
                  width: "100%",
                  padding: "0.85rem 1rem",
                  borderRadius: "0",
                  border: "2px solid #e5e7eb",
                  fontSize: "1rem",
                  background: "#f9fafb",
                  color: selectedRole ? "#1f2937" : "#9ca3af",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#334155")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
              >
                <option value="">Choose your role...</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "0.9rem",
                background: "#1f2937",
                color: "white",
                border: "none",
                borderRadius: "0",
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Sign In
            </button>
          </form>

          {error && (
            <div
              style={{
                color: "#b91c1c",
                textAlign: "center",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                padding: "0.75rem",
                borderRadius: "0",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              background: "#f8f9fb",
              padding: "1rem",
              borderRadius: "0",
              borderLeft: "4px solid #334155",
              fontSize: "0.85rem",
              color: "#475569",
            }}
          >
            <strong style={{ display: "block", marginBottom: "0.5rem", color: "#1f2937" }}>
              Role Information
            </strong>
            {roles.map((role) => (
              <p key={role.id} style={{ marginBottom: "0.3rem" }}>
                <strong>{role.name}:</strong> {role.description}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
