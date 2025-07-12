import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import FloatingChat from "@/components/FloatingChat"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SmartCart AI - Intelligent Shopping Assistant",
  description: "AI-powered shopping cart with smart recommendations",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-gray-50">{children}</main>
        <FloatingChat />
      </body>
    </html>
  )
}
