import React, { useMemo, useState } from "react";
import CustomInput from "@/components/formElements/CustomInput";
import { getImageUrl } from "@/utils/imageUtils";
import { handleChange } from '@/utils/handleChange';
import MultiSelect from "@/components/formElements/MultiSelect";
import { referenceAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
function RegionsGroupForm({ formData, setFormData, editData }) {
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch region categories
  const { data: regionsResponse, isLoading: isRegionsLoading } = useQuery({
    queryKey: ["regions"],
    queryFn: () => referenceAPI.getRegions({}),
  });
  const regions = regionsResponse?.data?.data || [];


  // Transform categories for MultiSelect
  const categoryOptions = useMemo(() => {
    return regions.map((r: any) => ({
      id: r.id,
      label: r.name_ru || r.name_en || `Category ${r.id}`,
      name: r.name_ru || r.name_en || `Category ${r.id}`,
    }));
  }, [regions]);

  // Get selected categories for MultiSelect
  const selectedRegions = useMemo(() => {
    if (!formData?.regions || formData.regions.length === 0) {
      return [];
    }
    // Filter options to get only selected ones by ID
    return categoryOptions.filter((option: any) =>
      formData.regions.includes(option.id)
    );
  }, [formData?.regions, categoryOptions]);

  const handleCategoryChange = (e: any) => {
    // e.target.value contains array of selected category objects
    const selectedItems = e.target.value || [];
    // Extract only IDs to store in formData
    const categoryIds = selectedItems.map((item: any) => item.id);
    setFormData((prev: any) => ({ ...prev, region_category: categoryIds }));
  };
  return (
    <>
      <CustomInput
        onChange={handleChange(setFormData)}
        className="max-w-[320px]"
        label="Название (RU)"
        placeholder="Название на русском"
        name="name_ru"
        value={formData?.name_ru ?? editData?.name_ru ?? ""}
        required
      />
      <CustomInput
        onChange={handleChange(setFormData)}
        className="max-w-[320px]"
        label="Название (EN)"
        placeholder="Название на английском"
        name="name_en"
        value={formData?.name_en ?? editData?.name_en ?? ""}
        required
      />
      <CustomInput
        onChange={handleChange(setFormData, setPreviewImage)}
        className="max-w-[320px]"
        label="Иконка"
        placeholder="Выберите иконку"
        name="icon"
        type="file"
        accept="image/*"
        required={!editData}
      />
      <MultiSelect
        label="Регионы"
        name="regions"
        value={selectedRegions}
        options={categoryOptions}
        onChange={handleCategoryChange}
        placeholder="Выберите регионы..."
        className="w-full max-w-[320px]"
        isLoading={isRegionsLoading}
        searchable={true}
        isError={false}
        setIsError={() => { }}
        enableBackendSearch={false}
        divClassname="flex justify-between items-center"
      />
      {(previewImage || editData?.icon) && (
        <div className="mt-2 ml-auto">
          <img
            className="w-12 h-12 object-cover rounded-lg border border-gray-300"
            src={
              previewImage ||
              (editData?.icon ? getImageUrl(editData.icon) : null)
            }
            alt="Region group icon"
          />
        </div>
      )}
    </>
  );
}

export default RegionsGroupForm;
