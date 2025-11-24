import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check environment variables
    const instanceId = process.env.ULTRAMSG_INSTANCE_ID
    const token = process.env.ULTRAMSG_TOKEN

    console.log("WhatsApp Debug Check:")
    console.log("Instance ID:", instanceId ? `${instanceId.substring(0, 10)}...` : "MISSING")
    console.log("Token:", token ? `${token.substring(0, 20)}...` : "MISSING")

    if (!instanceId || !token) {
      return NextResponse.json({
        success: false,
        message: "❌ WhatsApp credentials missing",
        debug: {
          instanceId: instanceId ? "✅ Set" : "❌ Missing",
          token: token ? "✅ Set" : "❌ Missing",
        },
        instructions: [
          "1. Sign up at https://ultramsg.com",
          "2. Create new WhatsApp instance",
          "3. Scan QR code with your WhatsApp",
          "4. Add credentials to .env.local:",
          "   ULTRAMSG_INSTANCE_ID=your_instance_id",
          "   ULTRAMSG_TOKEN=your_token",
          "5. Restart development server",
        ],
      })
    }

    // Test API connection
    const testResponse = await fetch(`https://api.ultramsg.com/${instanceId}/instance/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const instanceStatus = await testResponse.json()

    return NextResponse.json({
      success: true,
      message: "✅ WhatsApp credentials configured",
      debug: {
        instanceId: "✅ Set",
        token: "✅ Set",
        instanceStatus: instanceStatus,
      },
      nextSteps: [
        "✅ Credentials are configured",
        "📱 Test sending message from dashboard",
        "🔔 Order notifications should work now",
      ],
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "❌ WhatsApp debug failed",
      error: error instanceof Error ? error.message : "Unknown error",
      troubleshooting: [
        "1. Check internet connection",
        "2. Verify UltraMsg service status",
        "3. Check environment variables format",
        "4. Try again in a few minutes",
      ],
    })
  }
}
