import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    let query = supabase.from("appointments").select("*")

    if (patientId) {
      query = query.eq("patient_id", patientId)
    }

    const { data, error } = await query.order("appointment_date", { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const payload = {
      ...body,
      patient_id: body.patientId,
      doctor_id: body.doctorId,
      appointment_date: body.appointmentDate,
    }

    const { data, error } = await supabase.from("appointments").insert([payload]).select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, status } = body

    const { data, error } = await supabase.from("appointments").update({ status }).eq("id", id).select()

    if (error) throw error
    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}
