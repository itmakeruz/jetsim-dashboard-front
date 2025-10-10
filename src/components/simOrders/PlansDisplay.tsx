import { useAuthStore } from "@/store/authStore";
import { hasRole } from "@/utils/sidebarFilter";
import { Loader2 } from "lucide-react";

export default function PlansDisplay({
  selectedRegionGroup,
  plans,
  isPlansLoading,
  selectedPlan,
  setSelectedPlan,
  selectedSimCards,
}) {
  const { user } = useAuthStore();

  if (!selectedRegionGroup) return null;

  const isTuragent = hasRole(user, "Turagent");
  const filteredPlans = plans?.data?.data?.filter(
    (plan) =>
      plan?.type_id == 1 && (isTuragent ? plan?.b2b == 1 : plan?.b2b != 1)
  );

  return (
    <>
      {isPlansLoading && (
        <div className="flex justify-start items-center">
          <Loader2 className="h-4 w-4 text-gray-500 animate-spin mb-4" />
        </div>
      )}

      {filteredPlans && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2 mb-4">
          {filteredPlans?.map((plan) => (
            <button
              key={plan.id}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedPlan?.id === plan.id
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-orange-300 hover:bg-orange-50"
              }`}
              onClick={() => setSelectedPlan(plan)}
              type="button"
            >
              <div className="flex flex-col space-y-1">
                <div className="font-medium text-base">{plan.name}</div>
                <div className="text-sm opacity-90">
                  {plan.quantity_internet} GB • {plan.expiry_day} дней
                </div>
                <div className="font-semibold text-lg">
                  {plan.price_sell.toLocaleString()} UZS
                </div>
                <div className="text-xs opacity-75 mt-1">
                  Итого:{" "}
                  {(
                    plan.price_sell *
                    (selectedSimCards.length > 0 ? selectedSimCards.length : 1)
                  ).toLocaleString()}{" "}
                  UZS
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      {filteredPlans?.length === 0 && (
        <div className="text-center text-gray-500">
          <p>Тарифы недоступны.</p>
        </div>
      )}
    </>
  );
}
