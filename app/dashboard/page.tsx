"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Palette, RefreshCw, LogOut, BarChart3, FileText,
  MessageSquare, TrendingUp, Globe, CreditCard,
  Settings, Wifi, WifiOff, AlertCircle, Search,
  Download, Clock, CheckCircle2, Eye, Edit3, 
  Trash2, Send, X, Mail, Phone, Calendar, 
  User, Tag, BookOpen, Loader2, Plus, SortAsc, SortDesc,
  Smartphone, Award, DollarSign, Users, Star, XCircle, Copy, Save
} from "lucide-react"

// --- INTERFACES ---
interface Order {
  id: string; order_number: string; name: string; email: string; phone: string;
  company?: string; service: string; package: string; title: string;
  description: string; dimensions?: string; colors?: string; deadline: string;
  additional_info?: string; status: "pending" | "in_progress" | "completed" | "cancelled";
  created_at: string; updated_at: string; total_price: number;
}

interface Analytics {
  totalRevenue: number; monthlyRevenue: number; totalOrders: number;
  monthlyOrders: number; averageOrderValue: number;
  topServices: { service: string; count: number; revenue: number }[];
  recentActivity?: { type: string; message: string; time: string }[];
}

interface WebsiteSettings {
  siteName: string; heroTitle: string; heroSubtitle: string;
  adminPhone: string; adminEmail: string; autoReplyMessage: string;
  servicePrices: { [key: string]: number };
  packagepriceIncrement: { [key: string]: number };
}

export default function Dashboard() {
  // --- STATES ---
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>({
    siteName: "JokiPoster",
    heroTitle: "Desain Poster Profesional untuk Bisnis Anda",
    heroSubtitle: "Dapatkan desain poster berkualitas tinggi dengan harga terjangkau",
    adminPhone: "+62 851-3373-7623",
    adminEmail: "arfan.7ovo@gmail.com",
    autoReplyMessage: "Terima kasih telah memesan layanan JokiPoster! Pesanan Anda sedang kami proses.",
    servicePrices: { "poster-event": 15000, "poster-edukasi": 20000, "social-media": 25000, "print-flyer": 15000, "lainya": 10000 },
    packagepriceIncrement: { basic: 0, professional: 5000, enterprise: 20000 },
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "mock" | "error">("connected");
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Action States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [editingSettings, setEditingSettings] = useState(false);

  // Suggestions States
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<any | null>(null);
  const [suggestionResponse, setSuggestionResponse] = useState("");

  const router = useRouter();

  // --- STYLING CONSTANTS ---
  const CARD_STYLE = "bg-white rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300";
  const GRADIENT_ORANGE = "bg-gradient-to-r from-[#FF7A00] to-[#FF8F2C]";

  // --- EFFECTS ---
  useEffect(() => {
    checkAuth();
    fetchOrders();
    fetchAnalytics();
    fetchSuggestions();
    loadWebsiteSettings();
  }, []);

  // --- API FUNCTIONS ---
  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/verify");
      if (!response.ok) { router.push("/login"); return; }
      const data = await response.json();
      if (!data.success || data.user.role !== "admin") router.push("/login");
    } catch (error) { router.push("/login"); }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      }
    } catch (error) { window.location.href = "/login"; } 
    finally { setLoggingOut(false); }
  };

  const fetchOrders = async () => {
    try {
      setError("");
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
        setConnectionStatus(data.message?.includes("mock") ? "mock" : "connected");
      } else throw new Error(data.message);
    } catch (error) { 
      setConnectionStatus("error");
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally { setLoading(false); }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics");
      if (!response.ok) return;
      const data = await response.json();
      if (data.success) setAnalytics(data.analytics);
    } catch (error) { console.error(error); }
  };

  const fetchSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      const res = await fetch("/api/suggestions");
      const json = await res.json();
      setSuggestions(json.data || []);
    } catch (err) { setSuggestions([]); }
    finally { setLoadingSuggestions(false); }
  };

  const loadWebsiteSettings = () => {
    const saved = localStorage.getItem("websiteSettings");
    if (saved) setWebsiteSettings(JSON.parse(saved));
  };

  const saveWebsiteSettings = async () => {
    try {
      localStorage.setItem("websiteSettings", JSON.stringify(websiteSettings));
      alert("Settings saved successfully!");
      setEditingSettings(false);
    } catch (error) { alert("Failed to save settings"); }
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        fetchOrders(); fetchAnalytics(); setEditingOrder(null);
        alert("Order updated successfully!");
      }
    } catch (error) { alert("Failed to update order"); }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (response.ok) { fetchOrders(); fetchAnalytics(); }
    } catch (error) { alert("Failed to delete order"); }
  };

  const duplicateOrder = async (order: Order) => {
    const newOrder = {
      ...order, order_number: `JP${Date.now()}`, status: "pending" as const,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    delete (newOrder as any).id;
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: { name: newOrder.name, email: newOrder.email, phone: newOrder.phone, company: newOrder.company },
          service: newOrder.service, package: newOrder.package,
          details: { title: newOrder.title, description: newOrder.description, dimensions: newOrder.dimensions, colors: newOrder.colors, deadline: newOrder.deadline, additionalInfo: newOrder.additional_info },
        }),
      });
      if (response.ok) { fetchOrders(); alert("Order duplicated!"); }
    } catch (error) { alert("Failed to duplicate"); }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) return;
    if (!confirm(`Apply ${bulkAction} to ${selectedOrders.length} selected orders?`)) return;
    try {
      const promises = selectedOrders.map((orderId) => {
        if (bulkAction === "delete") return fetch(`/api/orders/${orderId}`, { method: "DELETE" });
        return fetch(`/api/orders/${orderId}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: bulkAction }),
        });
      });
      await Promise.all(promises);
      fetchOrders(); fetchAnalytics(); setSelectedOrders([]); setBulkAction("");
      alert(`Bulk action completed!`);
    } catch (error) { alert("Bulk action failed"); }
  };

  const exportOrders = async () => {
    try {
      const response = await fetch("/api/orders/export");
      if (!response.ok) { alert("Export not available"); return; }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a); a.click();
      window.URL.revokeObjectURL(url); document.body.removeChild(a);
    } catch (error) { alert("Failed to export data"); }
  };

  const sendWhatsAppMessage = async (phone: string, orderNumber: string, customMessage?: string) => {
    const message = customMessage || `Halo! Update mengenai pesanan Anda ${orderNumber}. Silakan hubungi kami untuk info lebih lanjut.`;
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank");
  };

  // --- DATA PROCESSING & HELPER ---
  const formatPrice = (price: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const aValue = a[sortField as keyof Order] ?? "";
    const bValue = b[sortField as keyof Order] ?? "";
    return sortDirection === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
  });

  const filteredOrders = sortedOrders.filter((order) => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = order.name.toLowerCase().includes(searchTerm.toLowerCase()) || order.email.toLowerCase().includes(searchTerm.toLowerCase()) || order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) || order.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || order.created_at.startsWith(dateFilter);
    return matchesStatus && matchesSearch && matchesDate;
  });

  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mb-4" />
      <p className="font-bold text-gray-400 animate-pulse tracking-widest uppercase text-xs">Loading Dashboard</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 pb-20">
      
      {/* --- TOP FLOATING NAVBAR --- */}
      <nav className="sticky top-0 z-[40] bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 px-4 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 ${GRADIENT_ORANGE} rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20`}>
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900">JokiPoster <span className="text-[#FF7A00]">Admin</span></h1>
              <div className="flex items-center gap-2 mt-0.5">
                {connectionStatus === "connected" ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-500 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live System
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                    <WifiOff size={10} /> Demo Mode
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button onClick={() => { fetchOrders(); fetchAnalytics(); }} className="p-2.5 text-gray-500 hover:text-[#FF7A00] hover:bg-orange-50 rounded-xl transition-all" title="Refresh Data">
              <RefreshCw size={20} />
            </button>
            <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block" />
            <button onClick={handleLogout} disabled={loggingOut} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200 disabled:opacity-50">
              <LogOut size={18} /> <span className="text-sm">{loggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <div>
              <p className="font-bold text-sm">Connection Error</p>
              <p className="text-xs">{error}</p>
            </div>
          </div>
        )}

        {/* --- NAVIGATION DOCK (Tabs) --- */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 mb-10 overflow-x-auto no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "orders", label: "Orders Management", icon: FileText },
            { id: "suggestions", label: "Suggestions", icon: MessageSquare },
            { id: "analytics", label: "Analytics", icon: TrendingUp },
            { id: "website", label: "Website", icon: Globe },
            { id: "pricing", label: "Pricing", icon: CreditCard },
            { id: "settings", label: "System", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id 
                ? `${GRADIENT_ORANGE} text-white shadow-lg shadow-orange-500/20` 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* ========================================================= */}
        {/* TAB: OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Total Orders", val: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Monthly Revenue", val: analytics ? formatPrice(analytics.monthlyRevenue) : "Rp 0", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
                { label: "Pending Orders", val: stats.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Completion Rate", val: `${stats.total > 0 ? Math.round((stats.completed/stats.total)*100) : 0}%`, icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50" }
              ].map((item, idx) => (
                <div key={idx} className={CARD_STYLE + " p-6"}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">{item.label}</p>
                      <h3 className="text-2xl font-black text-gray-900">{item.val}</h3>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${item.bg} ${item.color}`}>
                      <item.icon size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className={CARD_STYLE}>
                  <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="font-black text-gray-900 flex items-center gap-2">
                      <Clock className="text-[#FF7A00]" size={20} /> Pesanan Terbaru
                    </h3>
                    <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-[#FF7A00] hover:underline">View All →</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center font-bold text-orange-600 text-xs">
                            <FileText size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{order.order_number}</p>
                            <p className="text-[10px] font-medium text-gray-400 uppercase">{order.name} - {order.service}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-gray-900">{formatPrice(order.total_price)}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full blur-[80px] opacity-30" />
                  <h3 className="text-xl font-black mb-2 relative z-10">Quick Actions</h3>
                  <div className="grid gap-3 relative z-10 mt-6">
                    <button onClick={() => setActiveTab("orders")} className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-start px-4 gap-3 font-bold transition-all text-sm">
                      <FileText size={18} className="text-blue-400" /> Manage Orders
                    </button>
                    <button onClick={() => setActiveTab("pricing")} className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-start px-4 gap-3 font-bold transition-all text-sm">
                      <CreditCard size={18} className="text-green-400" /> Update Pricing
                    </button>
                    <button onClick={() => setActiveTab("website")} className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-start px-4 gap-3 font-bold transition-all text-sm">
                      <Globe size={18} className="text-orange-400" /> Website Content
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: ORDERS MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Filter Bar */}
            <div className={CARD_STYLE + " p-6 flex flex-wrap gap-4 items-center justify-between"}>
               <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
                 <div className="relative flex-1 min-w-[250px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search orders..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#FF7A00] focus:ring-2 focus:ring-orange-500/20 rounded-xl transition-all text-sm font-medium"
                    />
                 </div>
                 <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-orange-500/20">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                 </select>
                 <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-orange-500/20" />
                 <select value={sortField} onChange={(e) => setSortField(e.target.value)} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-orange-500/20">
                    <option value="created_at">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="total_price">Sort by Price</option>
                 </select>
                 <button onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")} className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50">
                    {sortDirection === "asc" ? <SortAsc size={18} /> : <SortDesc size={18} />}
                 </button>
               </div>
               <button onClick={exportOrders} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-all">
                  <Download size={18} /> Export
               </button>
            </div>

            {/* Bulk Actions Bar */}
            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl animate-in fade-in">
                <span className="text-blue-800 font-bold text-sm">{selectedOrders.length} selected</span>
                <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)} className="px-3 py-1.5 border border-blue-200 rounded-lg text-sm font-medium">
                  <option value="">Select Action</option>
                  <option value="pending">Mark as Pending</option>
                  <option value="in_progress">Mark as In Progress</option>
                  <option value="completed">Mark as Completed</option>
                  <option value="cancelled">Mark as Cancelled</option>
                  <option value="delete">Delete Orders</option>
                </select>
                <button onClick={handleBulkAction} disabled={!bulkAction} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50">Apply</button>
                <button onClick={() => setSelectedOrders([])} className="px-4 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50">Clear</button>
              </div>
            )}

            {/* Table */}
            <div className={CARD_STYLE + " overflow-hidden"}>
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-black text-gray-800">Orders List ({filteredOrders.length})</h2>
                <div className="text-sm font-bold text-gray-400">Page {currentPage} of {totalPages || 1}</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
                      <th className="px-6 py-4">
                        <input type="checkbox" checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0} onChange={(e) => { setSelectedOrders(e.target.checked ? paginatedOrders.map(o => o.id) : []) }} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                      </th>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Total</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-orange-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <input type="checkbox" checked={selectedOrders.includes(order.id)} onChange={(e) => { setSelectedOrders(e.target.checked ? [...selectedOrders, order.id] : selectedOrders.filter(id => id !== order.id)) }} className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-gray-900">{order.order_number}</span>
                          <p className="text-[10px] text-gray-400 font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-gray-900">{order.name}</p>
                          <div className="flex flex-col text-[10px] text-gray-500 mt-1 space-y-0.5">
                            <span className="flex items-center gap-1"><Mail size={10}/> {order.email}</span>
                            <span className="flex items-center gap-1"><Phone size={10}/> {order.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-600">{order.service} <br/><span className="text-xs text-gray-400">{order.package}</span></td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase ${getStatusColor(order.status)}`}>{order.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-black text-gray-900">{formatPrice(order.total_price)}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-1">
                            <button onClick={() => setSelectedOrder(order)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={16} /></button>
                            <button onClick={() => setEditingOrder(order)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg"><Edit3 size={16} /></button>
                            <button onClick={() => duplicateOrder(order)} className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg"><Copy size={16} /></button>
                            <button onClick={() => sendWhatsAppMessage(order.phone, order.order_number)} className="p-2 text-green-500 hover:bg-green-50 rounded-lg"><MessageSquare size={16} /></button>
                            <button onClick={() => deleteOrder(order.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {paginatedOrders.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-10 text-gray-400 font-bold"><AlertCircle className="mx-auto mb-2" size={32}/> No orders found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                   <span className="text-xs font-bold text-gray-400">Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}</span>
                   <div className="flex gap-1">
                      <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-3 py-1.5 border rounded-lg text-xs font-bold disabled:opacity-50">Prev</button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                         const p = i + Math.max(1, currentPage - 2);
                         if (p > totalPages) return null;
                         return <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1.5 border rounded-lg text-xs font-bold ${currentPage === p ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-gray-50'}`}>{p}</button>
                      })}
                      <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 border rounded-lg text-xs font-bold disabled:opacity-50">Next</button>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: SUGGESTIONS */}
        {/* ========================================================= */}
        {activeTab === "suggestions" && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black">Saran Pengguna</h3>
                <button onClick={fetchSuggestions} className="p-3 bg-white border border-gray-100 rounded-2xl text-orange-500 shadow-sm hover:bg-orange-50"><RefreshCw size={20} /></button>
             </div>
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.map((s) => (
                  <div key={s.id} className={CARD_STYLE + " p-8 flex flex-col h-full"}>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${s.status === 'reviewed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                        {s.category}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">{s.status === 'reviewed' ? 'Reviewed' : 'Pending'}</span>
                    </div>
                    <p className="text-gray-700 font-medium italic mb-8 flex-1 leading-relaxed">"{s.saran}"</p>
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-400">{s.nama?.charAt(0) || "A"}</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">{s.nama || "Anonim"}</p>
                        <p className="text-[10px] text-gray-400">{s.user_email || "No Email"}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedSuggestion(s); setSuggestionResponse(s.response || ""); }} className="p-3 bg-orange-500 text-white rounded-xl shadow-md hover:bg-orange-600 transition-all"><Eye size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: ANALYTICS */}
        {/* ========================================================= */}
        {activeTab === "analytics" && analytics && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h3 className="text-2xl font-black">Performance Analytics</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className={CARD_STYLE + " p-6"}>
                <h4 className="text-sm font-bold text-gray-400 mb-4">Total Revenue</h4>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">{formatPrice(analytics.totalRevenue)}</p>
                <p className="text-xs font-bold text-gray-400 mt-2">Dari {analytics.totalOrders} total pesanan</p>
              </div>
              <div className={CARD_STYLE + " p-6"}>
                <h4 className="text-sm font-bold text-gray-400 mb-4">Monthly Revenue</h4>
                <p className="text-4xl font-black text-green-500">{formatPrice(analytics.monthlyRevenue)}</p>
                <p className="text-xs font-bold text-gray-400 mt-2">Dari {analytics.monthlyOrders} pesanan bulan ini</p>
              </div>
              <div className={CARD_STYLE + " p-6"}>
                <h4 className="text-sm font-bold text-gray-400 mb-4">Average Order Value</h4>
                <p className="text-4xl font-black text-blue-500">{formatPrice(analytics.averageOrderValue)}</p>
                <p className="text-xs font-bold text-gray-400 mt-2">Rata-rata per pesanan</p>
              </div>
            </div>

            <div className={CARD_STYLE + " p-8"}>
              <h3 className="text-xl font-black mb-6">Top Services</h3>
              <div className="space-y-4">
                {analytics.topServices.map((srv, idx) => (
                  <div key={srv.service} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center font-black text-orange-600">{idx + 1}</div>
                      <div>
                        <p className="font-bold text-gray-900">{srv.service}</p>
                        <p className="text-xs font-medium text-gray-500">{srv.count} pesanan</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">{formatPrice(srv.revenue)}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-xs text-amber-500 font-bold"><Star size={12} className="fill-current"/> Popular</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: WEBSITE SETTINGS */}
        {/* ========================================================= */}
        {activeTab === "website" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className={CARD_STYLE + " p-8"}>
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-black">Website Content Management</h3>
                <button onClick={() => setEditingSettings(!editingSettings)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${editingSettings ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Edit3 size={18} /> {editingSettings ? "Batal Edit" : "Edit Konten"}
                </button>
              </div>

              <div className="space-y-6 max-w-2xl">
                {[
                  { label: "Site Name", key: "siteName", type: "text" },
                  { label: "Hero Title", key: "heroTitle", type: "text" },
                  { label: "Hero Subtitle", key: "heroSubtitle", type: "textarea" },
                  { label: "Admin WhatsApp", key: "adminPhone", type: "tel" },
                  { label: "Admin Email", key: "adminEmail", type: "email" },
                  { label: "Auto-reply Message", key: "autoReplyMessage", type: "textarea" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">{field.label}</label>
                    {editingSettings ? (
                      field.type === "textarea" ? (
                        <textarea value={(websiteSettings as any)[field.key]} onChange={(e) => setWebsiteSettings({...websiteSettings, [field.key]: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-medium" />
                      ) : (
                        <input type={field.type} value={(websiteSettings as any)[field.key]} onChange={(e) => setWebsiteSettings({...websiteSettings, [field.key]: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-medium" />
                      )
                    ) : (
                      <p className="text-gray-900 bg-gray-50 p-4 rounded-xl font-medium border border-transparent">{String((websiteSettings as any)[field.key])}</p>
                    )}
                  </div>
                ))}
                
                {editingSettings && (
                  <button onClick={saveWebsiteSettings} className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 mt-4">
                    <Save size={18}/> Simpan Perubahan
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PRICING MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === "pricing" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className={CARD_STYLE + " p-8"}>
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-black">Pricing Management</h3>
                <button onClick={() => setEditingSettings(!editingSettings)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm ${editingSettings ? 'bg-gray-100 text-gray-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Edit3 size={18} /> {editingSettings ? "Batal Edit" : "Edit Harga"}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                {/* Base Prices */}
                <div>
                  <h4 className="font-black text-gray-400 uppercase tracking-widest text-sm mb-4">Service Base Prices</h4>
                  <div className="space-y-3">
                    {Object.entries(websiteSettings.servicePrices).map(([srv, price]) => (
                      <div key={srv} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="font-bold capitalize">{srv.replace("-", " ")}</span>
                        {editingSettings ? (
                          <input type="number" value={price} onChange={(e) => setWebsiteSettings({...websiteSettings, servicePrices: {...websiteSettings.servicePrices, [srv]: Number(e.target.value)}})} className="w-32 px-3 py-1.5 border rounded-lg text-right font-bold" />
                        ) : (
                          <span className="font-black">{formatPrice(price)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Increments */}
                <div>
                  <h4 className="font-black text-gray-400 uppercase tracking-widest text-sm mb-4">Package Increments</h4>
                  <div className="space-y-3">
                    {Object.entries(websiteSettings.packagepriceIncrement).map(([pkg, inc]) => (
                      <div key={pkg} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="font-bold capitalize">{pkg}</span>
                        {editingSettings ? (
                          <input type="number" value={inc} onChange={(e) => setWebsiteSettings({...websiteSettings, packagepriceIncrement: {...websiteSettings.packagepriceIncrement, [pkg]: Number(e.target.value)}})} className="w-32 px-3 py-1.5 border rounded-lg text-right font-bold" />
                        ) : (
                          <span className="font-black">{formatPrice(inc)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {editingSettings && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button onClick={saveWebsiteSettings} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 hover:bg-green-600">
                    <Save size={18}/> Simpan Harga
                  </button>
                </div>
              )}

              {/* Preview */}
              <div className="mt-10 p-6 bg-blue-50 border border-blue-100 rounded-[2rem]">
                <h4 className="font-black text-blue-900 mb-6">Kalkulator Preview</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(websiteSettings.servicePrices).map(([srv, base]) => (
                    <div key={srv} className="bg-white p-5 rounded-2xl shadow-sm">
                      <h5 className="font-black capitalize mb-3 text-gray-800 border-b pb-2">{srv.replace("-", " ")}</h5>
                      <div className="space-y-2 text-sm">
                        {Object.entries(websiteSettings.packagepriceIncrement).map(([pkg, inc]) => (
                          <div key={pkg} className="flex justify-between items-center">
                            <span className="capitalize text-gray-500 font-medium">{pkg}</span>
                            <span className="font-bold">{formatPrice(base + inc)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: SYSTEM SETTINGS */}
        {/* ========================================================= */}
        {activeTab === "settings" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className={CARD_STYLE + " p-8"}>
              <h3 className="text-xl font-black mb-8">System Configuration</h3>
              <div className="space-y-4 max-w-2xl">
                <div className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="font-black text-gray-900">Database Status</p>
                    <p className="text-sm font-medium text-gray-500">{connectionStatus === "connected" ? "Connected to Supabase" : (connectionStatus === "mock" ? "Demo Mode (Mock Data)" : "Connection Error")}</p>
                  </div>
                  {connectionStatus === "connected" ? <Wifi className="text-green-500"/> : <WifiOff className="text-amber-500"/>}
                </div>
                <div className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="font-black text-gray-900">WhatsApp Integration</p>
                    <p className="text-sm font-medium text-gray-500">{process.env.NEXT_PUBLIC_ULTRAMSG_INSTANCE_ID ? "Ultramsg Configured" : "Not Configured"}</p>
                  </div>
                  <Smartphone className={process.env.NEXT_PUBLIC_ULTRAMSG_INSTANCE_ID ? "text-green-500" : "text-gray-300"} />
                </div>
                <div className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl">
                  <div>
                    <p className="font-black text-gray-900">Email Notifications</p>
                    <p className="text-sm font-medium text-gray-500">{process.env.WEB3FORMS_ACCESS_KEY ? "Web3Forms Configured" : "Not Configured"}</p>
                  </div>
                  <Mail className={process.env.WEB3FORMS_ACCESS_KEY ? "text-green-500" : "text-gray-300"} />
                </div>
              </div>

              <h3 className="text-xl font-black mt-12 mb-6 text-red-600">Danger Zone</h3>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => { if(confirm("Clear local cache?")) { localStorage.clear(); window.location.reload(); } }} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold border border-red-100 hover:bg-red-100">
                  <Trash2 size={18}/> Reset Local Settings
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* MODAL: SUGGESTION REVIEW */}
      {/* ========================================================= */}
      {selectedSuggestion && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] max-w-2xl w-full p-8 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
                <h4 className="text-2xl font-black flex items-center gap-2 text-orange-500"><BookOpen /> Review Saran</h4>
                <button onClick={() => setSelectedSuggestion(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20}/></button>
             </div>
             <div className="bg-orange-50 p-4 rounded-xl mb-6">
                <p className="text-sm font-bold italic text-gray-800">"{selectedSuggestion.saran}"</p>
             </div>
             <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Respon Admin</label>
             <textarea rows={4} value={suggestionResponse} onChange={(e) => setSuggestionResponse(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-orange-500 outline-none font-medium mb-6" placeholder="Tulis balasan..."/>
             <div className="flex justify-end gap-3">
                <button onClick={() => setSelectedSuggestion(null)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50">Batal</button>
                <button onClick={async () => {
                   try {
                     const res = await fetch(`/api/admin/suggestions/${selectedSuggestion.id}`, { method: "PATCH", headers: {"Content-Type": "application/json"}, body: JSON.stringify({response: suggestionResponse, status: "reviewed"}) });
                     if(res.ok) { setSelectedSuggestion(null); fetchSuggestions(); } else { alert("Gagal menyimpan"); }
                   } catch(err) { alert("Error jaringan"); }
                }} className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 shadow-lg shadow-orange-500/20">
                   <Send size={18}/> Simpan & Tandai Selesai
                </button>
             </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ORDER DETAILS */}
      {/* ========================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 overflow-y-auto max-h-[90vh] no-scrollbar">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter">Order Detail</h3>
                  <p className="text-orange-500 font-bold tracking-widest uppercase text-xs mt-1">{selectedOrder.order_number}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-4 bg-gray-50 rounded-full text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-all"><X size={24} /></button>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="bg-gray-50 rounded-[2rem] p-8 space-y-4 border border-gray-100">
                    <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-widest">Informasi Klien</h4>
                    <div className="flex items-center gap-4"><User className="text-orange-500" /><p className="font-bold">{selectedOrder.name}</p></div>
                    <div className="flex items-center gap-4 text-sm text-gray-600"><Mail size={18} /><p>{selectedOrder.email}</p></div>
                    <div className="flex items-center gap-4 text-sm text-gray-600"><Phone size={18} /><p>{selectedOrder.phone}</p></div>
                  </div>
                  <div className="bg-gray-50 rounded-[2rem] p-8 space-y-4 border border-gray-100">
                    <h4 className="font-black text-gray-400 uppercase text-[10px] tracking-widest">Detail Layanan</h4>
                    <p className="text-lg font-black text-gray-900">{selectedOrder.service}</p>
                    <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                      <span>Paket: <span className="text-orange-500 uppercase">{selectedOrder.package}</span></span>
                      <span>Total: <span className="text-gray-900 text-lg">{formatPrice(selectedOrder.total_price)}</span></span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 text-white rounded-[2rem] p-8 space-y-6 shadow-2xl">
                  <h4 className="font-black text-orange-500 uppercase text-[10px] tracking-widest">Instruksi Desain</h4>
                  <div><p className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Judul Poster</p><p className="text-lg font-bold">{selectedOrder.title}</p></div>
                  <div><p className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Deskripsi</p><p className="text-gray-400 text-sm leading-relaxed">{selectedOrder.description}</p></div>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                    <div><p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Warna</p><p className="text-xs font-bold">{selectedOrder.colors || "-"}</p></div>
                    <div><p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Deadline</p><p className="text-xs font-bold">{new Date(selectedOrder.deadline).toLocaleDateString()}</p></div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button onClick={() => sendWhatsAppMessage(selectedOrder.phone, selectedOrder.order_number)} className="flex-1 py-5 bg-green-500 text-white rounded-[1.5rem] font-black shadow-xl shadow-green-500/20 hover:scale-[1.02] transition-all">Hubungi WhatsApp</button>
                <button onClick={() => { setSelectedOrder(null); setEditingOrder(selectedOrder); }} className="px-8 py-5 bg-gray-100 rounded-[1.5rem] font-black hover:bg-orange-50 hover:text-orange-500 transition-all">Edit Pesanan</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT ORDER */}
      {/* ========================================================= */}
      {editingOrder && (
        <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-10 overflow-y-auto max-h-[90vh] no-scrollbar">
              <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                <div>
                  <h3 className="text-3xl font-black tracking-tighter">Edit Order</h3>
                  <p className="text-amber-500 font-bold tracking-widest uppercase text-xs mt-1">{editingOrder.order_number}</p>
                </div>
                <button onClick={() => setEditingOrder(null)} className="p-4 bg-gray-50 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"><X size={24} /></button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); updateOrder(editingOrder.id, editingOrder); }}>
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                  <div className="space-y-4">
                    <h4 className="font-black text-gray-400 uppercase tracking-widest text-[10px] mb-4">Informasi Customer</h4>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1">Nama</label><input type="text" value={editingOrder.name} onChange={(e) => setEditingOrder({...editingOrder, name: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-sm"/></div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1">Email</label><input type="email" value={editingOrder.email} onChange={(e) => setEditingOrder({...editingOrder, email: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-sm"/></div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1">Telepon</label><input type="tel" value={editingOrder.phone} onChange={(e) => setEditingOrder({...editingOrder, phone: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-sm"/></div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1">Perusahaan</label><input type="text" value={editingOrder.company || ""} onChange={(e) => setEditingOrder({...editingOrder, company: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-sm"/></div>
                    
                    <h4 className="font-black text-gray-400 uppercase tracking-widest text-[10px] mt-8 mb-4">Status & Harga</h4>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Status</label>
                      <select value={editingOrder.status} onChange={(e) => setEditingOrder({...editingOrder, status: e.target.value as any})} className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-bold text-sm">
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1">Total Harga (Rp)</label><input type="number" value={editingOrder.total_price} onChange={(e) => setEditingOrder({...editingOrder, total_price: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-black text-sm"/></div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-black text-gray-400 uppercase tracking-widest text-[10px] mb-4">Detail Layanan</h4>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Layanan</label>
                      <select value={editingOrder.service} onChange={(e) => setEditingOrder({...editingOrder, service: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-sm">
                        <option value="poster-event">Poster Event</option><option value="poster-edukasi">Poster Edukasi</option><option value="social-media">Social Media</option><option value="print-flyer">Print Flyer</option><option value="lainya">Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Paket</label>
                      <select value={editingOrder.package} onChange={(e) => setEditingOrder({...editingOrder, package: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-sm">
                        <option value="basic">Basic</option><option value="professional">Professional</option><option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1">Judul Poster</label><input type="text" value={editingOrder.title} onChange={(e) => setEditingOrder({...editingOrder, title: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-bold text-sm"/></div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1">Deskripsi</label><textarea rows={3} value={editingOrder.description} onChange={(e) => setEditingOrder({...editingOrder, description: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-sm"/></div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1">Dimensi/Ukuran</label><input type="text" value={editingOrder.dimensions || ""} onChange={(e) => setEditingOrder({...editingOrder, dimensions: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-sm"/></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-bold text-gray-600 mb-1">Tema Warna</label><input type="text" value={editingOrder.colors || ""} onChange={(e) => setEditingOrder({...editingOrder, colors: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-sm"/></div>
                      <div><label className="block text-xs font-bold text-gray-600 mb-1">Deadline</label><input type="date" value={editingOrder.deadline} onChange={(e) => setEditingOrder({...editingOrder, deadline: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-medium text-sm"/></div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100 flex gap-4">
                  <button type="submit" className="flex-1 py-4 bg-amber-500 text-white rounded-[1.5rem] font-black shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition-all flex items-center justify-center gap-2">
                    <Save size={20} /> Simpan Perubahan
                  </button>
                  <button type="button" onClick={() => setEditingOrder(null)} className="px-8 py-4 bg-gray-100 text-gray-600 rounded-[1.5rem] font-black hover:bg-gray-200 transition-all">Batal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- STYLE OVERRIDES --- */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}