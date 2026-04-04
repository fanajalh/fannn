import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Providers } from "@/components/Providers"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
})

export const metadata: Metadata = {
  title: "JokiPoster - Jasa Desain Poster Profesional",
  description:
    "Layanan desain poster berkualitas tinggi untuk kebutuhan bisnis dan personal. Harga terjangkau, hasil memuaskan.",
  keywords: "jasa desain poster, desain grafis, poster event, poster promosi, logo design",
  icons: {
    icon: [
      { url: "/feed arfan (20).png", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.png", color: "#f97316" }],
  },
  manifest: "/site.webmanifest",
  themeColor: "#f97316",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  robots: "index, follow",
  authors: [{ name: "JokiPoster Team" }],
  creator: "JokiPoster",
  publisher: "JokiPoster",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://jokiposter.com",
    title: "JokiPoster - Jasa Desain Poster Profesional",
    description: "Layanan desain poster berkualitas tinggi untuk kebutuhan bisnis dan personal.",
    siteName: "JokiPoster",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JokiPoster - Jasa Desain Poster Profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JokiPoster - Jasa Desain Poster Profesional",
    description: "Layanan desain poster berkualitas tinggi untuk kebutuhan bisnis dan personal.",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/icon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.png" color="#f97316" />
        <meta name="theme-color" content="#f97316" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        {/* Tambahan import langsung jika ingin fallback font */}
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${jakarta.className} bg-slate-50 text-slate-900`}>
        <Providers>
          {/* MAIN APP CONTAINER */}
          <div className="w-full min-h-screen bg-white relative overflow-x-hidden flex flex-col mx-auto">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
