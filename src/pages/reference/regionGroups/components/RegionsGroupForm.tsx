import React, { useMemo, useState } from "react";
import CustomInput from "@/components/formElements/CustomInput";
import { handleChange } from "@/utils/handleChange";
import MultiSelect from "@/components/formElements/MultiSelect";
import { referenceAPI } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import FormImgView from "@/components/FormImgView";
import CustomSelect from "@/components/formElements/CustomSelect";
import { statusOptions } from "@/constants/StaticOptions";
function RegionsGroupForm({ formData, setFormData, editData }) {
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch region categories
  const { data: regionsResponse, isLoading: isRegionsLoading } = useQuery({
    queryKey: ["regions"],
    queryFn: () => referenceAPI.getRegions(""),
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
      formData.regions.map((region: any) => region.id).includes(option.id)
    );
  }, [formData?.regions, categoryOptions]);

  const handleCategoryChange = (e: any) => {
    const selectedItems = e.target.value || [];
    const regionIds = selectedItems.map((item: any) => item.id);
    setFormData((prev: any) => ({ ...prev, region_ids: regionIds }));
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
        label="Изображение"
        placeholder="Выберите иконку"
        name="image"
        type="file"
        accept="image/*"
        required={!editData}
      />{" "}
      <CustomSelect
        onChange={handleChange(setFormData)}
        className="max-w-[320px] w-full"
        label="Статус"
        placeholder="Статус"
        name="status"
        value={formData?.status ?? ""}
        options={statusOptions}
      />
      <MultiSelect
        label="Регионы"
        name="region_ids"
        value={selectedRegions}
        options={categoryOptions}
        onChange={handleCategoryChange}
        placeholder="Выберите регионы..."
        className="w-full max-w-[320px]"
        isLoading={isRegionsLoading}
        searchable={true}
        enableBackendSearch={true}
        divClassname="flex justify-between items-center"
        searchEndpoint="/region/admin"
        searchParam="search"
        searchDelay={500}
      />
      {(previewImage || editData?.icon) && (
        <FormImgView
          previewImage={previewImage}
          formData={formData}
          editData={editData}
          alt="Region group flag"
        />
      )}
    </>
  );
}

export default RegionsGroupForm;
