"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// Import ikon yang diperlukan (asumsi ini diimpor di komponen utama Anda)
import { Send, AlertTriangle, Loader2, User, BookOpen, Tag } from 'lucide-react'; 

import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Calendar,
  Mail,
  Phone,
  Download,
  TrendingUp,
  DollarSign,
  BarChart3,
  Settings,
  Search,
  RefreshCw,
  MessageSquare,
  Star,
  AlertCircle,
  Wifi,
  WifiOff,
  LogOut,
  Edit3,
  Save,
  X,
  Copy,
  SortAsc,
  SortDesc,
  Palette,
  Globe,
  Smartphone,
  CreditCard,
} from "lucide-react"

interface Order {
  id: string
  order_number: string
  name: string
  email: string
  phone: string
  company?: string
  service: string
  package: string
  title: string
  description: string
  dimensions?: string
  colors?: string
  deadline: string
  additional_info?: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  created_at: string
  updated_at: string
  total_price: number
}

interface Analytics {
  totalRevenue: number
  monthlyRevenue: number
  totalOrders: number
  monthlyOrders: number
  averageOrderValue: number
  topServices: { service: string; count: number; revenue: number }[]
  recentActivity: { type: string; message: string; time: string }[]
}

interface WebsiteSettings {
  siteName: string
  heroTitle: string
  heroSubtitle: string
  adminPhone: string
  adminEmail: string
  autoReplyMessage: string
  servicePrices: { [key: string]: number }
  packagepriceIncrement: { [key: string]: number } // Ganti dari packagepriceIncrement ke packageMultipliers untuk konsistensi
}
export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>({
    siteName: "JokiPoster",
    heroTitle: "Desain Poster Profesional untuk Bisnis Anda",
    heroSubtitle: "Dapatkan desain poster berkualitas tinggi dengan harga terjangkau",
    adminPhone: "+62 851-3373-7623",
    adminEmail: "arfan.7ovo@gmail.com",
    autoReplyMessage: "Terima kasih telah memesan layanan JokiPoster! Pesanan Anda sedang kami proses.",
    servicePrices: {
      "poster-event": 15000,
      "poster-edukasi": 20000,
      "social-media": 25000,
      "print-flyer": 15000,
      "lainya": 10000,
    },
    packagepriceIncrement: { // Diubah ke Multipliers/Increment
      basic: 0,
      professional: 5000,
      enterprise: 20000,
    },

  })
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [activeTab, setActiveTab] = useState("overview")
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "mock" | "error">("connected")
  const [error, setError] = useState<string>("")
  const [loggingOut, setLoggingOut] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [bulkAction, setBulkAction] = useState("")
  const [editingSettings, setEditingSettings] = useState(false)
  const [sortField, setSortField] = useState<string>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  // SUGGESTIONS: state
const [suggestions, setSuggestions] = useState<any[]>([])
const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false)
const [selectedSuggestion, setSelectedSuggestion] = useState<any | null>(null)
const [suggestionResponse, setSuggestionResponse] = useState<string>("")


  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchOrders()
    fetchAnalytics()
    fetchSuggestions() // <-- tambahkan ini
    loadWebsiteSettings()
  }, [])

  const fetchSuggestions = async () => {
  try {
    setLoadingSuggestions(true)
    const res = await fetch("/api/suggestions")
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }
    const json = await res.json()
    // asumsi API mengembalikan { data: [...] }
    setSuggestions(json.data || [])
  } catch (err) {
    console.error("Error fetching suggestions:", err)
    setSuggestions([])
  } finally {
    setLoadingSuggestions(false)
  }
}


  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/verify")
      if (!response.ok) {
        router.push("/login")
        return
      }
      const data = await response.json()
      if (!data.success || data.user.role !== "admin") {
        router.push("/login")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      router.push("/login")
    }
  }

  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      if (response.ok) {
        localStorage.clear()
        sessionStorage.clear()
        window.location.href = "/login"
      } else {
        window.location.href = "/api/auth/logout"
      }
    } catch (error) {
      console.error("Logout error:", error)
      window.location.href = "/login"
    } finally {
      setLoggingOut(false)
    }
  }

  const fetchOrders = async () => {
    try {
      setError("")
      const response = await fetch("/api/orders")
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response")
      }
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
        setConnectionStatus(data.message?.includes("mock") ? "mock" : "connected")
      } else {
        throw new Error(data.message || "Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setConnectionStatus("error")
      setError(error instanceof Error ? error.message : "Unknown error occurred")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics")
      if (!response.ok) return
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) return
      const data = await response.json()
      if (data.success) {
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  const loadWebsiteSettings = () => {
    const saved = localStorage.getItem("websiteSettings")
    if (saved) {
      setWebsiteSettings(JSON.parse(saved))
    }
  }

  const saveWebsiteSettings = async () => {
    try {
      localStorage.setItem("websiteSettings", JSON.stringify(websiteSettings))
      // In a real app, you'd save to database
      alert("Settings saved successfully!")
      setEditingSettings(false)
    } catch (error) {
      alert("Failed to save settings")
    }
  }

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (response.ok) {
        fetchOrders()
        fetchAnalytics()
        setEditingOrder(null)
        alert("Order updated successfully!")
      } else {
        alert("Failed to update order")
      }
    } catch (error) {
      alert("Failed to update order")
    }
  }

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return
    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: "DELETE" })
      if (response.ok) {
        fetchOrders()
        fetchAnalytics()
        alert("Order deleted successfully!")
      } else {
        alert("Failed to delete order")
      }
    } catch (error) {
      alert("Failed to delete order")
    }
  }

  const duplicateOrder = async (order: Order) => {
    const newOrder = {
      ...order,
      order_number: `JP${Date.now()}`,
      status: "pending" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    delete (newOrder as any).id

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: {
            name: newOrder.name,
            email: newOrder.email,
            phone: newOrder.phone,
            company: newOrder.company,
          },
          service: newOrder.service,
          package: newOrder.package,
          details: {
            title: newOrder.title,
            description: newOrder.description,
            dimensions: newOrder.dimensions,
            colors: newOrder.colors,
            deadline: newOrder.deadline,
            additionalInfo: newOrder.additional_info,
          },
        }),
      })
      if (response.ok) {
        fetchOrders()
        alert("Order duplicated successfully!")
      }
    } catch (error) {
      alert("Failed to duplicate order")
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) return

    if (!confirm(`Apply ${bulkAction} to ${selectedOrders.length} selected orders?`)) return

    try {
      const promises = selectedOrders.map((orderId) => {
        if (bulkAction === "delete") {
          return fetch(`/api/orders/${orderId}`, { method: "DELETE" })
        } else {
          return fetch(`/api/orders/${orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: bulkAction }),
          })
        }
      })

      await Promise.all(promises)
      fetchOrders()
      fetchAnalytics()
      setSelectedOrders([])
      setBulkAction("")
      alert(`Bulk action completed successfully!`)
    } catch (error) {
      alert("Bulk action failed")
    }
  }

  const exportOrders = async () => {
    try {
      const response = await fetch("/api/orders/export")
      if (!response.ok) {
        alert("Export not available - database not configured")
        return
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert("Failed to export data")
    }
  }

  const sendWhatsAppMessage = async (phone: string, orderNumber: string, customMessage?: string) => {
    try {
      const message =
        customMessage || `Hello! Update regarding your order ${orderNumber}. Please contact us for more information.`
      const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    } catch (error) {
      console.error("WhatsApp send error:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />
      case "in_progress":
        return <FileText size={16} />
      case "completed":
        return <CheckCircle size={16} />
      case "cancelled":
        return <XCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const sortedOrders = [...orders].sort((a, b) => {
    const aValue = a[sortField as keyof Order] ?? ""
    const bValue = b[sortField as keyof Order] ?? ""

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
const ORANGE_PRIMARY_GRADIENT = "bg-gradient-to-r from-[#FF7A00] to-[#FF8F2C]";
const ORANGE_ACCENT = "text-[#FF7A00]";
const ORANGE_BORDER_LIGHT = "border-[#FFE1C6]";
const ORANGE_BG_SOFT = "bg-[#FFF6EF]";
const ORANGE_SHADOW_LIGHT = "shadow-orange-100/50";

  const filteredOrders = sortedOrders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesSearch =
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDate = !dateFilter || order.created_at.startsWith(dateFilter)
    return matchesStatus && matchesSearch && matchesDate
  })

  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          {/* MODIFIED: flex-col untuk mobile, md:flex-row untuk desktop */}
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            
            {/* Bagian Kiri: Logo, Judul, Status */}
            <div>
              {/* MODIFIED: flex-wrap agar aman di layar sangat kecil */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                
                {/* MODIFIED: text-xl di mobile, text-2xl di desktop */}
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Admin Dashboard
                </h1>

                <div className="flex items-center gap-2">
                  {connectionStatus === "connected" && (
                    <div className="flex items-center gap-1 text-green-600 text-sm bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                      <Wifi size={14} />
                      <span className="text-xs sm:text-sm">Connected</span>
                    </div>
                  )}
                  {connectionStatus === "mock" && (
                    <div className="flex items-center gap-1 text-yellow-600 text-sm bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
                      <WifiOff size={14} />
                      <span className="text-xs sm:text-sm">Demo Mode</span>
                    </div>
                  )}
                  {connectionStatus === "error" && (
                    <div className="flex items-center gap-1 text-red-600 text-sm bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                      <AlertCircle size={14} />
                      <span className="text-xs sm:text-sm">Error</span>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mt-1">
                {connectionStatus === "mock"
                  ? "Demo mode - Full editing capabilities available"
                  : "Full admin control - Edit everything"}
              </p>
            </div>

            {/* Bagian Kanan: Tombol Action */}
            {/* MODIFIED: w-full di mobile agar tombol bisa di-stretch atau diatur ulang */}
            <div className="flex items-center gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 md:border-none">
              <button
                onClick={() => {
                  fetchOrders()
                  fetchAnalytics()
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-orange-500 hover:bg-gray-50 rounded-md transition-colors flex-1 md:flex-none border md:border-transparent border-gray-200"
                title="Refresh Data"
              >
                <RefreshCw size={20} />
                <span>Refresh</span>
              </button>
              
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center justify-center gap-2 btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex-1 md:flex-none"
              >
                <LogOut size={20} />
                <span>{loggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start sm:items-center gap-2">
              <AlertCircle size={20} className="mt-0.5 sm:mt-0 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm sm:text-base">Connection Error</p>
                <p className="text-xs sm:text-sm">{error}</p>
                <p className="text-xs sm:text-sm mt-1">
                  Dashboard is running in demo mode with full editing capabilities.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Navigation Tabs */}
  <div className="mb-8">
    <div className="border-b border-gray-200">
      <nav 
        className="-mb-px flex gap-6 sm:gap-8 overflow-x-auto whitespace-nowrap pb-1 scrollbar-hide" 
        aria-label="Tabs"
      >
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "orders", label: "Orders Management", icon: FileText },
          { id: "suggestions", label: "Suggestions", icon: MessageSquare },
          { id: "analytics", label: "Analytics", icon: TrendingUp },
          { id: "website", label: "Website Settings", icon: Globe },
          { id: "pricing", label: "Pricing Management", icon: CreditCard },
          { id: "settings", label: "System Settings", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === tab.id
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {/* flex-shrink-0 mencegah icon gepeng */}
            <tab.icon size={20} className={`flex-shrink-0 ${
              activeTab === tab.id ? "text-orange-500" : "text-gray-400 group-hover:text-gray-500"
            }`} />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  </div>
</div>


{/* Suggestions Tab */}
{activeTab === "suggestions" && (
  // Menggunakan background yang lembut
  <div className="space-y-8 p-6 bg-gradient-to-br from-white to-[#FFF6EF] min-h-screen">
    
    {/* Header & Controls */}
    <div className="flex justify-between items-center pb-4 border-b border-[#FFE1C6]">
      <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-[#FF7A00]" />
        User Suggestions ({suggestions.length})
      </h3>

      <button
        onClick={fetchSuggestions}
        className={`flex items-center gap-2 px-4 py-2 ${ORANGE_BG_SOFT} ${ORANGE_ACCENT} ${ORANGE_BORDER_LIGHT} border-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
        disabled={loadingSuggestions}
      >
        {loadingSuggestions ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        Refresh Data
      </button>
    </div>

    {/* --- */}

    {/* TABLE CONTAINER (Glassmorphism inspired) */}
    <div className={`bg-white/70 backdrop-blur-md rounded-3xl shadow-xl ${ORANGE_SHADOW_LIGHT} ${ORANGE_BORDER_LIGHT} border overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[#FF7A00]/15 border-b border-[#FFE1C6]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#FF7A00] uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#FF7A00] uppercase tracking-wider">Pengirim</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#FF7A00] uppercase tracking-wider">Kategori</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#FF7A00] uppercase tracking-wider">Isi Saran</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#FF7A00] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-[#FF7A00] uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#FFE1C6]">
            {loadingSuggestions ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin text-[#FF7A00] mx-auto mb-3" />
                  Memuat saran pengguna...
                </td>
              </tr>
            ) : suggestions.length === 0 ? (
                <tr>
                    <td colSpan={6} className="p-10 text-center text-gray-500">
                        <AlertTriangle className="w-6 h-6 text-orange-400 mx-auto mb-3" />
                        Belum ada saran yang masuk.
                    </td>
                </tr>
            ) : (
              suggestions.map((s: any) => (
                <tr 
                  key={s.id} 
                  // Peningkatan responsivitas: Hover yang lebih jelas
                  className="odd:bg-white/50 even:bg-[#FFF6EF]/50 hover:bg-[#FF7A00]/20 transition-colors duration-150 cursor-default"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.id}</td>
                  
                  {/* Nama & Email (Combined) */}
                  <td className="px-4 py-3 text-sm">
                    <div className="font-semibold text-gray-800">{s.nama || "Anonim"}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[150px]">{s.user_email || "-"}</div>
                  </td>
                  
                  {/* Kategori */}
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="bg-[#FFE1C6] text-[#FF7A00] text-xs font-medium px-2 py-0.5 rounded-full">
                        {s.category}
                    </span>
                  </td>

                  {/* Saran (Truncated) */}
                  <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[300px]">
                    {s.saran}
                  </td>
                  
                  {/* Status Badge */}
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-bold leading-none rounded-full ${
                        s.status === "reviewed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                        {s.status === "reviewed" ? "Reviewed" : "Pending"}
                    </span>
                  </td>
                  
                  {/* Aksi */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">

                      {/* REVIEW Button (Responsiveness improved) */}
                      <button
                        onClick={() => {
                          setSelectedSuggestion(s)
                          setSuggestionResponse(s.response || "")
                        }}
                        className={`p-2 ${ORANGE_PRIMARY_GRADIENT} text-white rounded-lg shadow-md hover:shadow-lg transition duration-150 transform hover:scale-[1.05] active:scale-[0.95]`}
                        title="Review dan Beri Respon"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* DELETE Button (Responsiveness improved) */}
                      <button
                        onClick={async () => {
                          if (!confirm(`Apakah Anda yakin ingin menghapus saran dari ID ${s.id}?`)) return
                          
                          try {
                            const res = await fetch(
                              `/api/admin/suggestions/${s.id}`,
                              { method: "DELETE" }
                            )

                            if (!res.ok) {
                              alert("Gagal menghapus saran.")
                              return
                            }
                            fetchSuggestions() 
                          } catch (error) {
                             alert("Terjadi kesalahan jaringan saat menghapus.")
                          }
                        }}
                        className="p-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-150 transform hover:scale-[1.05] active:scale-[0.95]"
                        title="Hapus Saran"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* --- */}

    {/* MODAL REVIEW (Glassmorphism & Orange Palette) */}
    {selectedSuggestion && (
      // Glass Backdrop
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4">
        {/* Modal Container */}
        <div className={`bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all ${ORANGE_BORDER_LIGHT} border-2`}>
          
          <div className="flex justify-between items-center border-b border-[#FFE1C6] pb-3 mb-4">
            <h4 className="text-xl font-bold text-[#FF7A00] flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Review & Response
            </h4>
            <button 
                onClick={() => setSelectedSuggestion(null)}
                className="p-1 rounded-full text-gray-500 hover:bg-[#FFE1C6] transition"
            >
                <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm p-4 bg-[#FFF6EF] rounded-xl border border-[#FFE1C6]">
            <p className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#FF7A00]" />
                <span className="font-semibold text-gray-700">Nama:</span> {selectedSuggestion.nama || "Anonim"}
            </p>
            <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF7A00]" />
                <span className="font-semibold text-gray-700">Email:</span> {selectedSuggestion.user_email || "-"}
            </p>
            <p className="col-span-2 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FF7A00]" />
                <span className="font-semibold text-gray-700">Kategori:</span> {selectedSuggestion.category}
            </p>
          </div>

          {/* Original Suggestion */}
          <div className="p-4 bg-white border-2 border-[#FFE1C6] rounded-xl mb-6 shadow-inner">
            <p className="text-sm font-semibold text-[#FF7A00] mb-2">Saran Pengguna:</p>
            <div className="text-gray-700 italic text-base max-h-36 overflow-y-auto p-1">
                "{selectedSuggestion.saran}"
            </div>
          </div>

          {/* Admin Response Textarea */}
          <label htmlFor="admin-response" className="block text-sm font-bold text-gray-700 mb-2">
            Respon Balasan Admin:
          </label>
          <textarea
            id="admin-response"
            value={suggestionResponse}
            onChange={(e) => setSuggestionResponse(e.target.value)}
            rows={5}
            placeholder="Tulis balasan resmi Anda di sini..."
            className="w-full border-2 border-[#FFE1C6] focus:border-[#FF7A00] focus:ring-[#FF7A00]/50 p-3 rounded-xl text-gray-800 transition duration-200 bg-white/70"
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setSelectedSuggestion(null)}
              className={`px-4 py-2 border-2 ${ORANGE_BORDER_LIGHT} text-gray-700 rounded-xl hover:bg-[#FFE1C6] transition duration-200 transform active:scale-[0.98]`}
            >
              Batal
            </button>

            <button
              onClick={async () => {
                try {
                    const res = await fetch(
                        `/api/admin/suggestions/${selectedSuggestion.id}`,
                        {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                response: suggestionResponse,
                                status: "reviewed",
                            }),
                        }
                    )
                    
                    if (!res.ok) {
                        alert("Gagal menyimpan respon.")
                        return
                    }

                    setSelectedSuggestion(null)
                    fetchSuggestions()
                } catch (error) {
                    alert("Terjadi kesalahan jaringan saat menyimpan.")
                }
              }}
              // Peningkatan responsivitas: Efek scaling pada tombol utama
              className={`flex items-center gap-2 ${ORANGE_PRIMARY_GRADIENT} text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-[#FF7A00]/30 hover:shadow-xl hover:scale-[1.01] transition duration-200 active:scale-[0.97]`}
            >
              <Send className="w-4 h-4" />
              Kirim Respon & Tandai Reviewed
            </button>
          </div>
        </div>
      </div>
    )}

  </div>
)}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {connectionStatus === "mock" ? "Demo data" : "+12% from last month"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {analytics ? formatPrice(analytics.monthlyRevenue) : "Loading..."}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {connectionStatus === "mock" ? "Demo data" : "+8% from last month"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Orders</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                    <p className="text-xs text-gray-500 mt-1">Need attention</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completion Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Success rate</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium text-blue-800">Manage Orders</p>
                      <p className="text-sm text-blue-600">Edit, update, and track orders</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("pricing")}
                    className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <CreditCard className="w-6 h-6 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-green-800">Update Pricing</p>
                      <p className="text-sm text-green-600">Modify service prices and packages</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("website")}
                    className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                  >
                    <Globe className="w-6 h-6 text-orange-600" />
                    <div className="text-left">
                      <p className="font-medium text-orange-800">Website Content</p>
                      <p className="text-sm text-orange-600">Edit homepage and content</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{order.order_number}</p>
                          <p className="text-sm text-gray-600">
                            {order.name} - {order.service}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">{formatPrice(order.total_price)}</p>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Management Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Advanced Filters and Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />

                  <select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="created_at">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="total_price">Sort by Price</option>
                    <option value="status">Sort by Status</option>
                  </select>

                  <button
                    onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {sortDirection === "asc" ? <SortAsc size={20} /> : <SortDesc size={20} />}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={exportOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download size={20} />
                    Export
                  </button>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedOrders.length > 0 && (
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <span className="text-blue-800 font-medium">{selectedOrders.length} orders selected</span>
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="px-3 py-1 border border-blue-300 rounded text-sm"
                  >
                    <option value="">Select Action</option>
                    <option value="pending">Mark as Pending</option>
                    <option value="in_progress">Mark as In Progress</option>
                    <option value="completed">Mark as Completed</option>
                    <option value="cancelled">Mark as Cancelled</option>
                    <option value="delete">Delete Orders</option>
                  </select>
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setSelectedOrders([])}
                    className="px-4 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Orders List ({filteredOrders.length})</h2>
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages || 1}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrders(paginatedOrders.map((o) => o.id))
                            } else {
                              setSelectedOrders([])
                            }
                          }}
                          className="rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Deadline
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedOrders([...selectedOrders, order.id])
                              } else {
                                setSelectedOrders(selectedOrders.filter((id) => id !== order.id))
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.order_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.name}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Mail size={12} />
                              {order.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone size={12} />
                              {order.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.service}</div>
                          <div className="text-sm text-gray-500">{order.package}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(order.deadline).toLocaleDateString("id-ID")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatPrice(order.total_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => setEditingOrder(order)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Edit Order"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => duplicateOrder(order)}
                              className="text-purple-600 hover:text-purple-900 p-1"
                              title="Duplicate Order"
                            >
                              <Copy size={16} />
                            </button>
                            <button
                              onClick={() => sendWhatsAppMessage(order.phone, order.order_number)}
                              className="text-green-600 hover:text-green-900 p-1"
                              title="Send WhatsApp"
                            >
                              <MessageSquare size={16} />
                            </button>
                            <button
                              onClick={() => deleteOrder(order.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {(currentPage - 1) * itemsPerPage + 1} -{" "}
                      {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + Math.max(1, currentPage - 2)
                        return page <= totalPages ? (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 border rounded text-sm ${
                              currentPage === page
                                ? "bg-orange-500 text-white border-orange-500"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ) : null
                      })}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found matching your criteria</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && analytics && (
          <div className="space-y-8">
            {/* Revenue Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Revenue</h3>
                <p className="text-3xl font-bold gradient-text">{formatPrice(analytics.totalRevenue)}</p>
                <p className="text-sm text-gray-600 mt-2">From {analytics.totalOrders} orders</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue</h3>
                <p className="text-3xl font-bold text-green-600">{formatPrice(analytics.monthlyRevenue)}</p>
                <p className="text-sm text-gray-600 mt-2">From {analytics.monthlyOrders} orders</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Order Value</h3>
                <p className="text-3xl font-bold text-blue-600">{formatPrice(analytics.averageOrderValue)}</p>
                <p className="text-sm text-gray-600 mt-2">Per order</p>
              </div>
            </div>

            {/* Top Services */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Services</h3>
              <div className="space-y-4">
                {analytics.topServices.map((service, index) => (
                  <div key={service.service} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{service.service}</p>
                        <p className="text-sm text-gray-600">{service.count} orders</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{formatPrice(service.revenue)}</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">Popular</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Website Settings Tab */}
        {activeTab === "website" && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Website Content Management</h3>
                <button
                  onClick={() => setEditingSettings(!editingSettings)}
                  className="flex items-center gap-2 btn btn-primary"
                >
                  <Edit3 size={20} />
                  {editingSettings ? "Cancel" : "Edit Content"}
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  {editingSettings ? (
                    <input
                      type="text"
                      value={websiteSettings.siteName}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, siteName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{websiteSettings.siteName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                  {editingSettings ? (
                    <input
                      type="text"
                      value={websiteSettings.heroTitle}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, heroTitle: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{websiteSettings.heroTitle}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                  {editingSettings ? (
                    <textarea
                      value={websiteSettings.heroSubtitle}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, heroSubtitle: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{websiteSettings.heroSubtitle}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin WhatsApp</label>
                  {editingSettings ? (
                    <input
                      type="tel"
                      value={websiteSettings.adminPhone}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, adminPhone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{websiteSettings.adminPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                  {editingSettings ? (
                    <input
                      type="email"
                      value={websiteSettings.adminEmail}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, adminEmail: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{websiteSettings.adminEmail}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Auto-reply WhatsApp Message</label>
                  {editingSettings ? (
                    <textarea
                      value={websiteSettings.autoReplyMessage}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, autoReplyMessage: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{websiteSettings.autoReplyMessage}</p>
                  )}
                </div>

                {editingSettings && (
                  <div className="flex gap-4">
                    <button onClick={saveWebsiteSettings} className="flex items-center gap-2 btn btn-primary">
                      <Save size={20} />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingSettings(false)}
                      className="flex items-center gap-2 btn btn-secondary"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Management Tab */}
        {activeTab === "pricing" && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Service Pricing Management</h3>
                <button
                  onClick={() => setEditingSettings(!editingSettings)}
                  className="flex items-center gap-2 btn btn-primary"
                >
                  <Edit3 size={20} />
                  {editingSettings ? "Cancel" : "Edit Pricing"}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Service Prices */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Service Base Prices</h4>
                  <div className="space-y-4">
                    {Object.entries(websiteSettings.servicePrices).map(([service, price]) => (
                      <div key={service} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-800 capitalize">{service.replace("-", " ")}</p>
                          <p className="text-sm text-gray-600">Base price</p>
                        </div>
                        <div className="text-right">
                          {editingSettings ? (
                            <input
                              type="number"
                              value={price}
                              onChange={(e) =>
                                setWebsiteSettings({
                                  ...websiteSettings,
                                  servicePrices: {
                                    ...websiteSettings.servicePrices,
                                    [service]: Number.parseInt(e.target.value),
                                  },
                                })
                              }
                              className="w-32 px-3 py-2 border border-gray-300 rounded text-right"
                            />
                          ) : (
                            <p className="text-lg font-bold text-gray-800">{formatPrice(price)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Package Price Increments */}
                <div>
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Package Price Increments</h4>
                  <div className="space-y-4">
                  {Object.entries(websiteSettings.packagepriceIncrement).map(([pkg, increment]) => (
                    <div key={pkg} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800 capitalize">{pkg}</p>
                      <p className="text-sm text-gray-600">Price increment</p>
                    </div>
                    <div className="text-right">
                      {editingSettings ? (
                      <input
                        type="number"
                        value={increment}
                        onChange={(e) =>
                        setWebsiteSettings({
                          ...websiteSettings,
                          packagepriceIncrement: {
                          ...websiteSettings.packagepriceIncrement,
                          [pkg]: Number.parseInt(e.target.value),
                          },
                        })
                        }
                        className="w-24 px-3 py-2 border border-gray-300 rounded text-right"
                      />
                      ) : (
                      <p className="text-lg font-bold text-gray-800">{formatPrice(increment)}</p>
                      )}
                    </div>
                    </div>
                  ))}
                  </div>
                </div>
                </div>

                {/* Price Calculator Preview */}
                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h4 className="text-md font-semibold text-blue-800 mb-4">Price Calculator Preview</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(websiteSettings.servicePrices).map(([service, basePrice]) => (
                  <div key={service} className="bg-white p-4 rounded-lg">
                    <h5 className="font-medium text-gray-800 capitalize mb-2">{service.replace("-", " ")}</h5>
                    <div className="space-y-1 text-sm">
                    {Object.entries(websiteSettings.packagepriceIncrement).map(([pkg, increment]) => (
                      <div key={pkg} className="flex justify-between">
                      <span className="capitalize text-gray-600">{pkg}:</span>
                      <span className="font-medium">{formatPrice(basePrice + increment)}</span>
                      </div>
                    ))}
                    </div>
                  </div>
                  ))}
                </div>
                </div>

              {editingSettings && (
                <div className="flex gap-4 mt-6">
                  <button onClick={saveWebsiteSettings} className="flex items-center gap-2 btn btn-primary">
                    <Save size={20} />
                    Save Pricing
                  </button>
                  <button
                    onClick={() => setEditingSettings(false)}
                    className="flex items-center gap-2 btn btn-secondary"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">System Configuration</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Database Status</p>
                    <p className="text-sm text-gray-600">
                      {connectionStatus === "connected" && "Database connected successfully"}
                      {connectionStatus === "mock" && "Using demo data - database not configured"}
                      {connectionStatus === "error" && "Database connection failed"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {connectionStatus === "connected" && <Wifi className="w-5 h-5 text-green-600" />}
                    {connectionStatus === "mock" && <WifiOff className="w-5 h-5 text-yellow-600" />}
                    {connectionStatus === "error" && <AlertCircle className="w-5 h-5 text-red-600" />}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">WhatsApp Integration</p>
                    <p className="text-sm text-gray-600">
                      {process.env.NEXT_PUBLIC_ULTRAMSG_INSTANCE_ID ? "Configured" : "Not configured"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-green-600" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Email Notifications</p>
                    <p className="text-sm text-gray-600">
                      {process.env.WEB3FORMS_ACCESS_KEY ? "Configured" : "Not configured"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                </div>

                <button
                  onClick={() => {
                    fetchOrders()
                    fetchAnalytics()
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw size={20} />
                  Test All Connections
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Admin Actions</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={exportOrders}
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Download className="w-6 h-6 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-green-800">Export Data</p>
                    <p className="text-sm text-green-600">Download all orders as CSV</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (confirm("This will clear all local settings. Continue?")) {
                      localStorage.clear()
                      alert("Local settings cleared!")
                      window.location.reload()
                    }
                  }}
                  className="flex items-center gap-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-6 h-6 text-red-600" />
                  <div className="text-left">
                    <p className="font-medium text-red-800">Clear Settings</p>
                    <p className="text-sm text-red-600">Reset all local configurations</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Information</label>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p>
                        <span className="font-medium">Order ID:</span> {selectedOrder.order_number}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>
                        <span
                          className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}
                        >
                          {getStatusIcon(selectedOrder.status)}
                          {selectedOrder.status}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Total:</span>{" "}
                        <span className="text-xl font-bold gradient-text">
                          {formatPrice(selectedOrder.total_price)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Info</label>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p>
                        <span className="font-medium">Name:</span> {selectedOrder.name}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span> {selectedOrder.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {selectedOrder.phone}
                      </p>
                      {selectedOrder.company && (
                        <p>
                          <span className="font-medium">Company:</span> {selectedOrder.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Details</label>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p>
                        <span className="font-medium">Service:</span> {selectedOrder.service}
                      </p>
                      <p>
                        <span className="font-medium">Package:</span> {selectedOrder.package}
                      </p>
                      <p>
                        <span className="font-medium">Deadline:</span>{" "}
                        {new Date(selectedOrder.deadline).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Details</label>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div>
                        <p className="font-medium text-sm text-gray-700">Title:</p>
                        <p className="text-gray-900">{selectedOrder.title}</p>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-700">Description:</p>
                        <p className="text-gray-900 text-sm">{selectedOrder.description}</p>
                      </div>
                      {selectedOrder.dimensions && (
                        <div>
                          <p className="font-medium text-sm text-gray-700">Dimensions:</p>
                          <p className="text-gray-900">{selectedOrder.dimensions}</p>
                        </div>
                      )}
                      {selectedOrder.colors && (
                        <div>
                          <p className="font-medium text-sm text-gray-700">Colors:</p>
                          <p className="text-gray-900">{selectedOrder.colors}</p>
                        </div>
                      )}
                      {selectedOrder.additional_info && (
                        <div>
                          <p className="font-medium text-sm text-gray-700">Additional Info:</p>
                          <p className="text-gray-900 text-sm">{selectedOrder.additional_info}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timestamps</label>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p>
                        <span className="font-medium">Created:</span>{" "}
                        {new Date(selectedOrder.created_at).toLocaleString("id-ID")}
                      </p>
                      <p>
                        <span className="font-medium">Updated:</span>{" "}
                        {new Date(selectedOrder.updated_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingOrder(selectedOrder)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Edit3 size={20} />
                      Edit Order
                    </button>
                    <button
                      onClick={() => sendWhatsAppMessage(selectedOrder.phone, selectedOrder.order_number)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <MessageSquare size={20} />
                      WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Edit Order - {editingOrder.order_number}</h3>
                <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircle size={24} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  updateOrder(editingOrder.id, editingOrder)
                }}
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Customer Information</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={editingOrder.name}
                        onChange={(e) => setEditingOrder({ ...editingOrder, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editingOrder.email}
                        onChange={(e) => setEditingOrder({ ...editingOrder, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={editingOrder.phone}
                        onChange={(e) => setEditingOrder({ ...editingOrder, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={editingOrder.company || ""}
                        onChange={(e) => setEditingOrder({ ...editingOrder, company: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editingOrder.status}
                        onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                      <input
                        type="number"
                        value={editingOrder.total_price}
                        onChange={(e) =>
                          setEditingOrder({ ...editingOrder, total_price: Number.parseInt(e.target.value) })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Project Details</h4>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                      <select
                        value={editingOrder.service}
                        onChange={(e) => setEditingOrder({ ...editingOrder, service: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="poster-event">Poster Event</option>
                        <option value="poster-promo">Poster Promo</option>
                        <option value="logo-design">Logo Design</option>
                        <option value="social-media">Social Media</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Package</label>
                      <select
                        value={editingOrder.package}
                        onChange={(e) => setEditingOrder({ ...editingOrder, package: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="basic">Basic</option>
                        <option value="professional">Professional</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingOrder.title}
                        onChange={(e) => setEditingOrder({ ...editingOrder, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editingOrder.description}
                        onChange={(e) => setEditingOrder({ ...editingOrder, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                      <input
                        type="text"
                        value={editingOrder.dimensions || ""}
                        onChange={(e) => setEditingOrder({ ...editingOrder, dimensions: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                      <input
                        type="text"
                        value={editingOrder.colors || ""}
                        onChange={(e) => setEditingOrder({ ...editingOrder, colors: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                      <input
                        type="date"
                        value={editingOrder.deadline}
                        onChange={(e) => setEditingOrder({ ...editingOrder, deadline: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Info</label>
                      <textarea
                        value={editingOrder.additional_info || ""}
                        onChange={(e) => setEditingOrder({ ...editingOrder, additional_info: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 pt-6 border-t">
                  <button type="submit" className="flex items-center gap-2 btn btn-primary">
                    <Save size={20} />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingOrder(null)}
                    className="flex items-center gap-2 btn btn-secondary"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}