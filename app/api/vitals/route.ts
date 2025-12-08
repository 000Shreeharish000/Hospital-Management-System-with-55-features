import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    let query = supabase.from("vitals").select("*")

    if (patientId) {
      query = query.eq("patient_id", patientId)
    }

    const { data, error } = await query.order("recorded_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vitals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const payload = {
      ...body,
      patient_id: body.patientId,
      nurse_id: body.nurseId,
      blood_pressure_systolic: body.systolic,
      blood_pressure_diastolic: body.diastolic,
      heart_rate: body.heartRate,
      respiratory_rate: body.respiratoryRate,
      oxygen_saturation: body.oxygenSaturation,
      recorded_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("vitals").insert([payload]).select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error recording vitals:", error)
    return NextResponse.json({ error: "Failed to record vitals" }, { status: 500 })
  }
}
