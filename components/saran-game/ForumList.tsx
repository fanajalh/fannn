"use client"
import { useState, useEffect } from "react"
import { Flame, MessageCircle, UserCircle2, ArrowRight, Loader2, TrendingUp, Clock, Zap } from "lucide-react"
import { supabase } from "@/lib/supabase/client"

// Helper untuk format waktu
function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + " thn lalu";
  interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + " bln lalu";
  interval = seconds / 86400; if (interval > 1) return Math.floor(interval) + " hari lalu";
  interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + " jam lalu";
  interval = seconds / 60; if (interval > 1) return Math.floor(interval) + " mnt lalu";
  return "Baru saja"
}

export default function ForumList() {
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [sortBy, setSortBy] = useState<"terpopuler" | "terbaru">("terpopuler") // State untuk Sorting
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({})

  // Ambil data dari database
  const fetchSuggestions = async () => {
    const { data, error } = await supabase
      .from("game_suggestions")
      .select(`
        *,
        replies:game_suggestion_replies(*)
      `)
      // Kita fetch semua dulu, nanti di-sort di frontend agar mulus saat ganti tab
      .order("created_at", { ascending: false })

    if (!error && data) {
      setSuggestions(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSuggestions()
  }, [])

  // Fungsi untuk mengirim balasan/komentar
  const handleReply = async (suggestionId: number) => {
    const content = replyText[suggestionId]
    if (!content || !content.trim()) return

    const { data: userData } = await supabase.auth.getUser()
    const authorName = userData?.user?.user_metadata?.username || "Player Anonim"

    const { error } = await supabase.from("game_suggestion_replies").insert({
      suggestion_id: suggestionId,
      author: authorName,
      content: content
    })

    if (!error) {
      fetchSuggestions()
      setReplyText({ ...replyText, [suggestionId]: "" })
    }
  }

  // Fungsi untuk Upvote (Ditambah animasi visual ringan nantinya)
  const handleUpvote = async (suggestionId: number, currentUpvotes: number) => {
    // Optimistic UI Update (Biar angka nambah duluan sebelum ke database biar kerasa instan)
    setSuggestions(prev => prev.map(s => s.id === suggestionId ? { ...s, upvotes: s.upvotes + 1 } : s))

    await supabase
      .from("game_suggestions")
      .update({ upvotes: currentUpvotes + 1 })
      .eq("id", suggestionId)
    
    // Validasi data asli dari server
    fetchSuggestions()
  }

  // 1. Filter kategori
  const filteredSuggestions = activeCategory === "Semua" 
    ? suggestions 
    : suggestions.filter(s => s.category.includes(activeCategory))

  // 2. Sorting Data (Terpopuler vs Terbaru)
  const sortedSuggestions = [...filteredSuggestions].sort((a, b) => {
    if (sortBy === "terpopuler") {
      return b.upvotes - a.upvotes; // Vote terbanyak di atas
    } else {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Waktu terbaru di atas
    }
  })

  return (
    <div id="forum-diskusi" className="space-y-6">
      
      {/* HEADER FORUM & FILTER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-4 md:p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        
        {/* Kategori */}
        <div>
          <h2 className="text-xl font-black text-gray-900 mb-3 flex items-center gap-2">
            <MessageCircle size={20} className="text-orange-500" /> Diskusi Player
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Semua", "Gameplay", "Item Kosan", "Bug"].map(cat => (
              <button 
                key={cat} 
                className={`px-4 py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-gray-50 border border-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-600'}`} 
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Sorting */}
        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shrink-0">
          <button 
            onClick={() => setSortBy("terpopuler")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${sortBy === "terpopuler" ? "bg-white text-orange-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            <TrendingUp size={14} /> Terpopuler
          </button>
          <button 
            onClick={() => setSortBy("terbaru")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${sortBy === "terbaru" ? "bg-white text-orange-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Clock size={14} /> Terbaru
          </button>
        </div>
      </div>

      {/* RENDER KONTEN */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
          <Loader2 className="animate-spin text-orange-500 w-10 h-10 mb-4" />
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Memuat Data Server...</p>
        </div>
      ) : sortedSuggestions.length === 0 ? (
        
        // EMPTY STATE SVG LUCU
        <div className="bg-white p-12 flex flex-col items-center justify-center text-center rounded-[2rem] border border-gray-100 shadow-sm animate-in zoom-in-95 duration-500">
          <div className="w-40 h-40 mb-6 text-gray-200">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M40 80L100 40L160 80V150C160 155.523 155.523 160 150 160H50C44.4772 160 40 155.523 40 150V80Z" fill="currentColor" opacity="0.5"/>
              <path d="M100 40L40 80L100 120L160 80L100 40Z" fill="#F3F4F6"/>
              {/* Zzz animation */}
              <g className="animate-[bounce_2s_infinite]">
                <text x="80" y="30" fontSize="24" fill="#9CA3AF" fontWeight="bold">Z</text>
                <text x="100" y="15" fontSize="16" fill="#9CA3AF" fontWeight="bold">z</text>
                <text x="115" y="5" fontSize="12" fill="#9CA3AF" fontWeight="bold">z</text>
              </g>
            </svg>
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Sepi Banget...</h3>
          <p className="text-sm font-medium text-gray-500 max-w-xs">Belum ada ide di kategori ini. Jadilah yang pertama memberikan saran brilian!</p>
        </div>

      ) : (
        sortedSuggestions.map((suggestion, index) => {
          // Logika untuk menampilkan badge HOT (Vote > 5 atau juara 1 di tab terpopuler)
          const isHot = suggestion.upvotes >= 5 || (sortBy === "terpopuler" && index === 0 && suggestion.upvotes > 0);

          return (
            <div key={suggestion.id} className="relative bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300">
              
              {/* BADGE HOT IDEA (Melayang di sudut) */}
              {isHot && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-1 animate-bounce" style={{animationDuration: '3s'}}>
                  <Zap size={12} className="fill-white" /> Hot Idea
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-full border border-gray-100 flex items-center justify-center">
                    <UserCircle2 size={24} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{suggestion.author}</p>
                    <p className="text-[10px] font-bold text-gray-400">{timeAgo(suggestion.created_at)}</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {suggestion.category}
                </span>
              </div>

              <p className="text-gray-700 font-medium leading-relaxed mb-6 text-sm md:text-base">
                {suggestion.content}
              </p>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                <button 
                  onClick={() => handleUpvote(suggestion.id, suggestion.upvotes)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-600 rounded-2xl font-black text-xs transition-all group shadow-sm active:scale-95"
                >
                  <Flame size={16} className="group-hover:fill-white transition-colors" /> 
                  {suggestion.upvotes} Upvote
                </button>
                <div className="flex items-center gap-2 text-gray-400 font-bold text-xs bg-gray-50 px-4 py-2.5 rounded-2xl">
                  <MessageCircle size={16} /> {suggestion.replies?.length || 0} Balasan
                </div>
              </div>

              {/* AREA BALASAN */}
              <div className="space-y-4">
                {suggestion.replies?.map((reply: any) => (
                  <div key={reply.id} className="flex gap-3 pl-4 border-l-2 border-orange-100">
                    <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border border-gray-100">
                      <UserCircle2 size={16} className="text-gray-400" />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none flex-1 border border-gray-100/50">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-black text-gray-900">{reply.author}</span>
                        <span className="text-[9px] font-bold text-gray-400">{timeAgo(reply.created_at)}</span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium leading-relaxed">{reply.content}</p>
                    </div>
                  </div>
                ))}

                {/* Form Balasan */}
                <div className="flex gap-3 mt-4 pt-2">
                  <div className="w-8 h-8 bg-orange-50 border border-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <UserCircle2 size={16} className="text-orange-500" />
                  </div>
                  <div className="flex-1 relative group">
                    <input 
                      type="text" 
                      placeholder="Ikut diskusi atau balas ide ini..." 
                      className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-4 pr-12 text-xs font-medium outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm group-hover:shadow-md"
                      value={replyText[suggestion.id] || ""}
                      onChange={(e) => setReplyText({...replyText, [suggestion.id]: e.target.value})}
                      onKeyDown={(e) => e.key === "Enter" && handleReply(suggestion.id)}
                    />
                    <button 
                      onClick={() => handleReply(suggestion.id)}
                      disabled={!replyText[suggestion.id]}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-900 hover:bg-orange-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale active:scale-90"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )
        })
      )}
    </div>
  )
}