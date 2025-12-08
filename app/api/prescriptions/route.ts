import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const patientId = searchParams.get("patientId")

    let query = supabase.from("prescriptions").select("*")

    if (patientId) {
      query = query.eq("patient_id", patientId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 })
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
      medication_name: body.medicationName,
      status: "pending",
    }

    const { data, error } = await supabase.from("prescriptions").insert([payload]).select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error creating prescription:", error)
    return NextResponse.json({ error: "Failed to create prescription" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, status } = body

    const { data, error } = await supabase.from("prescriptions").update({ status }).eq("id", id).select()

    if (error) throw error
    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating prescription:", error)
    return NextResponse.json({ error: "Failed to update prescription" }, { status: 500 })
  }
}
