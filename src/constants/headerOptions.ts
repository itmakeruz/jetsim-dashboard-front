const selectConfigs = {
  "/": [
    { id: 1, name: "Склад 1" },
    { id: 2, name: "Склад 2" },
  ],
  "/products": [
    { id: "1", name: "Товар 1" },
    { id: "2", name: "Товар 2" },
  ],
  // Warehouse pages will now use user's branches from getMe response
  // These are kept as fallback options
  "/warehouse/purchase": [],
  "/warehouse/arrival": [],
  "/warehouse/transfer": [],
  "/warehouse/writeOff": [],
  "/warehouse/revaluation": [],
  "/warehouse/inventory": [],
};

export default selectConfigs;
