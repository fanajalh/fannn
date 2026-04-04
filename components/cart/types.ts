export interface CartItem {
  id: string
  serviceId: string
  serviceName: string
  packageId: string
  packageName: string
  price: number
  quantity: number
}

export interface CartContextType {
  items: CartItem[]
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  addItem: (item: Omit<CartItem, "id" | "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}
