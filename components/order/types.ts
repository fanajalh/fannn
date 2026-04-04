// ==================== TYPES ====================
export interface OrderDetails {
  title: string
  description: string
  dimensions: string
  colors: string
  deadline: string
  additionalInfo: string
}

export interface OrderContact {
  name: string
  email: string
  phone: string
  company: string
}

export interface OrderData {
  service: string
  package: string
  details: OrderDetails
  files: File[]
  contact: OrderContact
}

export interface ServiceItem {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export interface PackageItem {
  id: string
  name: string
  priceIncrement: number
  features: string[]
}

// ==================== CONSTANTS ====================
export const services: ServiceItem[] = [
  { id: "poster-event", name: "Poster Event", description: "Konser, seminar, & workshop", price: 15000, image: "/feed arfan (20).png" },
  { id: "poster-edukasi", name: "Poster Edukasi", description: "Kampanye & infografis", price: 20000, image: "/feed arfan (20).png" },
  { id: "social-media", name: "Social Media", description: "Feed & Story IG/FB", price: 25000, image: "/feed arfan (20).png" },
  { id: "print-flyer", name: "Flyer & Leaflet", description: "Brosur promosi cetak", price: 15000, image: "/feed arfan (20).png" },
  { id: "lainnya", name: "Custom Design", description: "Spanduk & kebutuhan lain", price: 10000, image: "/feed arfan (20).png" },
]

export const packages: PackageItem[] = [
  { id: "basic", name: "Basic", priceIncrement: 0, features: ["2 Revisi", "Format JPG/PNG", "2-3 Hari"] },
  { id: "professional", name: "Professional", priceIncrement: 5000, features: ["5 Revisi", "Semua Format & Source", "1-2 Hari"] },
  { id: "enterprise", name: "Enterprise", priceIncrement: 20000, features: ["Unlimited Revisi", "Vector & Rush Order", "Prioritas Utama"] },
]

// ==================== HELPERS ====================
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price)
}

export const calculateTotal = (orderData: OrderData) => {
  const selectedService = services.find((s) => s.id === orderData.service)
  const selectedPackage = packages.find((p) => p.id === orderData.package)
  if (!selectedService || !selectedPackage) return 0
  return Math.round(selectedService.price + selectedPackage.priceIncrement)
}

// Shared input styles
export const inputStyle = "w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-gray-900 placeholder:text-gray-400 outline-none"
export const labelStyle = "block text-xs font-black text-gray-400 uppercase tracking-widest pl-1 mb-2"

// Initial empty order data
export const initialOrderData: OrderData = {
  service: "",
  package: "",
  details: { title: "", description: "", dimensions: "", colors: "", deadline: "", additionalInfo: "" },
  files: [],
  contact: { name: "", email: "", phone: "", company: "" },
}
