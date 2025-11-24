import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json()

    if (!process.env.ULTRAMSG_INSTANCE_ID || !process.env.ULTRAMSG_TOKEN) {
      return NextResponse.json({ success: false, message: "WhatsApp service not configured" }, { status: 500 })
    }

    const response = await fetch(`https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE_ID}/messages/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: process.env.ULTRAMSG_TOKEN,
        to: to,
        body: message,
      }),
    })

    const result = await response.json()

    if (response.ok && result.sent) {
      return NextResponse.json({ success: true, message: "WhatsApp message sent successfully" })
    } else {
      console.error("UltraMsg error:", result)
      return NextResponse.json(
        { success: false, message: "Failed to send WhatsApp message", error: result },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("WhatsApp API error:", error)
    return NextResponse.json({ success: false, message: "WhatsApp service error" }, { status: 500 })
  }
}
