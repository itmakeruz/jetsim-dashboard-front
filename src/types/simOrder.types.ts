// SimOrder types
export const PAYMENT_TYPES = {
  SINGLE: "single",
  DOUBLE: "double",
};

export const SIM_CARD_STATUSES = {
  AVAILABLE: "available",
  INACTIVE: "inactive",
};

export const SIM_CARD_TYPES = {
  ESIM: "esim",
  PHYSICAL: "physical_sim",
  INTEGRATION: "integration",
};

// Form data structure
export const INITIAL_FORM_DATA = {
  fio: "",
  phone: "+998",
  passport: null,
  ticket: null,
  discount: "",
  invoice: {
    type: "",
    phone: "",
  },
};

// Payment structure
export const INITIAL_PAYMENT = {
  payment_type_id: null,
  amount: "",
};

// SimCard structure
export const INITIAL_SIM_CARD = {
  id: null,
  ssid: "",
  type: "",
  status: "",
  price: 0,
};
