"use client"

import { useState, useEffect } from "react"
import {
  Palette, RefreshCw, LogOut, WifiOff, AlertCircle,
  BarChart3, FileText, MessageSquare, TrendingUp,
  Globe, CreditCard, Settings, Newspaper, X, LayoutGrid
} from "lucide-react"
import Swal from "sweetalert2"

import {
  TabOverview, TabOrders, TabSuggestions, TabAnalytics,
  TabWebsite, TabPricing, TabSettings, TabContent,
  OrderDetailModal, EditOrderModal, SuggestionModal,
  GRADIENT_ORANGE, DEFAULT_SETTINGS,
  type Order, type Analytics, type WebsiteSettings, type Suggestion,
} from "@/components/dashboard"

const TAB_ICONS: Record<string, any> = {
  overview: BarChart3, orders: FileText, content: Newspaper, suggestions: MessageSquare,
  analytics: TrendingUp, website: Globe, pricing: CreditCard, settings: Settings,
}

const TABS = [
  { id: "overview", label: "Overview", color: "blue" },
  { id: "orders", label: "Orders", color: "orange" },
  { id: "content", label: "Konten", color: "rose" },
  { id: "suggestions", label: "Saran", color: "amber" },
  { id: "analytics", label: "Analytics", color: "emerald" },
  { id: "website", label: "Website", color: "indigo" },
  { id: "pricing", label: "Pricing", color: "purple" },
  { id: "settings", label: "System", color: "slate" },
]

export default function Dashboard() {
  // --- STATES ---
  const [orders, setOrders] = useState<Order[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State untuk Menu Mengambang
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "mock" | "error">("connected")
  const [error, setError] = useState("")
  const [loggingOut, setLoggingOut] = useState(false)
  const [editingSettings, setEditingSettings] = useState(false)

  // Modal States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [suggestionResponse, setSuggestionResponse] = useState("")

  // --- EFFECTS ---
  useEffect(() => {
    fetchOrders()
    fetchAnalytics()
    fetchSuggestions()
    loadWebsiteSettings()
  }, [])

  // --- API FUNCTIONS ---
  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      const { signOut } = await import("next-auth/react")
      await signOut({ callbackUrl: "/login" })
    } catch { window.location.href = "/login" }
    finally { setLoggingOut(false) }
  }

  const fetchOrders = async () => {
    try {
      setError("")
      const response = await fetch("/api/orders")
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
        setConnectionStatus(data.message?.includes("mock") ? "mock" : "connected")
      } else throw new Error(data.message)
    } catch (error) {
      setConnectionStatus("error")
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally { setLoading(false) }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      if (!response.ok) return
      const data = await response.json()
      if (data.success) setAnalytics(data.analytics)
    } catch (error) { console.error(error) }
  }

  const fetchSuggestions = async () => {
    try {
      const res = await fetch("/api/suggestions")
      const json = await res.json()
      setSuggestions(json.data || [])
    } catch { setSuggestions([]) }
  }

  const loadWebsiteSettings = () => {
    const saved = localStorage.getItem("websiteSettings")
    if (saved) setWebsiteSettings(JSON.parse(saved))
  }

  const saveWebsiteSettings = async () => {
    try {
      localStorage.setItem("websiteSettings", JSON.stringify(websiteSettings))
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Settings saved successfully!', timer: 1500, showConfirmButton: false })
      setEditingSettings(false)
    } catch { Swal.fire({ icon: 'error', text: 'Failed to save settings' }) }
  }

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (response.ok) {
        fetchOrders(); fetchAnalytics(); setEditingOrder(null)
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Order updated successfully!', timer: 1500, showConfirmButton: false })
      }
    } catch { Swal.fire({ icon: 'error', text: 'Failed to update order' }) }
  }

  const deleteOrder = async (orderId: string) => {
    const result = await Swal.fire({ title: 'Hapus Pesanan?', text: "Pesanan yang dihapus tidak bisa dikembalikan.", icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, Hapus!' })
    if (!result.isConfirmed) return
    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: "DELETE" })
      if (response.ok) { fetchOrders(); fetchAnalytics() }
    } catch { Swal.fire({ icon: 'error', text: 'Failed to delete order' }) }
  }

  const duplicateOrder = async (order: Order) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: { name: order.name, email: order.email, phone: order.phone, company: order.company },
          service: order.service, package: order.package,
          details: { title: order.title, description: order.description, dimensions: order.dimensions, colors: order.colors, deadline: order.deadline, additionalInfo: order.additional_info },
        }),
      })
      if (response.ok) { fetchOrders(); Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Order duplicated!', timer: 1500, showConfirmButton: false }) }
    } catch { Swal.fire({ icon: 'error', text: 'Failed to duplicate' }) }
  }

  const handleBulkAction = async (action: string, ids: string[]) => {
    const result = await Swal.fire({ title: 'Konfirmasi', text: `Apply ${action} to ${ids.length} selected orders?`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Lanjutkan' })
    if (!result.isConfirmed) return
    try {
      const promises = ids.map((orderId) => {
        if (action === "delete") return fetch(`/api/orders/${orderId}`, { method: "DELETE" })
        return fetch(`/api/orders/${orderId}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action }),
        })
      })
      await Promise.all(promises)
      fetchOrders(); fetchAnalytics()
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Bulk action completed!', timer: 1500, showConfirmButton: false })
    } catch { Swal.fire({ icon: 'error', text: 'Bulk action failed' }) }
  }

  const exportOrders = async () => {
    try {
      const response = await fetch("/api/orders/export")
      if (!response.ok) { Swal.fire({ icon: 'warning', text: 'Export not available' }); return }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url; a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a); a.click()
      window.URL.revokeObjectURL(url); document.body.removeChild(a)
    } catch { Swal.fire({ icon: 'error', text: 'Failed to export data' }) }
  }

  const sendWhatsAppMessage = (phone: string, orderNumber: string) => {
    const message = `Halo! Update mengenai pesanan Anda ${orderNumber}. Silakan hubungi kami untuk info lebih lanjut.`
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank")
  }

  const handleSuggestionSubmit = async () => {
    if (!selectedSuggestion) return
    try {
      const res = await fetch(`/api/admin/suggestions/${selectedSuggestion.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: suggestionResponse, status: "reviewed" }),
      })
      if (res.ok) { setSelectedSuggestion(null); fetchSuggestions() }
      else Swal.fire({ icon: 'error', text: 'Gagal menyimpan' })
    } catch { Swal.fire({ icon: 'error', text: 'Error jaringan' }) }
  }

  // --- COMPUTED ---
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }

  // Active Tab Info
  const currentTabInfo = TABS.find(t => t.id === activeTab) || TABS[0]

  // --- LOADING STATE ---
  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mb-4" />
      <p className="font-bold text-gray-400 animate-pulse tracking-widest uppercase text-xs">Loading Dashboard</p>
    </div>
  )

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 pb-24 select-none">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-[40] bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-4 mb-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${GRADIENT_ORANGE} rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0`}>
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-gray-900 leading-none">JokiPoster <span className="text-[#FF7A00]">Admin</span></h1>
              <div className="flex items-center gap-2 mt-1">
                {connectionStatus === "connected" ? (
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                    <WifiOff size={10} /> Demo
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { fetchOrders(); fetchAnalytics() }} className="p-2.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all" title="Refresh Data">
              <RefreshCw size={20} />
            </button>
            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />
            <button onClick={handleLogout} disabled={loggingOut} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50">
              <LogOut size={16} /> <span className="text-xs">{loggingOut ? "Keluar..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <div><p className="font-bold text-sm">Connection Error</p><p className="text-xs">{error}</p></div>
          </div>
        )}

        {/* Dynamic Title based on Active Tab */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{currentTabInfo.label}</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Kelola data {currentTabInfo.label}</p>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-300">
          {activeTab === "overview" && <TabOverview stats={stats} analytics={analytics} orders={orders} setActiveTab={setActiveTab} />}
          {activeTab === "orders" && (
            <TabOrders orders={orders} onViewOrder={setSelectedOrder} onEditOrder={setEditingOrder}
              onDuplicateOrder={duplicateOrder} onDeleteOrder={deleteOrder}
              onSendWhatsApp={sendWhatsAppMessage} onExportOrders={exportOrders}
              onBulkAction={handleBulkAction} />
          )}
          {activeTab === "suggestions" && (
            <TabSuggestions suggestions={suggestions} onRefresh={fetchSuggestions}
              onViewSuggestion={(s) => { setSelectedSuggestion(s); setSuggestionResponse(s.response || "") }} />
          )}
          {activeTab === "analytics" && analytics && <TabAnalytics analytics={analytics} />}
          {activeTab === "website" && <TabWebsite settings={websiteSettings} setSettings={setWebsiteSettings} editing={editingSettings} setEditing={setEditingSettings} onSave={saveWebsiteSettings} />}
          {activeTab === "pricing" && <TabPricing settings={websiteSettings} setSettings={setWebsiteSettings} editing={editingSettings} setEditing={setEditingSettings} onSave={saveWebsiteSettings} />}
          {activeTab === "content" && <TabContent />}
          {activeTab === "settings" && <TabSettings connectionStatus={connectionStatus} />}
        </div>
      </main>

      {/* ==================== SINGLE FLOATING ACTION BUTTON ==================== */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center gap-2.5 bg-slate-900 text-white px-6 py-3.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-black active:scale-95 transition-all border border-slate-700 outline-none"
        >
          <LayoutGrid size={20} className="text-orange-400" />
          <span className="font-extrabold text-[13px] uppercase tracking-wider">Menu Navigasi</span>
        </button>
      </div>

      {/* ==================== FLOATING OVERLAY MENU (BENTO GRID) ==================== */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl w-full max-w-[420px] animate-in slide-in-from-bottom-10 duration-300 relative overflow-hidden">
            
            {/* Dekorasi Background Menu */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-50 to-transparent pointer-events-none" />

            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 relative z-10" />
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Pintas Admin</h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Pilih modul yang ingin dikelola</p>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors rounded-full p-2 active:scale-90">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            
            {/* Grid Navigasi */}
            <div className="grid grid-cols-4 gap-2 mb-6 relative z-10">
              {TABS.map((tab) => {
                const Icon = TAB_ICONS[tab.id]
                const isActive = activeTab === tab.id
                return (
                  <button 
                    key={tab.id} 
                    onClick={() => { setActiveTab(tab.id); setIsMenuOpen(false); }} 
                    className={`group flex flex-col items-center gap-2 p-2 rounded-2xl transition-all active:scale-95 outline-none ${isActive ? 'bg-orange-50' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`w-14 h-14 rounded-[1.2rem] flex items-center justify-center transition-colors border ${
                      isActive 
                        ? 'bg-orange-500 text-white border-orange-600 shadow-[0_8px_20px_rgba(249,115,22,0.3)]' 
                        : `bg-slate-50 text-slate-600 border-slate-100 group-hover:bg-${tab.color}-100 group-hover:text-${tab.color}-600 group-hover:border-${tab.color}-200`
                    }`}>
                      <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className={`text-[10px] font-extrabold text-center ${isActive ? 'text-orange-600' : 'text-slate-600'}`}>
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Extra Action (Mobile Logout) */}
            <button onClick={handleLogout} className="sm:hidden w-full py-4 bg-red-50 text-red-600 font-extrabold rounded-[1.2rem] text-[13px] active:scale-95 outline-none flex justify-center items-center gap-2 relative z-10">
              <LogOut size={16} strokeWidth={2.5} /> Keluar dari Admin
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onEdit={setEditingOrder} onSendWhatsApp={sendWhatsAppMessage} />}
      {editingOrder && <EditOrderModal order={editingOrder} setOrder={setEditingOrder} onClose={() => setEditingOrder(null)} onSave={updateOrder} />}
      {selectedSuggestion && <SuggestionModal suggestion={selectedSuggestion} response={suggestionResponse} setResponse={setSuggestionResponse} onClose={() => setSelectedSuggestion(null)} onSubmit={handleSuggestionSubmit} />}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}