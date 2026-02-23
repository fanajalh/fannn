import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Kotak Saran Desain",
  description: "Bantu kami menjadi lebih baik melalui masukan Anda",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className="antialiased" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
