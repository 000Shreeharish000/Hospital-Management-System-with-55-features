import { createClient } from "@/lib/supabase/route-handler"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get("phone")
    const patientId = searchParams.get("patientId")

    let query = supabase.from("patients").select("*")

    if (phone) {
      query = query.eq("phone", phone)
    } else if (patientId) {
      query = query.eq("patient_id", patientId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const patientId = `P${Date.now()}`
    const payload = {
      ...body,
      patient_id: patientId,
      first_name: body.firstName,
      last_name: body.lastName,
      date_of_birth: body.dateOfBirth,
      blood_type: body.bloodType,
      emergency_contact: body.emergencyContact,
      emergency_phone: body.emergencyPhone,
    }

    const { data, error } = await supabase.from("patients").insert([payload]).select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error creating patient:", error)
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 })
  }
}
