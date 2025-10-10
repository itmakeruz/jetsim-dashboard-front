import { useState, useEffect, useCallback } from "react";
import { useApi } from "./useApi";
import { showToast } from "@/utils/toastHelper";
import { simcardsAPI, clientsAPI } from "@/lib/api";
import { INITIAL_FORM_DATA } from "@/types/simOrder.types";
import { normalizePhoneForAPI } from "@/utils/phoneNumberFormatter";

export const useSimOrder = () => {
  // Form states
  const [selectedRegionGroup, setSelectedRegionGroup] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSimCards, setSelectedSimCards] = useState([]);
  const [doublePayment, setDoublePayment] = useState(false);
  const [useCashback, setUseCashback] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [payments, setPayments] = useState([]);

  // UI states
  const [isSearchingClient, setIsSearchingClient] = useState(false);
  const [clientFound, setClientFound] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);
  const [foundClientData, setFoundClientData] = useState(null);

  // API calls
  const { data: regionGroups = [], isPending: isRegionGroupsLoading } = useApi({
    endpoint: "/region-groups",
    method: "GET",
  });

  const { data: paymentTypesData = [] } = useApi({
    endpoint: "/payment-types",
    method: "GET",
  });

  const { data: simcardsData = { data: [] }, isLoading: simcardsLoading } =
    useApi({
      endpoint: "/simcards?per_page=100&status=available",
      method: "GET",
      enabled: true, // Enable loading initial data
    });

  const {
    data: plans = [],
    refetch: refetchPlans,
    isPending: isPlansLoading,
  } = useApi({
    endpoint: selectedRegionGroup
      ? `/plans?region_group_id=${selectedRegionGroup}`
      : null,
    method: "GET",
    enabled: !!selectedRegionGroup,
  });

  const createSimOrderMutation = useApi({
    endpoint: "/order-simcard/create",
    method: "POST",
    onSuccess: (e) => {
      showToast.success(e);
      resetForm();
    },
    onError: (e) => showToast.error(e),
  });

  // Effects
  useEffect(() => {
    if (selectedRegionGroup) {
      refetchPlans();
      setSelectedPlan(null);
    }
  }, [selectedRegionGroup, refetchPlans]);

  // Client search
  const searchClientByPhone = useCallback(async (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length < 13) return;

    setIsSearchingClient(true);
    try {
      const normalizedPhone = normalizePhoneForAPI(phoneNumber);
      const response = await clientsAPI.getClients({ search: normalizedPhone });
      const clients = response?.data?.data?.data || [];

      if (clients.length > 0) {
        const foundClient = clients[0];
        setFormData((prev) => ({
          ...prev,
          fio: foundClient.full_name || "",
          // phone: foundClient.phone || prev.phone,
          passport: foundClient.passport_image || null,
        }));
        setClientFound(true);
        setFoundClientData(foundClient);
        showToast.success("Mijoz topildi! FIO avtomatik to'ldirildi.");
      } else {
        setFormData((prev) => ({
          ...prev,
          fio: "",
          passport: null,
        }));
        setClientFound(false);
        setFoundClientData(null);
      }
    } catch (error) {
      console.error("Error searching for client:", error);
      showToast.error("Mijozni qidirishda xatolik yuz berdi!");
    } finally {
      setIsSearchingClient(false);
    }
  }, []);

  // Payment calculations
  const calculateTotal = useCallback(() => {
    if (!selectedPlan) return 0;
    // Calculate base total: if no ICCIDs selected, charge for 1 SIM card, otherwise charge for selected ICCIDs
    const simCardCount =
      selectedSimCards.length > 0 ? selectedSimCards.length : 1;
    const baseTotal = selectedPlan.price_sell * simCardCount;
    const discount = Number(formData.discount) || 0;
    return Math.max(0, baseTotal - discount);
  }, [selectedPlan, selectedSimCards, formData.discount]);

  const calculatePaymentsTotal = useCallback(() => {
    return payments.reduce((sum, payment) => {
      const amount = Number(payment.amount) || 0;
      return sum + amount;
    }, 0);
  }, [payments]);

  // Form reset
  const resetForm = useCallback(() => {
    setSelectedRegionGroup("");
    setSelectedPlan(null);
    setPayments([]);
    setSelectedSimCards([]);
    setDoublePayment(false);
    setUseCashback(false);
    setFormData(INITIAL_FORM_DATA);
    setClientFound(false);
    setFoundClientData(null);
    setIsSearchingClient(false);
    setShowPassportModal(false);

    // Force clear any file input references
    if (typeof window !== "undefined") {
      const passportInputs = document.querySelectorAll(
        'input[name="passport"]'
      );
      passportInputs.forEach((input) => {
        if (input.type === "file") {
          input.value = "";
        }
      });
    }
  }, []);

  return {
    // States
    selectedRegionGroup,
    setSelectedRegionGroup,
    selectedPlan,
    setSelectedPlan,
    selectedSimCards,
    setSelectedSimCards,
    doublePayment,
    setDoublePayment,
    useCashback,
    setUseCashback,
    formData,
    setFormData,
    payments,
    setPayments,
    isSearchingClient,
    clientFound,
    foundClientData,
    showPassportModal,
    setShowPassportModal,

    // API data
    regionGroups,
    isRegionGroupsLoading,
    paymentTypesData,
    simcardsData,
    simcardsLoading,
    plans,
    isPlansLoading,

    // Functions
    searchClientByPhone,
    calculateTotal,
    calculatePaymentsTotal,
    resetForm,
    createSimOrderMutation,
  };
};
