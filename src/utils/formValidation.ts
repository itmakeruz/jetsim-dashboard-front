import { showToast } from "./toastHelper";

export const validateSimOrderForm = (
  formData,
  selectedPlan,
  selectedSimCards,
  payments,
  discountAmount,
  useCashback = false,
  cashbackAmount = 0
) => {
  // Plan validation
  if (!selectedPlan) {
    showToast.error("Пожалуйста, выберите план!");
    return false;
  }

  // Phone validation
  if (!formData.phone) {
    showToast.error("Пожалуйста, заполните телефон!");
    return false;
  }

  // FIO validation
  if (!formData.fio) {
    showToast.error("Пожалуйста, заполните ФИО!");
    return false;
  }

  // Passport validation
  if (!formData.passport) {
    showToast.error("Пожалуйста, загрузите паспорт!");
    return false;
  }

  // SIM cards validation - now optional, will charge for 1 SIM card if none selected
  // if (selectedSimCards.length === 0) {
  //   showToast.error("Пожалуйста, добавьте хотя бы один ICCID!");
  //   return false;
  // }

  // Discount validation
  const discount = Number(discountAmount) || 0;
  const simCardCount =
    selectedSimCards.length > 0 ? selectedSimCards.length : 1;
  const baseTotal = selectedPlan.price_sell * simCardCount;
  if (discount > baseTotal) {
    showToast.error("Скидка не может превышать общую стоимость!");
    return false;
  }

  // Payments validation
  if (payments.length === 0) {
    showToast.error("Пожалуйста, выберите способ оплаты!");
    return false;
  }

  // Payment amounts validation
  const totalAmount = payments.reduce((sum, payment) => {
    const amount = Number(payment.amount) || 0;
    return sum + amount;
  }, 0);

  // Calculate expected amount considering cashback
  const expectedAmount = Math.max(0, baseTotal - discount);
  const finalExpectedAmount = useCashback
    ? Math.max(0, expectedAmount - cashbackAmount)
    : expectedAmount;

  if (Math.abs(totalAmount - finalExpectedAmount) > 0.01) {
    let errorMessage = `Общая сумма оплаты должна быть ${finalExpectedAmount.toLocaleString()} UZS!`;

    if (discount > 0) {
      errorMessage += ` (с учетом скидки ${discount.toLocaleString()} UZS)`;
    }

    if (useCashback && cashbackAmount > 0) {
      errorMessage += ` (с учетом кешбека ${cashbackAmount.toLocaleString()} UZS)`;
    }

    showToast.error(errorMessage);
    return false;
  }

  return true;
};

export const validatePhoneNumber = (phone) => {
  return phone && phone.length >= 13;
};

export const validatePassport = (passport) => {
  return passport && (typeof passport === "string" || passport instanceof File);
};
