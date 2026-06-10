export interface Customer {
  id: string
  phone: string
  name?: string
}

export interface CustomerProfile extends Customer {
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  pincode?: string
}

export interface CustomerCheckResponse {
  exists: boolean
  customer?: CustomerProfile
}

export interface CustomerDetails {
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
}

export interface CartOrderItem {
  productId: string
  variantId?: string
  quantity: number
}

export interface OrderCreateRequest {
  storeSlug: string
  productId?: string
  items?: CartOrderItem[]
  customer: CustomerDetails
}

export interface OrderCreateResponse {
  success: boolean
  orderId: string
}
