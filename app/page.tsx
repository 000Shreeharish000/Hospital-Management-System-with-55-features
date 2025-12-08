"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/login-form"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole) {
      router.push(`/dashboard/${userRole}`)
    }
  }, [router])

  return <LoginForm />
}
