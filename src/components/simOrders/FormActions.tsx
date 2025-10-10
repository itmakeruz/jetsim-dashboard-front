export default function FormActions({
  selectedPlan,
  selectedSimCards,
  calculateTotal,
  createSimOrderMutation,
  discountAmount,
}) {
  if (!selectedPlan) return null;

  // Calculate base total: if no ICCIDs selected, charge for 1 SIM card, otherwise charge for selected ICCIDs
  const simCardCount =
    selectedSimCards.length > 0 ? selectedSimCards.length : 1;
  const baseTotal = selectedPlan.price_sell * simCardCount;
  const discount = Number(discountAmount) || 0;

  return (
    <div className="flex justify-end items-center">
      <div className="mr-4 text-right">
        <div className="text-sm text-gray-600 mb-1">
          {selectedPlan.price_sell.toLocaleString()} UZS × {simCardCount}{" "}
          {selectedSimCards.length > 0 ? "ICCID" : "sim karta"}
        </div>
        {discount > 0 && (
          <div className="text-sm text-green-600 mb-1">
            Скидка: -{discount.toLocaleString()} UZS
          </div>
        )}
        <div className="font-medium text-lg">
          Итого: {calculateTotal().toLocaleString()} UZS
        </div>
      </div>
      <button
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        type="submit"
        disabled={createSimOrderMutation.isPending}
      >
        {createSimOrderMutation.isPending ? "Сохранение..." : "Сохранить"}
      </button>
    </div>
  );
}
