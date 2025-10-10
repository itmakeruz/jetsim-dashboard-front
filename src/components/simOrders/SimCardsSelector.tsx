import MultiSelect from "@/components/formElements/MultiSelect";

export default function SimCardsSelector({
  selectedSimCards,
  simcardsData,
  simcardsLoading,
  handleSimCardsChange,
}) {
  return (
    <div className="mb-6">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          ICCID (Ixtiyoriy)
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Agar ICCID tanlamasangiz, 1 ta sim karta narxida hisoblanadi
        </p>
      </div>
      <MultiSelect
        name="simCards"
        value={selectedSimCards}
        options={simcardsData?.data || []}
        onChange={handleSimCardsChange}
        placeholder="ICCID tanlang yoki bo'sh qoldiring..."
        isLoading={simcardsLoading}
        searchable={true}
        className="mt-2"
        // Enable backend search
        enableBackendSearch={true}
        searchEndpoint="/simcards"
        searchParam="ssid"
        searchDelay={500}
      />
    </div>
  );
}
