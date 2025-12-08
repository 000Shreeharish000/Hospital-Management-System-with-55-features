"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

interface SidebarItem {
  label: string
  href: string
  icon: string
}

interface SidebarProps {
  role: string
  items: SidebarItem[]
  userName: string
}

export default function Sidebar({ role, items, userName }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const roleColors: Record<string, string> = {
    reception: "#3b82f6",
    nurse: "#8b5cf6",
    doctor: "#06b6d4",
    pharmacy: "#f59e0b",
    logistics: "#10b981",
  }

  const roleNames: Record<string, string> = {
    reception: "Reception",
    nurse: "Nurse",
    doctor: "Doctor",
    pharmacy: "Pharmacy",
    logistics: "Logistics",
  }

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userId")
    router.push("/")
  }

  return (
    <div
      style={{
        width: "30%",
        background: "#f8f9fa",
        borderRight: "1px solid #e0e0e0",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div style={{ padding: "1.5rem", borderBottom: "1px solid #e0e0e0" }}>
        <div style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" }}>LOGGED IN AS</div>
        <div style={{ fontSize: "1.1rem", fontWeight: "600", color: roleColors[role], marginBottom: "0.25rem" }}>
          {roleNames[role]}
        </div>
        <div style={{ fontSize: "0.9rem", color: "#1a1a1a" }}>{userName}</div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "1rem 0" }}>
        {items.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={`${item.label}`}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "1rem 1.5rem",
                color: isActive ? roleColors[role] : "#6b7280",
                textDecoration: "none",
                borderLeft: isActive ? `4px solid ${roleColors[role]}` : "4px solid transparent",
                background: isActive ? `${roleColors[role]}08` : "transparent",
                transition: "all 0.2s",
                fontSize: "0.95rem",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "#f0f0f0"
                  e.currentTarget.style.color = "#1a1a1a"
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent"
                  e.currentTarget.style.color = "#6b7280"
                }
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "1rem", borderTop: "1px solid #e0e0e0" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#f0f0f0",
            border: "1px solid #e0e0e0",
            color: "#1a1a1a",
            cursor: "pointer",
            fontSize: "0.95rem",
            fontWeight: "500",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#e0e0e0"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f0f0f0"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
