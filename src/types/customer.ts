export interface ShippingAddress {
  name: string
  phone_number: string
  address: string
  city: string
  district: string
  state: string
  postcode: string
}

export interface CustomerByPhoneResponse {
  exists: boolean
  name?: string
  addresses: ShippingAddress[]
}

export interface CartOrderItem {
  productId: string
  variantId?: string
  quantity: number
}

export interface OrderCreateRequest {
  storeSlug: string
  items: CartOrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
}

export interface OrderRazorpayDetails {
  keyId: string
  orderId: string
  amount: number
  currency: string
}

export interface OrderCreateResponse {
  success: boolean
  orderId: string
  orderNumber?: string
  checkoutToken?: string
  razorpay?: OrderRazorpayDetails
}

export interface RazorpayVerifyResult {
  success: boolean
  paymentStatus?: string
  orderStatus?: string
  orderNumber?: string
}
