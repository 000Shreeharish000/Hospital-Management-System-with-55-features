"use client"

import { useEffect, useRef, useState } from "react"

type SourceId = "doctor" | "lab" | "nursing"
type SourceStatus = "idle" | "loading" | "ready"

type SourceRecord = {
  status: SourceStatus
  data: string
}

type SourceState = Record<SourceId, SourceRecord>

type CompiledSources = Record<SourceId, string>

const sourceConfigs: { id: SourceId; label: string; description: string }[] = [
  { id: "doctor", label: "Doctor Notes", description: "Attending physician discharge instructions." },
  { id: "lab", label: "Test Reports", description: "Key laboratory and imaging findings." },
  { id: "nursing", label: "Nursing Updates", description: "Vitals and inpatient care observations." },
]

const totalGenerationDurationMs = 11000

const doctorNarratives = [
  "Patient is stable at discharge with resolved presenting complaint.",
  "Symptoms have improved significantly; advised to continue oral medications.",
  "Pain levels are controlled and mobility has returned to baseline.",
  "No acute distress observed; patient educated about warning signs.",
]

const labHighlights = [
  "CBC within acceptable limits, mild anemia noted.",
  "Renal function stable; electrolytes corrected during stay.",
  "Chest X-ray shows clear lung fields with improved aeration.",
  "Inflammatory markers trending downwards over the last 48 hours.",
]

const nursingObservations = [
  "Vitals stable for 24 hours; afebrile and oriented.",
  "Patient ambulating with minimal assistance and tolerating oral diet.",
  "Fluid balance maintained with adequate urine output.",
  "No falls or pressure injuries during admission; skin intact.",
]

const diagnoses = [
  "Acute Gastroenteritis",
  "Community Acquired Pneumonia",
  "Hypertensive Emergency",
  "Type 2 Diabetes Mellitus - Glycemic Optimization",
  "Post-Operative Recovery (Laparoscopic Appendectomy)",
]

const procedures = [
  "IV rehydration and electrolyte correction",
  "Broad-spectrum antibiotic coverage",
  "Insulin titration with sliding scale",
  "Physiotherapy and breathing exercises",
  "Laparoscopic appendectomy with uneventful recovery",
]

const dischargeMedications = [
  "Pantoprazole 40mg OD before breakfast",
  "Azithromycin 500mg OD for 3 days",
  "Metformin 500mg BD with meals",
  "Losartan 50mg OD at night",
  "Acetaminophen 650mg SOS for pain",
]

const followUps = [
  "Review with primary physician in 7 days",
  "Repeat CBC and renal profile before follow-up",
  "Continue physiotherapy exercises twice daily",
  "Monitor blood pressure twice daily and maintain log",
  "Adhere to diabetic diet plan and monitor fasting sugars",
]

const dietPlans = [
  "Soft diet with adequate hydration; avoid spicy foods",
  "Low-salt cardiac diet rich in fruits and vegetables",
  "High-protein diet with supplemental shakes",
  "Diabetic-friendly meal plan with controlled carbohydrates",
]

const createInitialSourceState = (): SourceState => ({
  doctor: { status: "idle", data: "" },
  lab: { status: "idle", data: "" },
  nursing: { status: "idle", data: "" },
})

const pickRandom = (items: string[]) => items[Math.floor(Math.random() * items.length)]

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const generateSourceData = (sourceId: SourceId, patientId: string) => {
  const idSnippet = patientId.trim() || "P-XXXX"
  switch (sourceId) {
    case "doctor":
      return `Dr. ${pickRandom(["Iyer", "Kannan", "Fernandes", "Menon"])}: ${pickRandom(doctorNarratives)} (Ref: ${idSnippet})`
    case "lab":
      return `Lab Desk: ${pickRandom(labHighlights)} (Sample ID: ${Math.floor(100000 + Math.random() * 900000)})`
    case "nursing":
      return `Sr. Nurse ${pickRandom(["Priya", "Lakshmi", "Anita", "Divya"])}: ${pickRandom(nursingObservations)}`
    default:
      return ""
  }
}

  const generateReportHtml = (patientId: string, sources: CompiledSources) => {
    const safePatientId = escapeHtml(patientId)
    const reportNumber = `DS-${Math.floor(1000 + Math.random() * 9000)}`
    const admissionDaysAgo = Math.floor(2 + Math.random() * 5)
    const admissionDate = new Date(Date.now() - admissionDaysAgo * 24 * 60 * 60 * 1000)
    const dischargeDate = new Date()
    const formatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" })

    const summary = pickRandom(doctorNarratives)
    const keyDiagnosis = pickRandom(diagnoses)
    const keyProcedure = pickRandom(procedures)
    const meds = shuffleSelect(dischargeMedications, 3)
    const follow = shuffleSelect(followUps, 3)
    const diet = pickRandom(dietPlans)

    return `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <div style="display: flex; align-items: center; border-bottom: 2px solid #0ea5a4; padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <img src="/srm-trichylogo-300x150.jpg" alt="SRM Hospital" style="height: 64px; margin-right: 1.5rem; object-fit: contain;" />
          <div>
            <h1 style="margin: 0; font-size: 1.6rem; font-weight: 600;">SRM Trichy Medical Center</h1>
            <p style="margin: 0.25rem 0 0; font-size: 0.95rem; color: #475569;">Discharge Summary</p>
          </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.95rem;">
          <tbody>
            <tr>
              <td style="padding: 0.3rem 0;"><strong>Patient ID</strong></td>
              <td style="padding: 0.3rem 0;">${safePatientId}</td>
              <td style="padding: 0.3rem 0;"><strong>Summary No.</strong></td>
              <td style="padding: 0.3rem 0;">${reportNumber}</td>
            </tr>
            <tr>
              <td style="padding: 0.3rem 0;"><strong>Admission Date</strong></td>
              <td style="padding: 0.3rem 0;">${formatter.format(admissionDate)}</td>
              <td style="padding: 0.3rem 0;"><strong>Discharge Date</strong></td>
              <td style="padding: 0.3rem 0;">${formatter.format(dischargeDate)}</td>
            </tr>
            <tr>
              <td style="padding: 0.3rem 0;"><strong>Primary Diagnosis</strong></td>
              <td style="padding: 0.3rem 0;">${escapeHtml(keyDiagnosis)}</td>
              <td style="padding: 0.3rem 0;"><strong>Primary Procedure</strong></td>
              <td style="padding: 0.3rem 0;">${escapeHtml(keyProcedure)}</td>
            </tr>
          </tbody>
        </table>
        <div style="margin-bottom: 1.5rem;">
          <h2 style="margin: 0 0 0.5rem; font-size: 1.15rem;">Clinical Course</h2>
          <p style="margin: 0;">${escapeHtml(summary)}</p>
          <p style="margin: 0.4rem 0 0;">${escapeHtml(sources.doctor || "Doctor summary unavailable.")}</p>
        </div>
        <div style="margin-bottom: 1.5rem;">
          <h2 style="margin: 0 0 0.5rem; font-size: 1.15rem;">Investigations</h2>
          <p style="margin: 0;">${escapeHtml(sources.lab || "Investigations pending from laboratory.")}</p>
        </div>
        <div style="margin-bottom: 1.5rem;">
          <h2 style="margin: 0 0 0.5rem; font-size: 1.15rem;">Nursing &amp; Ward Notes</h2>
          <p style="margin: 0;">${escapeHtml(sources.nursing || "No nursing updates recorded.")}</p>
        </div>
        <div style="margin-bottom: 1.5rem;">
          <h2 style="margin: 0 0 0.5rem; font-size: 1.15rem;">Medications on Discharge</h2>
          <ul style="margin: 0; padding-left: 1.2rem;">
            ${meds.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </div>
        <div style="margin-bottom: 1.5rem;">
          <h2 style="margin: 0 0 0.5rem; font-size: 1.15rem;">Follow-up Plan</h2>
          <ul style="margin: 0; padding-left: 1.2rem;">
            ${follow.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </div>
        <div>
          <h2 style="margin: 0 0 0.5rem; font-size: 1.15rem;">Dietary Advice</h2>
          <p style="margin: 0;">${escapeHtml(diet)}</p>
        </div>
      </div>
    `
  }

  const shuffleSelect = (source: string[], count: number) => {
    const copy = [...source]
    const results: string[] = []
    while (copy.length && results.length < count) {
      const index = Math.floor(Math.random() * copy.length)
      results.push(copy.splice(index, 1)[0])
    }
    return results
  }

  export default function DischargeSummaryGenerator() {
    const [patientId, setPatientId] = useState("")
    const [sources, setSources] = useState<SourceState>(() => createInitialSourceState())
    const [error, setError] = useState("")
    const [statusMessage, setStatusMessage] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [generationProgress, setGenerationProgress] = useState(0)
    const [reportHtml, setReportHtml] = useState<string | null>(null)
    const timersRef = useRef<{ intervals: number[]; timeouts: number[] }>({ intervals: [], timeouts: [] })

    const clearTimers = () => {
      timersRef.current.intervals.forEach((intervalId) => window.clearInterval(intervalId))
      timersRef.current.timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId))
      timersRef.current = { intervals: [], timeouts: [] }
    }

    useEffect(() => {
      return () => {
        clearTimers()
      }
    }, [])

    const handleSourceFetch = (sourceId: SourceId) => {
      if (!patientId.trim()) {
        setError("Enter a patient ID before fetching data.")
        return
      }
      setError("")
      setStatusMessage(`Fetching ${sourceConfigs.find((s) => s.id === sourceId)?.label ?? "details"}...`)
      setReportHtml(null)

      setSources((prev) => ({
        ...prev,
        [sourceId]: { status: "loading", data: "" },
      }))

      const delay = 700 + Math.random() * 1400
      const timeoutId = window.setTimeout(() => {
        setSources((prev) => ({
          ...prev,
          [sourceId]: { status: "ready", data: generateSourceData(sourceId, patientId) },
        }))
        setStatusMessage(`${sourceConfigs.find((s) => s.id === sourceId)?.label ?? "Details"} synced.`)
      }, delay)

      timersRef.current.timeouts.push(timeoutId)
    }

    const handleGenerateSummary = () => {
      if (!patientId.trim()) {
        setError("Patient ID is required to generate the discharge summary.")
        return
      }

      if (sourceConfigs.some((config) => sources[config.id].status !== "ready")) {
        setError("Fetch data from all three sources before generating.")
        return
      }

      setError("")
      setStatusMessage("Compiling discharge summary...")
      setIsGenerating(true)
      setGenerationProgress(0)
      setReportHtml(null)
      clearTimers()

      const compiledSources: CompiledSources = {
        doctor: sources.doctor.data,
        lab: sources.lab.data,
        nursing: sources.nursing.data,
      }

      const start = Date.now()
      const intervalId = window.setInterval(() => {
        const elapsed = Date.now() - start
        const progress = Math.min(100, Math.round((elapsed / totalGenerationDurationMs) * 100))
        setGenerationProgress(progress)
      }, 250)

      const timeoutId = window.setTimeout(() => {
        window.clearInterval(intervalId)
        setGenerationProgress(100)
        setIsGenerating(false)
        setStatusMessage("Discharge summary generated successfully.")
        setReportHtml(generateReportHtml(patientId.trim(), compiledSources))
      }, totalGenerationDurationMs)

      timersRef.current.intervals.push(intervalId)
      timersRef.current.timeouts.push(timeoutId)
    }

    const handleReset = () => {
      clearTimers()
      setPatientId("")
      setSources(createInitialSourceState())
      setError("")
      setStatusMessage("")
      setIsGenerating(false)
      setGenerationProgress(0)
      setReportHtml(null)
    }

    const getStatusBadge = (status: SourceStatus) => {
      switch (status) {
        case "loading":
          return { label: "Syncing", color: "#f97316" }
        case "ready":
          return { label: "Ready", color: "#10b981" }
        default:
          return { label: "Pending", color: "#6b7280" }
      }
    }

    return (
      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", padding: "2rem", borderRadius: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#1f2937" }}>Discharge Summary Generator</h2>
            <p style={{ margin: "0.35rem 0 0", color: "#6b7280" }}>
              Enter the patient ID, fetch details from all departments, and generate an SRM-styled summary.
            </p>
          </div>
          <button
            onClick={handleReset}
            style={{
              padding: "0.6rem 1rem",
              border: "1px solid #cbd5e1",
              background: "white",
              color: "#1f2937",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="patient-id-input" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 600, color: "#1f2937" }}>
              Patient ID
            </label>
            <input
              id="patient-id-input"
              type="text"
              placeholder="Enter patient ID (e.g. P-1423)"
              value={patientId}
              onChange={(event) => setPatientId(event.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 0.9rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "0.95rem",
                background: "white",
              }}
            />
          </div>
          <button
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            style={{
              padding: "0.9rem 1.6rem",
              background: isGenerating ? "#9ca3af" : "#0f172a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: isGenerating ? "not-allowed" : "pointer",
              minWidth: "210px",
            }}
          >
            {isGenerating ? "Generating..." : "Generate Summary"}
          </button>
        </div>

        {error && (
          <div style={{
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
            borderRadius: "8px",
          }}>
            {error}
          </div>
        )}

        {statusMessage && (
          <div style={{
            marginBottom: "1rem",
            padding: "0.75rem 1rem",
            background: "#ecfeff",
            border: "1px solid #a5f3fc",
            color: "#0f172a",
            borderRadius: "8px",
          }}>
            {statusMessage}
          </div>
        )}

        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginBottom: "2rem" }}>
          {sourceConfigs.map((config) => {
            const state = sources[config.id]
            const badge = getStatusBadge(state.status)
            return (
              <div key={config.id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.05rem", color: "#1f2937" }}>{config.label}</h3>
                    <p style={{ margin: "0.35rem 0 0", fontSize: "0.85rem", color: "#6b7280" }}>{config.description}</p>
                  </div>
                  <span style={{
                    padding: "0.25rem 0.6rem",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "white",
                    background: badge.color,
                  }}>
                    {badge.label}
                  </span>
                </div>
                <button
                  onClick={() => handleSourceFetch(config.id)}
                  disabled={state.status === "loading" || isGenerating}
                  style={{
                    padding: "0.6rem 1rem",
                    background: state.status === "ready" ? "#10b981" : "#1f2937",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: state.status === "loading" || isGenerating ? "not-allowed" : "pointer",
                    width: "100%",
                    marginBottom: state.data ? "0.75rem" : 0,
                  }}
                >
                  {state.status === "loading" ? "Getting..." : state.status === "ready" ? "Re-fetch" : `Get ${config.label}`}
                </button>
                {state.data && (
                  <div style={{
                    background: "#f8fafc",
                    border: "1px solid #dbeafe",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    fontSize: "0.85rem",
                    color: "#1f2937",
                  }}>
                    {state.data}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {isGenerating && (
          <div style={{ marginBottom: "1.5rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "1rem" }}>
            <p style={{ margin: "0 0 0.5rem", color: "#1f2937", fontWeight: 600 }}>Compiling report...</p>
            <div style={{ height: "10px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
              <div style={{ width: `${generationProgress}%`, height: "100%", background: "#0ea5e9", transition: "width 0.2s ease" }} />
            </div>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "#64748b" }}>{generationProgress}% complete (11s simulation)</p>
          </div>
        )}

        {reportHtml && (
          <div>
            <h3 style={{ margin: "0 0 0.75rem", fontSize: "1.2rem", color: "#1f2937" }}>Preview</h3>
            <div
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              }}
              dangerouslySetInnerHTML={{ __html: reportHtml }}
            />
          </div>
        )}
      </div>
    )
  }
