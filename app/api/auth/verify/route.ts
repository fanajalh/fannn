import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin_session")

    console.log("Verifying session:", session) // Debug log

    if (!session) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const user = JSON.parse(session.value)
    console.log("Session user:", user) // Debug log

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Session verification error:", error)
    return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 })
  }
}
