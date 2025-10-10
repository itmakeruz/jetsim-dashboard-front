import { useState } from "react";
import { getImageUrl } from "@/utils/imageUtils";
import { ChevronDown, Loader2 } from "lucide-react";
import UniversalModal from "@/components/modals/UniversalModal";
import UniversalBtn from "@/components/buttons/UniversalBtn";

export default function RegionGroupSelector({
  selectedRegionGroup,
  setSelectedRegionGroup,
  regionGroups,
  isRegionGroupsLoading,
}) {
  const [isRegionsModalOpen, setIsRegionsModalOpen] = useState(false);
  const groups = regionGroups?.data || [];
  const selectedGroupObj = groups.find(
    (g) => String(g.id) === String(selectedRegionGroup)
  );

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Регион группы
      </label>
      <div className="flex items-center w-full gap-4 justify-between mb-3">
        <div className="relative w-full">
          <select
            className="w-full appearance-none border border-gray-300 rounded px-3 py-2 pr-8 focus:outline-none focus:ring-0 focus:ring-transparent"
            value={selectedRegionGroup}
            onChange={(e) => setSelectedRegionGroup(e.target.value)}
          >
            {isRegionGroupsLoading ? (
              <option value="">Loading...</option>
            ) : (
              <option value="">Выберите регион группы</option>
            )}
            {regionGroups?.data
              ?.sort((a, b) => a.name.localeCompare(b.name))
              ?.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
        <UniversalBtn
          type="button"
          className={`!bg-[rgb(116,120,141,10%)] !text-main-grey whitespace-nowrap ${
            !selectedGroupObj?.regions?.length && "!cursor-not-allowed"
          }`}
          onClick={() => setIsRegionsModalOpen(true)}
          disabled={!selectedGroupObj?.regions?.length}
        >
          Доступные страны
        </UniversalBtn>
      </div>

      <UniversalModal
        title={
          selectedGroupObj ? `Регионы: ${selectedGroupObj.name}` : "Регионы"
        }
        isShow={isRegionsModalOpen}
        onClose={() => setIsRegionsModalOpen(false)}
        onSubmit={() => setIsRegionsModalOpen(false)}
        isButtonsDisabled={true}
        width="min-w-[650px]"
      >
        <div className="max-h-[65vh] overflow-y-auto">
          {selectedGroupObj?.regions?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              {selectedGroupObj.regions.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 border border-gray-200 rounded px-3 py-2 text-sm"
                  title={r.name}
                >
                  {r?.img ? (
                    <img
                      src={getImageUrl(r.img)}
                      alt={r.name}
                      className="w-8 h-8 rounded object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded bg-gray-100 inline-block" />
                  )}
                  <span className="truncate">{r.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-600">
              Нет регионов для отображения
            </div>
          )}
        </div>
      </UniversalModal>
    </div>
  );
}
