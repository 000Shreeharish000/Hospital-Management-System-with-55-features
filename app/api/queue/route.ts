import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const queueType = searchParams.get("queueType")

    let query = supabase.from("queue").select("*, patients(*)")

    if (queueType) {
      query = query.eq("queue_type", queueType)
    }

    const { data, error } = await query.eq("status", "waiting").order("created_at", { ascending: true })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch queue" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const payload = {
      patient_id: body.patientId,
      queue_type: body.queueType,
      status: "waiting",
      position: body.position || 1,
    }

    const { data, error } = await supabase.from("queue").insert([payload]).select()

    if (error) throw error
    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("Error adding to queue:", error)
    return NextResponse.json({ error: "Failed to add to queue" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, status } = body

    const { data, error } = await supabase
      .from("queue")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()

    if (error) throw error
    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Error updating queue:", error)
    return NextResponse.json({ error: "Failed to update queue" }, { status: 500 })
  }
}
