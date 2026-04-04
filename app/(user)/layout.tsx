import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserBottomNav } from "@/components/UserBottomNav"
import { CartProvider, CartDrawer } from "@/components/cart"

export default async function UserAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/loginUser")
  }

  return (
    <CartProvider>
      <div className="w-full min-h-screen bg-slate-50 flex flex-col relative">
        <div className="relative w-full min-h-screen bg-slate-50 flex flex-col">
          {children}
          <UserBottomNav />
          <CartDrawer />
        </div>
      </div>
    </CartProvider>
  )
}
