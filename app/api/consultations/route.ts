import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    let query = supabase.from("consultations").select("*")

    if (patientId) {
      query = query.eq("patient_id", patientId)
    }

    const { data, error } = await query.order("consultation_date", { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const payload = {
      patient_id: body.patientId,
      doctor_id: body.doctorId,
      appointment_id: body.appointmentId,
      diagnosis: body.diagnosis,
      symptoms: body.symptoms,
      treatment_plan: body.treatmentPlan,
      notes: body.notes,
      status: "completed",
    }

    const { data, error } = await supabase.from("consultations").insert([payload]).select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error creating consultation:", error)
    return NextResponse.json({ error: "Failed to create consultation" }, { status: 500 })
  }
}
