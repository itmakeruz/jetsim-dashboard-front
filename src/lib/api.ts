import axios from "./axios";

// Auth API - Exact match from api-data.json
export const authAPI = {
  login: (data) => axios.post("/auth/login", data),
  logout: () => axios.post("/logout"),
  getProfile: () => axios.get("/auth/me-staff"),
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

// Dashboard API - Using inventory stats as alternative since no specific dashboard endpoints found
export const dashboardAPI = {
  getStats: () => axios.get("/inventories/1/stats"),
  getChartData: (warehouseId) => axios.get(`/inventories/${warehouseId}/stats`),
  getTopProducts: (warehouseId) =>
    axios.get(`/inventories/${warehouseId}/products`),
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

// Legacy API exports for backward compatibility
export const referenceAPI = {
  get: (endpoint, params) => axios.get(endpoint, { params }),
  // Region Groups (Categories)
  getRegionGroups: (search: string | null, page: number = 1) => {
    const params: {
      search?: string | null;
      page?: number;
    } = {};

    if (search) params.search = search;
    if (page > 1) params.page = page;
    return axios.get("/region/admin/category", { params });
  },
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
  getRegions: (search: string | null, page: number = 1) => {
    const params: {
      search?: string | null;
      page?: number;
      size?: number;
    } = {};

    if (search) params.search = search;
    if (page > 1) params.page = page;
    return axios.get("/region/admin", { params });
  },
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

  // Tariffs
  getTariffs: (search: string | null, page: number = 1) => {
    const params: {
      search?: string | null;
      page?: number;
    } = {};

    if (search) params.search = search;
    if (page > 1) params.page = page;
    return axios.get("/tariff/admin", { params });
  },
  createTariff: (data) => axios.post("/tariff", data),
  updateTariff: (id, data) => axios.patch(`/tariff/${id}`, data),
  deleteTariff: (id) => axios.delete(`/tariff/${id}`),

  // Tariff Types
  getTariffTypes: (search: string | null, page: number = 1) => {
    const params: {
      search?: string | null;
      page?: number;
    } = {};

    if (search) params.search = search;
    if (page > 1) params.page = page;
    return axios.get("/tariff/type/admin", { params });
  },
  createTariffType: (data) => axios.post("/tariff/type", data),
  updateTariffType: (id, data) => axios.patch(`/tariff/type/${id}`, data),
  deleteTariffType: (id) => axios.delete(`/tariff/type/${id}`),

  // Partners
  getPartners: (params) => axios.get("/partner", { params }),
  createPartner: (data) => axios.post("/partner", data),
  updatePartner: (id, data) => axios.patch(`/partner/${id}`, data),
  deletePartner: (id) => axios.delete(`/partner/${id}`),
};
