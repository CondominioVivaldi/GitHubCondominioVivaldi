"use client"

import Sidebar from "@/components/sidebar";
import "../globals.css"

export default function AddCondominoLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        {children}
      </div>
    </div>
  )
}