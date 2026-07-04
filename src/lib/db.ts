// Database abstraction & fallback store for Velvet Roast luxury reservation system
export interface TableItem {
  id: string;
  tableNumber: string;
  capacity: number;
  location: "Indoor" | "Outdoor";
  status: "Available" | "Maintenance";
}

export interface ReservationItem {
  id: string;
  reservationNumber: string;
  customerName: string;
  email: string;
  phone: string;
  guests: number;
  seatingType: "Indoor" | "Outdoor";
  tableId: string | null;
  reservationDate: string; // YYYY-MM-DD
  reservationTime: string; // HH:MM
  duration: number; // 90
  occasion: string | null;
  specialRequests: string | null;
  status: "PendingPayment" | "Confirmed" | "Completed" | "Cancelled" | "NoShow" | "Refunded";
  depositAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentItem {
  id: string;
  reservationId: string;
  paymentId: string | null;
  orderId: string | null;
  customerName: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  paymentMethod: string | null;
  gateway: string;
  status: "Pending" | "Paid" | "Failed" | "Refunded" | "PartiallyRefunded";
  transactionDate: string | null;
  refundAmount: number;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  phone: string;
  orderType: "Delivery" | "DineIn";
  tableNumber?: string;
  deliveryAddress?: string;
  coordinates?: { lat: number; lng: number };
  items: { name: string; quantity: number; price: number; specialInstructions?: string }[];
  totalAmount: number;
  paymentId: string;
  status: "Received" | "Preparing" | "Ready" | "OutForDelivery" | "DeliveredToTable" | "Completed";
  specialRequests?: string;
  createdAt: string;
}

export interface RestaurantConfigItem {
  depositType: "FIXED_PER_TABLE" | "PER_GUEST" | "DISABLED";
  fixedDepositAmount: number;
  perGuestDepositAmount: number;
  gstRate: number;
  cancellationNoticeHours: number;
}

// Global in-memory store (persists across hot reloads in dev)
declare global {
  var __velvet_tables__: TableItem[] | undefined;
  var __velvet_reservations__: ReservationItem[] | undefined;
  var __velvet_payments__: PaymentItem[] | undefined;
  var __velvet_orders__: OrderItem[] | undefined;
  var __velvet_config__: RestaurantConfigItem | undefined;
}

const initialTables: TableItem[] = [
  { id: "tbl-2a", tableNumber: "Table 2A (Fireplace)", capacity: 2, location: "Indoor", status: "Available" },
  { id: "tbl-2b", tableNumber: "Table 2B (Window View)", capacity: 2, location: "Indoor", status: "Available" },
  { id: "tbl-4a", tableNumber: "Table 4A (Center Lounge)", capacity: 4, location: "Indoor", status: "Available" },
  { id: "tbl-4b", tableNumber: "Table 4B (Private Booth)", capacity: 4, location: "Indoor", status: "Available" },
  { id: "tbl-4c", tableNumber: "Table 4C (Terrace Garden)", capacity: 4, location: "Outdoor", status: "Available" },
  { id: "tbl-6a", tableNumber: "Table 6A (Roastery View)", capacity: 6, location: "Indoor", status: "Available" },
  { id: "tbl-6b", tableNumber: "Table 6B (VIP Alcove)", capacity: 6, location: "Indoor", status: "Available" },
  { id: "tbl-6c", tableNumber: "Table 6C (Sunset Patio)", capacity: 6, location: "Outdoor", status: "Available" },
  { id: "tbl-8a", tableNumber: "Table 8A (Grand Banquette)", capacity: 8, location: "Indoor", status: "Available" },
  { id: "tbl-8b", tableNumber: "Table 8B (Executive Enclave)", capacity: 8, location: "Indoor", status: "Available" },
];

const getTodayDateStr = () => {
  const d = new Date();
  return d.toISOString().split("T")[0];
};

const getTomorrowDateStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
};

const initialReservations: ReservationItem[] = [
  {
    id: "res-101",
    reservationNumber: "VR-8942",
    customerName: "Vikramaditya Singhania",
    email: "vikram@singhania.com",
    phone: "+91 98200 11223",
    guests: 2,
    seatingType: "Indoor",
    tableId: "tbl-2a",
    reservationDate: getTodayDateStr(),
    reservationTime: "19:00",
    duration: 90,
    occasion: "Anniversary",
    specialRequests: "Sparkling water and complimentary truffle chocolates requested.",
    status: "Confirmed",
    depositAmount: 250,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "res-102",
    reservationNumber: "VR-5531",
    customerName: "Ananya Sharma",
    email: "ananya.s@techcorp.io",
    phone: "+91 99112 33445",
    guests: 4,
    seatingType: "Indoor",
    tableId: "tbl-4a",
    reservationDate: getTodayDateStr(),
    reservationTime: "20:30",
    duration: 90,
    occasion: "Birthday",
    specialRequests: "Custom tiramisu candle arrangement.",
    status: "Confirmed",
    depositAmount: 250,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 11).toISOString(),
  },
  {
    id: "res-103",
    reservationNumber: "VR-7719",
    customerName: "Rohan Kapoor",
    email: "rohan.kapoor@vcpartners.com",
    phone: "+91 98111 88990",
    guests: 6,
    seatingType: "Indoor",
    tableId: "tbl-6b",
    reservationDate: getTomorrowDateStr(),
    reservationTime: "13:00",
    duration: 90,
    occasion: "Business Meeting",
    specialRequests: "Quiet table corner with power socket access.",
    status: "Confirmed",
    depositAmount: 250,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

const initialPayments: PaymentItem[] = [
  {
    id: "pay-101",
    reservationId: "res-101",
    paymentId: "pay_Rzp98231aXk",
    orderId: "order_Rzp88192kLp",
    customerName: "Vikramaditya Singhania",
    email: "vikram@singhania.com",
    phone: "+91 98200 11223",
    amount: 295, // 250 + 18% GST
    currency: "INR",
    paymentMethod: "UPI",
    gateway: "Razorpay",
    status: "Paid",
    transactionDate: new Date(Date.now() - 3600000 * 4).toISOString(),
    refundAmount: 0,
  },
  {
    id: "pay-102",
    reservationId: "res-102",
    paymentId: "pay_Rzp77123mNp",
    orderId: "order_Rzp66183qRs",
    customerName: "Ananya Sharma",
    email: "ananya.s@techcorp.io",
    phone: "+91 99112 33445",
    amount: 295,
    currency: "INR",
    paymentMethod: "Credit Card",
    gateway: "Razorpay",
    status: "Paid",
    transactionDate: new Date(Date.now() - 3600000 * 11).toISOString(),
    refundAmount: 0,
  },
];

if (!global.__velvet_tables__) global.__velvet_tables__ = initialTables;
if (!global.__velvet_reservations__) global.__velvet_reservations__ = initialReservations;
if (!global.__velvet_payments__) global.__velvet_payments__ = initialPayments;

const initialOrders: OrderItem[] = [
  {
    id: "ord-201",
    orderNumber: "VR-ORD-881",
    customerName: "Vikramaditya Singhania",
    phone: "+91 98200 11223",
    orderType: "DineIn",
    tableNumber: "Table 2A (Fireplace)",
    items: [
      { name: "Velvet Signature Espresso", quantity: 2, price: 349, specialInstructions: "Extra hot, no sugar" },
      { name: "Artisanal Avocado Toast", quantity: 1, price: 549, specialInstructions: "Extra chili flakes on top" },
    ],
    totalAmount: 1247,
    paymentId: "pay_RzpDine991",
    status: "Preparing",
    specialRequests: "Please serve everything together.",
    createdAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: "ord-202",
    orderNumber: "VR-ORD-882",
    customerName: "Priya Nair",
    phone: "+91 98110 44556",
    orderType: "Delivery",
    deliveryAddress: "Penthouse 4B, Horizon Towers, Marine Drive, Mumbai",
    coordinates: { lat: 18.944, lng: 72.823 },
    items: [
      { name: "Cold Brew Reserve Bottled", quantity: 3, price: 399 },
      { name: "Belgian Dark Chocolate Croissant", quantity: 2, price: 289 },
    ],
    totalAmount: 1775,
    paymentId: "pay_RzpDeliv882",
    status: "OutForDelivery",
    specialRequests: "Ring bell twice upon arrival.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

if (!global.__velvet_orders__) global.__velvet_orders__ = initialOrders;

if (!global.__velvet_config__) {
  global.__velvet_config__ = {
    depositType: "FIXED_PER_TABLE",
    fixedDepositAmount: 250,
    perGuestDepositAmount: 100,
    gstRate: 18,
    cancellationNoticeHours: 24,
  };
}

export const dbStore = {
  getTables: () => global.__velvet_tables__ || [],
  getReservations: () => global.__velvet_reservations__ || [],
  getPayments: () => global.__velvet_payments__ || [],
  getConfig: () => global.__velvet_config__!,
  updateConfig: (newCfg: Partial<RestaurantConfigItem>) => {
    global.__velvet_config__ = { ...global.__velvet_config__!, ...newCfg };
    return global.__velvet_config__;
  },
  addReservation: (res: ReservationItem) => {
    global.__velvet_reservations__?.unshift(res);
    return res;
  },
  updateReservation: (id: string, partial: Partial<ReservationItem>) => {
    const idx = global.__velvet_reservations__?.findIndex((r) => r.id === id);
    if (idx !== undefined && idx !== -1 && global.__velvet_reservations__) {
      global.__velvet_reservations__[idx] = {
        ...global.__velvet_reservations__[idx],
        ...partial,
        updatedAt: new Date().toISOString(),
      };
      return global.__velvet_reservations__[idx];
    }
    return null;
  },
  deleteReservation: (id: string) => {
    global.__velvet_reservations__ = global.__velvet_reservations__?.filter((r) => r.id !== id);
    return true;
  },
  addPayment: (pay: PaymentItem) => {
    global.__velvet_payments__?.unshift(pay);
    return pay;
  },
  getOrders: () => global.__velvet_orders__ || [],
  addOrder: (ord: OrderItem) => {
    global.__velvet_orders__?.unshift(ord);
    return ord;
  },
  updateOrder: (id: string, partial: Partial<OrderItem>) => {
    const idx = global.__velvet_orders__?.findIndex((o) => o.id === id);
    if (idx !== undefined && idx !== -1 && global.__velvet_orders__) {
      global.__velvet_orders__[idx] = {
        ...global.__velvet_orders__[idx],
        ...partial,
      };
      return global.__velvet_orders__[idx];
    }
    return null;
  },
};
