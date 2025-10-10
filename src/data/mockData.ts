// Mock Data for all pages

// Tariffs Mock Data
export const mockTariffs = [
  {
    id: 1,
    name: "Europe Basic",
    regions: ["France", "Germany", "Italy"],
    sms: 100,
    minutes: 500,
    price_arrival: 1500,
    price_sell: 2000,
    provider: { name: "Vodafone" },
    quantity_internet: 5,
    expiry_day: 30,
  },
  {
    id: 2,
    name: "Asia Premium",
    regions: ["China", "Japan", "Korea"],
    sms: 200,
    minutes: 1000,
    price_arrival: 2500,
    price_sell: 3500,
    provider: { name: "China Mobile" },
    quantity_internet: 10,
    expiry_day: 30,
  },
  {
    id: 3,
    name: "USA Standard",
    regions: ["USA"],
    sms: 150,
    minutes: 750,
    price_arrival: 2000,
    price_sell: 2800,
    provider: { name: "AT&T" },
    quantity_internet: 8,
    expiry_day: 30,
  },
];

// Regions Mock Data
export const mockRegions = [
  {
    id: 1,
    name: "Europe",
    countries: ["France", "Germany", "Italy", "Spain"],
  },
  {
    id: 2,
    name: "Asia",
    countries: ["China", "Japan", "Korea", "Thailand"],
  },
  {
    id: 3,
    name: "Americas",
    countries: ["USA", "Canada", "Mexico", "Brazil"],
  },
];

// Region Groups Mock Data
export const mockRegionGroups = [
  {
    id: 1,
    name: "Western Europe",
    regions: ["France", "Germany", "Italy"],
  },
  {
    id: 2,
    name: "East Asia",
    regions: ["China", "Japan", "Korea"],
  },
  {
    id: 3,
    name: "North America",
    regions: ["USA", "Canada"],
  },
];

// Partners Mock Data
export const mockPartners = [
  {
    id: 1,
    name_ru: "Vodafone",
    name_en: "Vodafone",
    description_ru: "Глобальный оператор связи",
    description_en: "Global telecommunications operator",
    status: "ACTIVE",
    identified_number: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name_ru: "China Mobile",
    name_en: "China Mobile",
    description_ru: "Крупнейший оператор Китая",
    description_en: "China's largest operator",
    status: "ACTIVE",
    identified_number: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name_ru: "AT&T",
    name_en: "AT&T",
    description_ru: "Американский телеком гигант",
    description_en: "American telecom giant",
    status: "INACTIVE",
    identified_number: 3,
    created_at: new Date().toISOString(),
  },
];

// Users Mock Data
export const mockUsers = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    phone: "+998901234567",
    role: "Admin",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Manager User",
    email: "manager@example.com",
    phone: "+998901234568",
    role: "Manager",
    status: "ACTIVE",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Operator User",
    email: "operator@example.com",
    phone: "+998901234569",
    role: "Operator",
    status: "INACTIVE",
    created_at: new Date().toISOString(),
  },
];

// Orders Mock Data
export const mockOrders = [
  {
    id: 1,
    client: { full_name: "John Doe", id: 1 },
    client_id: 1,
    sim_type: { name: "eSIM" },
    created_at: new Date().toISOString(),
    plan: {
      name: "Europe Basic",
      provider: { name: "Vodafone" },
      quantity_internet: 5,
      expiry_day: 30,
      price_sell: 2000,
    },
    user: { name: "Admin User" },
    region_group: { name: "Western Europe" },
    simcards: [{ ssid: "8901234567890123456" }],
    date_start: new Date().toISOString(),
    date_finish: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    payments: [{ payment_type: "Наличные", amount: 2000 }],
    status_id: 2,
    additional_plan_id: null,
  },
  {
    id: 2,
    client: { full_name: "Jane Smith", id: 2 },
    client_id: 2,
    sim_type: { name: "Physical SIM" },
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    plan: {
      name: "Asia Premium",
      provider: { name: "China Mobile" },
      quantity_internet: 10,
      expiry_day: 30,
      price_sell: 3500,
    },
    user: { name: "Admin User" },
    region_group: { name: "East Asia" },
    simcards: [{ ssid: "8901234567890123457" }],
    date_start: new Date().toISOString(),
    date_finish: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    payments: [{ payment_type: "Карта", amount: 3500 }],
    status_id: 2,
    additional_plan_id: null,
  },
];

// News Mock Data
export const mockNews = [
  {
    id: 1,
    title: "New eSIM Plans Available",
    description: "We've launched new affordable eSIM plans for travelers",
    language: "en",
    content: "Full content here...",
    image_url: "https://via.placeholder.com/400x200",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Expansion to Asia",
    description: "Our services are now available in 10 new Asian countries",
    language: "en",
    content: "Full content here...",
    image_url: "https://via.placeholder.com/400x200",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// FAQ Mock Data
export const mockFaq = [
  {
    id: 1,
    question: "How do I activate my eSIM?",
    answer:
      "You can activate your eSIM by scanning the QR code sent to your email.",
    language: "en",
  },
  {
    id: 2,
    question: "What is the coverage area?",
    answer: "Our eSIMs work in over 150 countries worldwide.",
    language: "en",
  },
  {
    id: 3,
    question: "Can I top up my plan?",
    answer: "Yes, you can top up your plan anytime through our mobile app.",
    language: "en",
  },
];

// Transactions Mock Data
export const mockTransactions = [
  {
    id: 1,
    agent: { name: "Agent 1" },
    user: { name: "John Doe" },
    amount: 2000,
    type: "Пополнение",
    action: "Завершено",
    message: "Payment received",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    agent: { name: "Agent 2" },
    user: { name: "Jane Smith" },
    amount: 3500,
    type: "Оплата",
    action: "Завершено",
    message: "Order paid",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

// Dashboard Stats Mock Data
export const mockDashboardStats = {
  total_orders: 156,
  active_orders: 89,
  total_revenue: 4250000,
  new_customers: 45,
  revenue_change: 12.5,
  orders_change: 8.3,
  customers_change: 15.2,
};

// Dashboard Chart Mock Data
export const mockChartData = [
  { date: "2024-01-01", revenue: 150000, orders: 45 },
  { date: "2024-01-02", revenue: 180000, orders: 52 },
  { date: "2024-01-03", revenue: 165000, orders: 48 },
  { date: "2024-01-04", revenue: 195000, orders: 58 },
  { date: "2024-01-05", revenue: 210000, orders: 62 },
  { date: "2024-01-06", revenue: 175000, orders: 51 },
  { date: "2024-01-07", revenue: 190000, orders: 55 },
];

// Helper function to simulate API delay
export const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Generate unique ID
let nextId = 1000;
export const generateId = () => ++nextId;
