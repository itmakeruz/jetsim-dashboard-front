"use client";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import { referenceAPI } from "@/lib/api";
import MultiSelect from "@/components/formElements/MultiSelect";
import Select from "react-select";
const getSelectOptions = (options, valueKey, labelKey) =>
  options
    ?.sort((a, b) => {
      const aName = a[labelKey] || "";
      const bName = b[labelKey] || "";
      return aName.localeCompare(bName);
    })
    .map((opt) => ({
      value: opt[valueKey],
      label: opt[labelKey],
    }));

const getSelectValue = (
  formData,
  name,
  isMulti = false,
  options,
  valueKey,
  labelKey
) => {
  const rawValue = formData?.[name];

  if (isMulti) {
    if (!rawValue || rawValue.length === 0) return [];

    return rawValue
      .map((val) => {
        if (typeof val === "object" && val !== null) {
          return {
            value: val[valueKey],
            label:
              val[labelKey] ||
              options.find((o) => o[valueKey] === val[valueKey])?.[labelKey],
          };
        }
        // Agar val faqat ID bo'lsa (create mode)
        const opt = options.find((o) => o[valueKey] === val);

        return opt ? { value: val, label: opt[labelKey] } : null;
      })
      .filter(Boolean);
  }

  if (!rawValue) return null;

  if (typeof rawValue === "object" && rawValue !== null) {
    return {
      value: rawValue[valueKey],
      label:
        rawValue[labelKey] ||
        options.find((o) => o[valueKey] === rawValue[valueKey])?.[labelKey],
    };
  }

  const opt = options.find((o) => o[valueKey] === rawValue);
  console.log(opt);

  return opt ? { value: rawValue, label: opt[labelKey] } : null;
};

export default function TariffsForm({
  editData = null,
  formData,
  setFormData,
}) {
  // GET partners for form
  const { data: partnersResponse } = useQuery({
    queryKey: ["partners"],
    queryFn: () => referenceAPI.getPartners({ page: 1 }),
    staleTime: Infinity,
  });
  const partners = partnersResponse?.data?.data || [];
  // GET regions for form
  const { data: regionsResponse } = useQuery({
    queryKey: ["regions"],
    queryFn: () => referenceAPI.getRegions({ page: 1 }),
    staleTime: Infinity,
  });
  const regions = regionsResponse?.data?.data || [];

  // Edit rejimida eski datalarni yuklash
  useEffect(() => {
    if (editData) {
      setFormData({ ...formData, ...editData });
    }
  }, [editData]);

  // Umumiy change handler
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Status options
  const statusOptions = [
    { id: "ACTIVE", name_ru: "Активный" },
    { id: "INACTIVE", name_ru: "Неактивный" },
  ];

  // Type options
  const typeOptions = [
    { id: "TURBO", name_ru: "Turbo" },
    { id: "STANDARD", name_ru: "Standard" },
    { id: "PREMIUM", name_ru: "Premium" },
  ];

  // Field konfiguratsiyasi
  const fields = [
    {
      label: "Название (RU)",
      name: "name_ru",
      typeElement: "input",
      isRequired: true,
    },
    {
      label: "Партнер",
      name: "partner_id",
      typeElement: "select",
      options: partners || [],
      valueKey: "id",
      labelKey: "name_ru",
      isRequired: true,
    },
    {
      label: "Количество SMS",
      name: "quantity_sms",
      typeElement: "input",
      type: "number",
    },
    {
      label: "Название (EN)",
      name: "name_en",
      typeElement: "input",
      isRequired: true,
    },
    {
      label: "Регионы",
      name: "region_ids",
      typeElement: "select",
      options: regions || [],
      valueKey: "id",
      labelKey: "name_ru",
      isMulti: true,
      isSearchable: true,
      isRequired: false,
    },
    {
      label: "Количество минут",
      name: "quantity_minute",
      typeElement: "input",
      type: "number",
    },
    {
      label: "Описание (RU)",
      name: "title_ru",
      typeElement: "input",
      isRequired: false,
    },
    {
      label: "Тип",
      name: "type",
      typeElement: "select",
      options: typeOptions,
      valueKey: "id",
      labelKey: "name_ru",
      isRequired: true,
    },
    {
      label: "Количество интернет (GB)",
      name: "quantity_internet",
      typeElement: "input",
      type: "number",
    },
    {
      label: "Описание (EN)",
      name: "title_en",
      typeElement: "input",
      isRequired: false,
    },
    {
      label: "Статус",
      name: "status",
      typeElement: "select",
      options: statusOptions,
      valueKey: "id",
      labelKey: "name_ru",
      isRequired: true,
    },
    {
      label: "Срок действия (дни)",
      name: "validity_period",
      typeElement: "input",
      type: "number",
    },
    {
      label: "Цена прихода",
      name: "price_arrival",
      typeElement: "input",
      type: "number",
      isRequired: true,
    },
    {
      label: "Цена продажи",
      name: "price_sell",
      typeElement: "input",
      type: "number",
      isRequired: true,
    },
    {
      label: "SKU ID",
      name: "sku_id",
      typeElement: "input",
      isRequired: true,
    },
    {
      label: "Кешбек (%)",
      name: "cashback_percent",
      typeElement: "input",
      type: "number",
    },
    {
      label: "4G",
      name: "is_4g",
      typeElement: "checkbox",
    },
    {
      label: "5G",
      name: "is_5g",
      typeElement: "checkbox",
    },
    {
      label: "Популярный",
      name: "is_popular",
      typeElement: "checkbox",
    },
  ];

  // Field renderer
  const renderField = (field) => {
    const {
      name,
      label,
      typeElement,
      options = [],
      valueKey,
      labelKey,
      isRequired,
      type,
      isLoading,
      isMulti,
      isSearchable,
    } = field;
    const value = formData[name] ?? "";

    if (typeElement === "input") {
      return (
        <Input
          value={value}
          className={`w-[250px] rounded-[4px]`}
          placeholder={label}
          onChange={(e) => handleChange(name, e.target.value)}
          required={isRequired}
          type={type}
        />
      );
    }

    if (typeElement === "textarea") {
      return (
        <textarea
          value={value}
          className={`w-[250px] rounded-[4px] border border-gray-300 p-2 min-h-[80px]`}
          placeholder={label}
          onChange={(e) => handleChange(name, e.target.value)}
          required={isRequired}
        />
      );
    }

    if (typeElement === "select" && isMulti) {
      return (
        <MultiSelect
          name={name}
          divClassname="w-full"
          searchable={isSearchable}
          value={
            isLoading
              ? []
              : getSelectValue(
                  formData,
                  name,
                  isMulti,
                  options,
                  valueKey,
                  labelKey
                )
          }
          options={getSelectOptions(options, valueKey, labelKey) || []}
          onChange={(e) => {
            const selectedItems = e.target.value || [];
            const selectedValue = selectedItems.map((item: any) => item.value);

            setFormData((prev: any) => ({ ...prev, [name]: selectedValue }));
          }}
          placeholder="Выберите регионы..."
          className="w-full max-w-[250px]"
          isLoading={isLoading}
          enableBackendSearch={true}
          searchEndpoint="/region/admin"
          searchParam="search"
          searchDelay={500}
        />
      );
    }

    if (typeElement === "select") {
      return (
        <Select
          isMulti={isMulti}
          isSearchable={isSearchable}
          isLoading={isLoading}
          name={name}
          options={getSelectOptions(options, valueKey, labelKey)}
          value={
            isLoading
              ? null
              : getSelectValue(
                  formData,
                  name,
                  isMulti,
                  options,
                  valueKey,
                  labelKey
                )
          }
          onChange={(selected) => {
            const selectedValue = isMulti
              ? (selected || []).map((s) => s.value)
              : selected?.value || "";

            // Base update
            const updated = { ...formData, [name]: selectedValue };

            // If region group selected, also populate regions ids from group
            if (name === "region_group_id") {
              const selectedGroup = (options || []).find(
                (o) => o.id === selectedValue
              );
              const regionIds = selectedGroup?.regions?.map((r) => r.id) || [];
              updated.regions = regionIds;
            }

            setFormData(updated);
          }}
          placeholder="Выберите..."
          className="w-[250px] rounded-[4px]"
        />
      );
    }

    if (typeElement === "checkbox") {
      return (
        <Checkbox
          id={name}
          checked={!!value}
          onCheckedChange={(checked) => handleChange(name, !!checked)}
          required={isRequired}
          className=""
        />
      );
    }
    return null;
  };

  return (
    <div className="w-full mx-auto my-0 px-4 py-2">
      <div className="grid grid-cols-1 w-full lg:grid-cols-[1fr_1fr_.5fr] md:grid-cols-2 gap-x-6 gap-y-3">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col gap-2">
            <label
              htmlFor={field.name}
              className="text-sm font-medium cursor-pointer select-none"
            >
              {field.label}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>
    </div>
  );
}
