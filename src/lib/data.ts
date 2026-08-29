export const navLinks = [
  { label: 'Your Store', href: '#store' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Built For', href: '#built-for' },
  { label: 'Contact', href: '#contact' },
] as const

export const customerQuestions = [
  'Do you have this product?',
  "What's the price?",
  'Is it available in my size?',
  'Can you send the purchase link?',
] as const

export const catalogHighlights = [
  {
    icon: '📋',
    label: 'Product Catalog',
    description: 'Organize products with images, variants, and categories.',
  },
  {
    icon: '🔍',
    label: 'Search & Browse',
    description: 'Customers find products quickly on your store.',
  },
  {
    icon: '🛒',
    label: 'Built-in Checkout',
    description: 'Customers buy directly from your storefront.',
  },
  {
    icon: '🔗',
    label: 'Shareable Store Link',
    description: 'One link for WhatsApp, Instagram, and everywhere else.',
  },
] as const

export const mobileAppFeatures = [
  'Manage orders and update status on the go',
  'Add or edit products in your catalog instantly',
  'Reply to customer inquiries from one inbox',
  'Track sales and inventory from your phone',
  'Get notified for new orders and low stock',
] as const

export const upcomingFeatures = [
  {
    title: 'Courier Tracking',
    description:
      'Share live delivery tracking with customers — from dispatch to doorstep. Keep buyers informed and reduce "where is my order?" messages.',
    icon: '🛵',
  },
] as const

export const steps = [
  {
    number: '01',
    title: 'Create Your Store',
    description:
      'Create your branded online store in minutes at your own subdomain. Add products, images, pricing, stock, and categories to your catalog.',
    example: 'yourstore.aishopy.io',
    icon: '🏪',
  },
  {
    number: '02',
    title: 'Connect WhatsApp & Instagram',
    description:
      'Connect your WhatsApp Business and Instagram accounts. AiShopy automatically receives customer inquiries and responds on your behalf.',
    icon: '📱',
  },
  {
    number: '03',
    title: 'Let AI Handle Product Questions',
    description:
      'Customers can ask naturally and the AI searches your catalog and responds instantly.',
    examples: [
      '"Show me black shirts under ₹1000"',
      '"Do you have this in XL?"',
      '"Suggest something for office wear"',
    ],
    icon: '🤖',
  },
  {
    number: '04',
    title: 'Send Customers to Checkout',
    description:
      'When customers are ready to buy, AiShopy sends product links, store links, payment links, and UPI options.',
    items: ['Product links', 'Store links', 'Payment links', 'UPI payment options'],
    icon: '💳',
  },
  {
    number: '05',
    title: 'Manage Orders',
    description: 'Track every order from one dashboard. Never lose track of an order again.',
    statuses: [
      'Pending Payment',
      'Paid',
      'Processing',
      'Ready to Dispatch',
      'Dispatched',
      'Delivered',
    ],
    icon: '📊',
  },
] as const

export const features = [
  { title: 'AI Sales Assistant', description: 'Answer product questions automatically.', icon: '🤖' },
  { title: 'WhatsApp Commerce', description: 'Convert WhatsApp conversations into orders.', icon: '💬' },
  { title: 'Instagram Commerce', description: 'Sell directly from Instagram DMs.', icon: '📸' },
  {
    title: 'Branded Storefront',
    description: 'Get your own store at yourstore.aishopy.io — professional and shareable.',
    icon: '🏪',
  },
  {
    title: 'Store Product Catalog',
    description: 'Build a full catalog for your store with images, variants, categories, and pricing.',
    icon: '📋',
  },
  {
    title: 'Owner Mobile App',
    description: 'Easily manage your store, orders, and catalog from your phone — built for owners.',
    icon: '📲',
  },
  { title: 'Inventory Management', description: 'Track stock levels in real time.', icon: '📦' },
  { title: 'Order Management', description: 'Manage the entire order lifecycle.', icon: '🚚' },
  {
    title: 'Payment Collection',
    description: 'Accept payments through Razorpay, UPI, and other supported payment methods.',
    icon: '💳',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Understand what customers are asking for and what products sell best.',
    icon: '📈',
  },
] as const

export const insights = [
  'Most requested products',
  'Best-selling products',
  'Products frequently out of stock',
  'Conversion rates',
  'Revenue generated from chats',
  'Top-performing campaigns',
] as const

export const audiences = [
  { title: 'Fashion Stores', description: 'Clothing, shoes, accessories, boutiques.', icon: '👗' },
  { title: 'Electronics Stores', description: 'Mobile phones, gadgets, accessories.', icon: '📱' },
  { title: 'Beauty Businesses', description: 'Cosmetics, skincare, personal care.', icon: '💄' },
  {
    title: 'Home Businesses',
    description: 'Small businesses selling through WhatsApp and Instagram.',
    icon: '🏠',
  },
  { title: 'Resellers', description: 'Manage inventory and sales from one place.', icon: '🔄' },
  {
    title: 'Local Retailers',
    description: 'Bring your business online without complicated tools.',
    icon: '🏬',
  },
] as const

export const reasons = [
  { title: 'Reduce Response Time', description: 'Answer customer questions instantly.' },
  { title: 'Increase Sales', description: 'Convert more conversations into purchases.' },
  { title: 'Save Time', description: 'Automate repetitive product inquiries.' },
  {
    title: 'Stay Organized',
    description: 'Manage products, orders, and customers from one dashboard.',
  },
  { title: 'Grow Faster', description: 'Scale your business without hiring additional support staff.' },
] as const

export const platformItems = [
  'AI Sales Assistant',
  'yourstore.aishopy.io',
  'Store Product Catalog',
  'Owner Mobile App',
  'Inventory Management',
  'Order Tracking',
  'Payment Collection',
  'Business Analytics',
] as const
