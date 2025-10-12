import axios from "./axios";

// Auth API - Exact match from api-data.json
export const authAPI = {
  login: (data) => axios.post("/auth/login", data),
  logout: () => axios.post("/logout"),
  getProfile: () => axios.get("/auth/me-staff"),
};

// Users API - Exact match from api-data.json
export const usersAPI = {
  getUsers: () => axios.get("/users"),
  createUser: (data) => axios.post("/users", data),
  updateUser: (id, data) => axios.put(`/users/${id}`, data),
  getUserById: (id) => axios.get(`/users/${id}`),
  deleteUser: (id) => axios.delete(`/users/${id}`),
  assignUserRoles: (id, data) => axios.post(`/users/${id}/assign-roles`, data),
  assignUserPermissions: (id, data) =>
    axios.post(`/users/${id}/assign-permissions`, data),
  manageUserBranches: (id, data) =>
    axios.post(`/users/${id}/manage-branches`, data),
};

// Clients API - Exact match from api-data.json
export const clientsAPI = {
  getClients: (params) => axios.get("/clients", { params }),
  createClient: (data) =>
    axios.post("/clients", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateClient: (id, data) =>
    axios.put(`/clients/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteClient: (id) => axios.delete(`/clients/${id}`),

  // Client Statuses
  getClientStatuses: () => axios.get("/client-statuses"),
  createClientStatus: (data) => axios.post("/client-statuses", data),
  updateClientStatus: (id, data) => axios.put(`/client-statuses/${id}`, data),
  deleteClientStatus: (id) => axios.delete(`/client-statuses/${id}`),
};

// Simcards API - Exact match from api-data.json
export const simcardsAPI = {
  getSimcards: () => axios.get("/simcards"),
  createSimcard: (data) => axios.post("/simcards", data),
  getSimcardById: (id) => axios.get(`/simcards/${id}`),
  updateSimcard: (id, data) => axios.put(`/simcards/${id}`, data),
  deleteSimcard: (id) => axios.delete(`/simcards/${id}`),
};

// News API - Exact match from api-data.json
export const newsAPI = {
  getNews: () => axios.get("/news"),
  createNews: (data) => axios.post("/news", data),
  getNewsById: (id) => axios.get(`/news/${id}`),
  updateNews: (id, data) => axios.put(`/news/${id}`, data),
  deleteNews: (id) => axios.delete(`/news/${id}`),
};

// FAQs API - Exact match from api-data.json
export const faqsAPI = {
  getFaqs: () => axios.get("/faqs"),
  createFaq: (data) => axios.post("/faqs", data),
  getFaqById: (id) => axios.get(`/faqs/${id}`),
  updateFaq: (id, data) => axios.put(`/faqs/${id}`, data),
  deleteFaq: (id) => axios.delete(`/faqs/${id}`),
};

// Customer Orders API - Exact match from api-data.json
export const customerOrdersAPI = {
  getCustomerOrders: () => axios.get("/customer/order-simcard/my-orders"),
  getCustomerArchiveOrders: () =>
    axios.get("/customer/order-simcard/my-archive-orders"),
  checkOrderBalance: (id) => axios.get(`/customer/order-simcard/balance/${id}`),
};

// Sim Card Orders API - Based on order-simcard endpoints
export const simCardOrdersAPI = {
  getAllSimOrders: (params) => axios.get("/order-simcard/all", { params }),
  getSimOrderById: (id) => axios.get(`/order-simcard/${id}`),
  updateSimOrderStatus: (id, data) =>
    axios.put(`/order-simcard/${id}/status`, data),
  createSimOrder: (data) => axios.post("/order-simcard/create", data),
  checkSimBalance: (iccid) =>
    axios.get(`/order-simcard/balance/check/${iccid}`),
  processSimOrder: (data) => axios.post("/order-simcard/process", data),
  createAdditionalPlan: (orderId, data) =>
    axios.post(`/order-simcard/${orderId}/additional-plan`, data),
};

// Dashboard API - Using inventory stats as alternative since no specific dashboard endpoints found
export const dashboardAPI = {
  getStats: () => axios.get("/inventories/1/stats"),
  getChartData: (warehouseId) => axios.get(`/inventories/${warehouseId}/stats`),
  getTopProducts: (warehouseId) =>
    axios.get(`/inventories/${warehouseId}/products`),
};

// Reports API
export const reportsAPI = {
  getSimcardSalesReport: (params) =>
    axios.get("/simcard-sales-report", { params }),
};

// Site API - Exact match from api-data.json
export const siteAPI = {
  // News
  getNews: () => axios.get("/news"),
  createNews: (data) => axios.post("/news", data),
  updateNews: (id, data) => axios.put(`/news/${id}`, data),
  deleteNews: (id) => axios.delete(`/news/${id}`),
  getNewsById: (id) => axios.get(`/news/${id}`),

  // FAQ
  getFaq: () => axios.get("/faqs"),
  createFaq: (data) => axios.post("/faqs", data),
  updateFaq: (id, data) => axios.put(`/faqs/${id}`, data),
  deleteFaq: (id) => axios.delete(`/faqs/${id}`),
  getFaqById: (id) => axios.get(`/faqs/${id}`),
};

// Other API
export const otherAPI = {
  // Contractors
  getContractors: () => axios.get("/contractors"),
  createContractor: (data) => axios.post("/contractors", data),
  updateContractor: (id, data) => axios.put(`/contractors/${id}`, data),
  deleteContractor: (id) => axios.delete(`/contractors/${id}`),

  // Branches
  getBranches: () => axios.get("/branches"),
  createBranch: (data) => axios.post("/branches", data),
  updateBranch: (id, data) => axios.put(`/branches/${id}`, data),
  deleteBranch: (id) => axios.delete(`/branches/${id}`),

  // Warehouses
  getWarehouses: () => axios.get("/warehouses"),

  // Transactions
  getTransactions: () => axios.get("/transactions"),
  createTransaction: (data) => axios.post("/transactions", data),
  updateTransaction: (id, data) => axios.put(`/transactions/${id}`, data),
  deleteTransaction: (id) => axios.delete(`/transactions/${id}`),
};

export const ordersAPI = {
  // Admin Orders
  getOrders: (params) => axios.get("/order/admin", { params }),

  // Product Orders
  getProductOrders: (params) => axios.get("/product-orders", { params }),
  createProductOrder: (data) => axios.post("/product-orders/create", data),
  getProductOrderById: (id) => axios.get(`/product-orders/${id}`),
  updateProductOrder: (id, data) => axios.put(`/product-orders/${id}`, data),
  deleteProductOrder: (id) => axios.delete(`/product-orders/${id}`),

  // Customer Orders
  getCustomerOrders: () => axios.get("/customer/order-simcard/my-orders"),
  getCustomerArchiveOrders: () =>
    axios.get("/customer/order-simcard/my-archive-orders"),
  checkOrderBalance: (id) => axios.get(`/customer/order-simcard/balance/${id}`),

  // Sim Card Orders
  getSimOrders: () => axios.get("/order-simcard/all"),
  createSimOrder: (data) => axios.post("/order-simcard/create", data),
  updateSimOrder: (id, data) => axios.put(`/order-simcard/${id}`, data),
  deleteSimOrder: (id) => axios.delete(`/order-simcard/${id}`),
};

export const settingsAPI = {
  // Roles
  getRoles: () => axios.get("/roles"),
  createRole: (data) => axios.post("/roles", data),
  updateRole: (id, data) => axios.put(`/roles/${id}`, data),
  deleteRole: (id) => axios.delete(`/roles/${id}`),
  getRoleById: (id) => axios.get(`/roles/${id}`),

  // Permissions
  getPermissions: () => axios.get("/permissions"),
  createPermission: (data) => axios.post("/permissions", data),
  updatePermission: (id, data) => axios.put(`/permissions/${id}`, data),
  deletePermission: (id) => axios.delete(`/permissions/${id}`),
  getPermissionById: (id) => axios.get(`/permissions/${id}`),

  // Users
  getUsers: () => axios.get("/users"),
  createUser: (data) => axios.post("/users", data),
  updateUser: (id, data) => axios.put(`/users/${id}`, data),
  deleteUser: (id) => axios.delete(`/users/${id}`),
  getUserById: (id) => axios.get(`/users/${id}`),
  assignUserRoles: (id, data) => axios.post(`/users/${id}/assign-roles`, data),
  assignUserPermissions: (id, data) =>
    axios.post(`/users/${id}/assign-permissions`, data),
};

// Legacy API exports for backward compatibility
export const referenceAPI = {
  get: (endpoint, params) => axios.get(endpoint, { params }),
  // Region Groups (Categories)
  getRegionGroups: (params) => axios.get("/region/admin/category", { params }),
  createRegionGroup: (data) =>
    axios.post("/region/category", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateRegionGroup: (id, data) =>
    axios.patch(`/region/category/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteRegionGroup: (id) => axios.delete(`/region/category/${id}`),

  // Regions
  getRegions: (params) => axios.get(`/region/admin`, { params }),
  createRegion: (data) =>
    axios.post("/region", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateRegion: (id, data) =>
    axios.patch(`/region/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteRegion: (id) => axios.delete(`/region/${id}`),
  getRegionById: (id) => axios.get(`/region/${id}`),

  // Clients
  getClients: () => axios.get("/clients"),
  createClient: (data) =>
    axios.post("/clients", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateClient: (id, data) =>
    axios.put(`/clients/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteClient: (id) => axios.delete(`/clients/${id}`),
  getClientById: (id) => axios.get(`/clients/${id}`),

  // Client Statuses
  getClientStatuses: () => axios.get("/client-statuses"),
  createClientStatus: (data) => axios.post("/client-statuses", data),
  updateClientStatus: (id, data) => axios.put(`/client-statuses/${id}`, data),
  deleteClientStatus: (id) => axios.delete(`/client-statuses/${id}`),

  // Products
  getProducts: () => axios.get("/products"),
  createProduct: (data) => axios.post("/products", data),
  updateProduct: (id, data) => axios.put(`/products/${id}`, data),
  deleteProduct: (id) => axios.delete(`/products/${id}`),
  getProductById: (id) => axios.get(`/products/${id}`),

  // Payment Types
  getPaymentTypes: () => axios.get("/payment-types"),
  createPaymentType: (data) => axios.post("/payment-types", data),
  updatePaymentType: (id, data) => axios.put(`/payment-types/${id}`, data),
  deletePaymentType: (id) => axios.delete(`/payment-types/${id}`),

  // Simcards
  getSimCards: () => axios.get("/simcards"),
  createSimCard: (data) => axios.post("/simcards", data),
  updateSimCard: (id, data) => axios.put(`/simcards/${id}`, data),
  deleteSimCard: (id) => axios.delete(`/simcards/${id}`),

  // Tariffs
  getTariffs: (params) => axios.get("/tariff/admin", { params }),
  createTariff: (data) => axios.post("/tariff", data),
  updateTariff: (id, data) => axios.patch(`/tariff/${id}`, data),
  deleteTariff: (id) => axios.delete(`/tariff/${id}`),

  // Partners
  getPartners: (params) => axios.get("/partner", { params }),
  createPartner: (data) => axios.post("/partner", data),
  updatePartner: (id, data) => axios.patch(`/partner/${id}`, data),
  deletePartner: (id) => axios.delete(`/partner/${id}`),
};
