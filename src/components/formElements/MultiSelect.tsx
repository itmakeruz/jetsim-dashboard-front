import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import CustomLabel from "./CustomLabel";
import { useApi } from "@/hooks/useApi";

const MultiSelect = ({
  value = [],
  options = [],
  placeholder = "Tanlang...",
  onChange,
  className = "",
  divClassname = "",
  required = false,
  isError,
  setIsError,
  label,
  name,
  isLoading = false,
  searchable = true,
  // New props for backend search
  searchEndpoint = null,
  searchParam = "ssid",
  searchDelay = 500,
  enableBackendSearch = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState(value);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Backend search functionality
  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = useApi({
    endpoint:
      enableBackendSearch && debouncedSearchTerm.trim() && searchEndpoint
        ? `${searchEndpoint}?${searchParam}=${debouncedSearchTerm.trim()}`
        : null,
    method: "GET",
    enabled:
      enableBackendSearch && !!debouncedSearchTerm.trim() && !!searchEndpoint,
  });

  // Debounce search term for backend API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, searchDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, searchDelay]);

  useEffect(() => {
    setSelectedItems(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine which options to show based on search mode
  const getDisplayOptions = useCallback(() => {
    if (enableBackendSearch && debouncedSearchTerm.trim()) {
      if (searchError) {
        // Show error state - return empty array
        return [];
      }
      if (searchResults?.data) {
        // Use backend search results
        return searchResults.data;
      }
      // Still loading or no results yet
      return [];
    } else if (enableBackendSearch && !debouncedSearchTerm.trim()) {
      // Show initial options when no search term for backend mode
      return options;
    } else {
      // Use static filtering when backend search is disabled
      return options.filter(
        (option) =>
          option.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          option.ssid?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }, [
    enableBackendSearch,
    debouncedSearchTerm,
    searchResults,
    searchError,
    options,
    searchTerm,
  ]);

  const filteredOptions = getDisplayOptions();

  const handleToggleItem = (item) => {
    const isSelected = selectedItems.some(
      (selected) => selected.id === item.id || selected.ssid === item.ssid
    );

    let newSelectedItems;
    if (isSelected) {
      newSelectedItems = selectedItems.filter(
        (selected) => selected.id !== item.id && selected.ssid !== item.ssid
      );
    } else {
      newSelectedItems = [...selectedItems, item];
    }

    setSelectedItems(newSelectedItems);
    onChange({ target: { name, value: newSelectedItems } });

    if (setIsError) {
      setIsError(false);
    }
  };

  const handleRemoveItem = (itemToRemove) => {
    const newSelectedItems = selectedItems.filter(
      (item) => item.id !== itemToRemove.id && item.ssid !== itemToRemove.ssid
    );
    setSelectedItems(newSelectedItems);
    onChange({ target: { name, value: newSelectedItems } });
  };

  const getDisplayValue = () => {
    if (selectedItems.length === 0) return placeholder;
    if (selectedItems.length === 1) {
      const item = selectedItems[0];
      return item.label || item.name || item.ssid || "Tanlangan";
    }
    return `${selectedItems.length} ta tanlangan`;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`${divClassname}`}>
      {label && <CustomLabel labelText={label} />}
      <div className="relative" ref={dropdownRef}>
        <div
          className={`${className} min-h-[42px] border border-gray-300 rounded px-3 py-2 cursor-pointer flex items-center justify-between ${
            required && isError ? "border-red-500" : ""
          } ${selectedItems.length > 0 ? "bg-white" : "bg-gray-50"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap gap-1 flex-1 min-w-0">
            {selectedItems.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              selectedItems.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full"
                >
                  <span className="truncate max-w-[120px]">
                    {item.label || item.name || item.ssid}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(item);
                    }}
                    className="hover:bg-orange-200 rounded-full p-0.5"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))
            )}
          </div>
          <ChevronDown
            size={16}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder={
                      enableBackendSearch
                        ? "ICCID bo'yicha qidirish..."
                        : "Qidirish..."
                    }
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            <div className="max-h-48 overflow-y-auto">
              {isLoading || isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  Yuklanmoqda...
                </div>
              ) : searchError &&
                enableBackendSearch &&
                debouncedSearchTerm.trim() ? (
                <div className="p-4 text-center text-red-500">
                  Qidirishda xatolik yuz berdi. Qaytadan urinib ko'ring.
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {enableBackendSearch && debouncedSearchTerm.trim()
                    ? "Natija topilmadi"
                    : "Natija topilmadi"}
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = selectedItems.some(
                    (selected) =>
                      selected.id === option.id || selected.ssid === option.ssid
                  );
                  return (
                    <div
                      key={index}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2 ${
                        isSelected ? "bg-orange-50" : ""
                      }`}
                      onClick={() => handleToggleItem(option)}
                    >
                      <div
                        className={`w-4 h-4 border-2 rounded ${
                          isSelected
                            ? "bg-orange-500 border-orange-500"
                            : "border-gray-300"
                        } flex items-center justify-center`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-sm"></div>
                        )}
                      </div>
                      <span className="flex-1">
                        {option.label || option.name || option.ssid}
                      </span>
                      {option.status && (
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            option.status === "available"
                              ? "bg-green-100 text-green-800"
                              : option.status === "inactive"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {option.status === "available"
                            ? "Mavjud"
                            : option.status === "inactive"
                            ? "Faol emas"
                            : option.status}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
