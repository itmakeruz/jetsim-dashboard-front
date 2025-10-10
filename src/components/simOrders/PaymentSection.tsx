import { useState, useEffect, useRef } from "react";
import MaskedPhoneInput from "@/components/formElements/MaskedPhoneInput";
import formatNumber from "@/utils/formatNumber";
import { useAuthStore } from "@/store/authStore";
import { hasRole } from "@/utils/sidebarFilter";
import { convertToE164 } from "@/utils/phoneNumberFormatter";

export default function PaymentSection({
  selectedPlan,
  selectedSimCards,
  doublePayment,
  setDoublePayment,
  useCashback,
  setUseCashback,
  payments,
  setPayments,
  paymentTypes,
  calculateTotal,
  calculatePaymentsTotal,
  formData,
  setFormData,
  clientFound,
  foundClientData,
}) {
  const [cashUSD, setCashUSD] = useState("");
  const { user } = useAuthStore();
  const prevPaymentsRef = useRef(JSON.stringify(payments));

  // Calculate cashback amount
  const cashbackAmount = foundClientData?.balance
    ? Number(foundClientData.balance)
    : 0;
  const totalAmount = calculateTotal();
  const requiredAmount = totalAmount; // Amount that needs to be paid
  const maxCashbackToUse = Math.min(cashbackAmount, requiredAmount); // Don't use more than needed
  const finalAmount = useCashback
    ? Math.max(0, totalAmount - maxCashbackToUse)
    : totalAmount;

  // State for manual cashback input
  const [manualCashbackAmount, setManualCashbackAmount] = useState("");

  // Update invoice phone when Click/Payme is selected (only when payment method changes)
  useEffect(() => {
    const currentPaymentsString = JSON.stringify(payments);

    // Only run if payments actually changed
    if (prevPaymentsRef.current === currentPaymentsString) {
      return;
    }

    prevPaymentsRef.current = currentPaymentsString;

    const hasClickOrPayme = payments.some((p) => {
      const paymentType = paymentTypes.find(
        (pt) => pt.id === p.payment_type_id
      );
      return paymentType?.key === "click" || paymentType?.key === "payme";
    });

    if (hasClickOrPayme) {
      // Always pre-fill invoice phone with main form phone when Click/Payme is selected
      setFormData((prev) => ({
        ...prev,
        invoice: {
          ...prev.invoice,
          phone: convertToE164(prev.phone) || "+998",
        },
      }));
    } else {
      // Clear invoice phone when Click/Payme is not selected
      setFormData((prev) => ({
        ...prev,
        invoice: {
          ...prev.invoice,
          phone: "",
        },
      }));
    }
  }, [payments, paymentTypes]);

  // Update payment amounts when cashback changes
  useEffect(() => {
    if (selectedPlan && payments.length > 0) {
      // Calculate base total: if no ICCIDs selected, charge for 1 SIM card, otherwise charge for selected ICCIDs
      const simCardCount =
        selectedSimCards.length > 0 ? selectedSimCards.length : 1;
      const baseTotal = selectedPlan.price_sell * simCardCount;
      const discount = Number(formData.discount) || 0;
      const totalAmount = Math.max(0, baseTotal - discount);
      const cashbackToUse = manualCashbackAmount
        ? Number(manualCashbackAmount)
        : maxCashbackToUse;
      const finalAmount = useCashback
        ? Math.max(0, totalAmount - cashbackToUse)
        : totalAmount;

      if (!doublePayment) {
        // Single payment - update first payment amount
        setPayments(
          payments.map((payment, index) =>
            index === 0
              ? { ...payment, amount: finalAmount.toString() }
              : payment
          )
        );
      } else if (payments.length === 2) {
        // Double payment - update second payment amount
        const firstPaymentAmount = Number(payments[0]?.amount) || 0;
        const secondPaymentAmount = Math.max(
          0,
          finalAmount - firstPaymentAmount
        );

        setPayments(
          payments.map((payment, index) => {
            if (index === 1) {
              return { ...payment, amount: secondPaymentAmount.toString() };
            }
            return payment;
          })
        );
      }
    }
  }, [
    useCashback,
    cashbackAmount,
    manualCashbackAmount,
    selectedPlan,
    selectedSimCards,
    formData.discount,
    payments.length,
    doublePayment,
  ]);

  const handlePaymentMethodToggle = (method) => {
    const id = method.id;
    const exists = payments.find((p) => p.payment_type_id === id);
    const maxAllowed = doublePayment ? 2 : 1;

    if (!exists && payments.length >= maxAllowed) {
      return;
    }

    if (exists) {
      setPayments(payments.filter((p) => p.payment_type_id !== id));
    } else {
      const newPayment = { payment_type_id: id, amount: "" };
      const updatedPayments = [...payments, newPayment];
      setPayments(updatedPayments);

      if (selectedPlan) {
        // Calculate base total: if no ICCIDs selected, charge for 1 SIM card, otherwise charge for selected ICCIDs
        const simCardCount =
          selectedSimCards.length > 0 ? selectedSimCards.length : 1;
        const baseTotal = selectedPlan.price_sell * simCardCount;
        const discount = Number(formData.discount) || 0;
        const totalAmount = Math.max(0, baseTotal - discount);
        const cashbackToUse = manualCashbackAmount
          ? Number(manualCashbackAmount)
          : maxCashbackToUse;
        const finalAmount = useCashback
          ? Math.max(0, totalAmount - cashbackToUse)
          : totalAmount;

        if (!doublePayment) {
          setPayments(
            updatedPayments.map((payment, index) =>
              index === 0
                ? { ...payment, amount: finalAmount.toString() }
                : payment
            )
          );
        } else if (updatedPayments.length === 2) {
          setPayments(
            updatedPayments.map((payment, index) => {
              if (index === 0) {
                return { ...payment, amount: "" };
              } else if (index === 1) {
                return { ...payment, amount: finalAmount.toString() };
              }
              return payment;
            })
          );
        }
      }
    }
  };

  const handlePaymentAmountChange = (id, value) => {
    setPayments((prev) => {
      const exists = prev.find((p) => p.payment_type_id === id);
      if (exists) {
        const updatedPayments = prev.map((p) =>
          p.payment_type_id === id ? { ...p, amount: value } : p
        );

        if (doublePayment && updatedPayments.length >= 2 && selectedPlan) {
          // Calculate base total: if no ICCIDs selected, charge for 1 SIM card, otherwise charge for selected ICCIDs
          const simCardCount =
            selectedSimCards.length > 0 ? selectedSimCards.length : 1;
          const baseTotal = selectedPlan.price_sell * simCardCount;
          const discount = Number(formData.discount) || 0;
          const totalAmount = Math.max(0, baseTotal - discount);
          const cashbackToUse = manualCashbackAmount
            ? Number(manualCashbackAmount)
            : maxCashbackToUse;
          const finalAmount = useCashback
            ? Math.max(0, totalAmount - cashbackToUse)
            : totalAmount;
          const firstPaymentAmount = Number(value) || 0;
          const secondPaymentAmount = Math.max(
            0,
            finalAmount - firstPaymentAmount
          );

          return updatedPayments.map((payment, index) => {
            if (index === 1) {
              return { ...payment, amount: secondPaymentAmount.toString() };
            }
            return payment;
          });
        }

        return updatedPayments;
      } else {
        return [...prev, { payment_type_id: id, amount: value }];
      }
    });
  };

  // Handle manual cashback amount change
  const handleManualCashbackChange = (e) => {
    const value = e.target.value;
    const numValue = Number(value);

    if (value === "" || (numValue >= 0 && numValue <= cashbackAmount)) {
      setManualCashbackAmount(value);
    }
  };

  // Handle invoice phone change
  const handleInvoicePhoneChange = (e) => {
    const value = e.target.value;
    // Prevent complete deletion - ensure at least "+998" remains
    const minValue = "+998";

    setFormData((prev) => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        phone: value.length < minValue.length ? minValue : value,
      },
    }));
  };

  // Calculate the actual cashback amount being used
  const actualCashbackUsed = manualCashbackAmount
    ? Number(manualCashbackAmount)
    : maxCashbackToUse;

  if (!selectedPlan) {
    return (
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            To'lov qismini ko'rish uchun avval:
          </p>
          <div className="space-y-1 text-xs text-gray-500">
            {!selectedPlan && <p>• Plan tanlang</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Double Payment Toggle */}
      {!hasRole(user, "Turagent") && (
        <>
          <div className="flex items-center mb-4">
            <label className="block text-sm font-medium text-gray-700 mr-4">
              Двойная оплата:
            </label>
            <label className="flex items-center mr-4">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-orange-500"
                checked={!doublePayment}
                onChange={() => setDoublePayment(false)}
              />
              <span className="ml-2 text-sm text-gray-700">Нет</span>
            </label>
            <label className="flex items-center mr-8">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-orange-500"
                checked={doublePayment}
                onChange={() => setDoublePayment(true)}
              />
              <span className="ml-2 text-sm text-gray-700">Да</span>
            </label>

            {/* Cashback Toggle */}
            <label className="block text-sm font-medium text-gray-700 mr-4">
              Использовать кешбек: {formatNumber(cashbackAmount)} UZS
            </label>
            <label className="flex items-center mr-4">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-orange-500"
                checked={!useCashback}
                onChange={() => setUseCashback(false)}
              />
              <span className="ml-2 text-sm text-gray-700">Нет</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-orange-500"
                checked={useCashback}
                onChange={() => setUseCashback(true)}
              />
              <span className="ml-2 text-sm text-gray-700">Да</span>
            </label>
          </div>

          {/* Manual Cashback Input */}
          {useCashback &&
            clientFound &&
            foundClientData &&
            cashbackAmount > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Сумма кешбека для использования:
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="0"
                    max={cashbackAmount}
                    step="1000"
                    placeholder={`Максимум: ${formatNumber(
                      cashbackAmount
                    )} UZS`}
                    className="border border-gray-300 rounded px-3 py-2 w-48 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                    value={manualCashbackAmount}
                    onChange={handleManualCashbackChange}
                  />
                  <span className="text-sm text-gray-600">
                    (Автоматически: {formatNumber(maxCashbackToUse)} UZS)
                  </span>
                </div>
              </div>
            )}
        </>
      )}

      {/* Payment Methods */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Способы оплаты:
        </label>
        <div className="flex flex-wrap gap-4">
          {paymentTypes.map((method) => {
            const isSelected = !!payments.find(
              (p) => p.payment_type_id === method.id
            );
            const isDisabled =
              !isSelected && payments.length >= (doublePayment ? 2 : 1);

            return (
              <label key={method.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handlePaymentMethodToggle(method)}
                  disabled={isDisabled}
                />
                <span className="text-sm">{method.name}</span>
                {isSelected && (
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Сумма"
                    className="ml-2 border rounded px-2 py-1 w-32 text-sm"
                    value={
                      payments.find((p) => p.payment_type_id === method.id)
                        ?.amount || ""
                    }
                    onChange={(e) =>
                      handlePaymentAmountChange(method.id, e.target.value)
                    }
                  />
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* Payment Summary */}
      {payments.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Выбранные способы оплаты:
          </h4>
          <div className="space-y-2">
            {payments.map((payment, i) => {
              const paymentType = paymentTypes.find(
                (pt) => pt.id === payment.payment_type_id
              );
              return (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm">{paymentType?.name}</span>
                  <span className="text-sm font-medium">
                    {Number(payment.amount || 0).toLocaleString()} UZS
                  </span>
                </div>
              );
            })}
            <div className="border-t pt-2 flex justify-between items-center font-medium">
              <span>Итого оплата:</span>
              <span>{calculatePaymentsTotal().toLocaleString()} UZS</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>ICCID lar soni:</span>
              <span>
                {selectedSimCards.length > 0 ? selectedSimCards.length : 1} ta
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Общая стоимость:</span>
              <span>
                {(
                  selectedPlan.price_sell *
                  (selectedSimCards.length > 0 ? selectedSimCards.length : 1)
                ).toLocaleString()}{" "}
                UZS
              </span>
            </div>
            {Number(formData.discount) > 0 && (
              <div className="flex justify-between items-center text-sm text-green-600">
                <span>Скидка:</span>
                <span>-{Number(formData.discount).toLocaleString()} UZS</span>
              </div>
            )}
            {useCashback && cashbackAmount > 0 && (
              <div className="flex justify-between items-center text-sm text-blue-600">
                <span>Кешбек:</span>
                <span>-{actualCashbackUsed.toLocaleString()} UZS</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm font-medium text-blue-600">
              <span>Jami to'lov:</span>
              <span>{finalAmount.toLocaleString()} UZS</span>
            </div>
          </div>
        </div>
      )}

      {/* Conditional Payment Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {payments.some((p) => {
          const paymentType = paymentTypes.find(
            (pt) => pt.id === p.payment_type_id
          );
          return paymentType?.key === "click" || paymentType?.key === "payme";
        }) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Телефон Click/Payme
            </label>
            <MaskedPhoneInput
              name="invoicePhone"
              value={formData.invoice.phone}
              onChange={handleInvoicePhoneChange}
              placeholder="+998 __ ___ __ __"
              className={`!outline-none ring-0`}
            />
          </div>
        )}

        {payments.some((p) => {
          const paymentType = paymentTypes.find(
            (pt) => pt.id === p.payment_type_id
          );
          return paymentType?.key === "Cash USD";
        }) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Наличные USD
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-0 focus:ring-transparent"
              value={cashUSD}
              onChange={(e) => setCashUSD(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
