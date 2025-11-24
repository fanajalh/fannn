import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    console.log("Logout request received")

    // Get cookies store
    const cookieStore = await cookies()

    // Delete the admin session cookie
    cookieStore.delete("admin_session")

    console.log("Session cookie deleted")

    // Return JSON response instead of redirect for better error handling
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST() {
  try {
    console.log("Logout POST request received")

    // Get cookies store
    const cookieStore = await cookies()

    // Delete the admin session cookie
    cookieStore.delete("admin_session")

    console.log("Session cookie deleted via POST")

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    console.error("Logout POST error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Logout failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
