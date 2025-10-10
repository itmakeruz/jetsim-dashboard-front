"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import Select from "react-select";

import { Checkbox } from "@/components/ui/checkbox";
import { useApi } from "@/hooks/useApi";

const getSelectOptions = (options, valueKey, labelKey) =>
  options
    ?.sort((a, b) => a.name.localeCompare(b.name))
    .map((opt) => ({
      value: opt[valueKey],
      label: opt[labelKey],
    }));

const getSelectValue = (
  formData,
  name,
  isMulti,
  options,
  valueKey,
  labelKey
) => {
  const rawValue = formData?.[name];

  if (isMulti) {
    if (!rawValue || rawValue.length === 0) return [];

    return rawValue
      .map((val) => {
        // Agar val object bo'lsa (edit mode)
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
  return opt ? { value: rawValue, label: opt[labelKey] } : null;
};

export default function TariffsForm({
  editData = null,
  formData,
  setFormData,
}) {
  // GET statuses for form
  const { data: statuses = [], isPending: isStatusesPending } = useApi({
    endpoint: "/plan-statuses",
    method: "GET",
  });
  // GET providers for form
  const { data: providers = [], isPending: isProvidersPending } = useApi({
    endpoint: "/providers",
    method: "GET",
  });
  // GET types for form
  const { data: types = [], isPending: isTypesPending } = useApi({
    endpoint: "/plan-types",
    method: "GET",
  });
  // GET region groups for form
  const { data: regionGroups = [], isPending: isRegionGroupsPending } = useApi({
    endpoint: "/region-groups",
    method: "GET",
  });
  // GET regions for form
  // const { data: regions = [], isPending: isRegionsPending } = useApi({
  //   endpoint: "/regions",
  //   method: "GET",
  // });

  // Edit rejimida eski datalarni yuklash
  useEffect(() => {
    if (editData) {
      setFormData({ ...formData, ...editData });
    }
  }, [editData]);

  // Umumiy change handler
  const handleChange = (name, value) => {
    setFormData((prev) => {
      // Agar type_sim bo'lsa (faqat 1 ni tanlash)
      if (name === "type_sim") {
        return {
          ...prev,
          type_sim: value ? "esim" : "physical_sim",
        };
      }

      // Oddiy holat
      return { ...prev, [name]: value };
    });
  };

  // Field konfiguratsiyasi
  const fields = [
    {
      label: "Название тарифа",
      name: "name",
      typeElement: "input",
      isRequired: false,
    },
    {
      label: "Поставщик",
      name: "provider_id",
      typeElement: "select",
      options: providers?.data || [],
      isLoading: isProvidersPending,
      valueKey: "id",
      labelKey: "name",
      isRequired: false,
    },
    {
      label: "E-SIM",
      name: "type_sim",
      typeElement: "checkbox",
    },
    {
      label: "Цена прихода",
      name: "price_arrival",
      typeElement: "input",
      type: "number",
    },
    {
      label: "Статус",
      name: "status_id",
      typeElement: "select",
      options: statuses?.data || [],
      isLoading: isStatusesPending,
      valueKey: "id",
      labelKey: "name",
      isRequired: false,
    },
    {
      label: "Глобальный",
      name: "is_global",
      typeElement: "checkbox",
    },
    {
      label: "Цена продажи",
      name: "price_sell",
      typeElement: "input",
      type: "number",
    },
    {
      label: "Тип тарифа",
      name: "type_id",
      typeElement: "select",
      options: types?.data || [],
      isLoading: isTypesPending,
      valueKey: "id",
      labelKey: "name",
      isRequired: false,
    },
    {
      label: "Популярный",
      name: "popular",
      typeElement: "checkbox",
    },
    {
      label: "Количество SMS",
      name: "quantity_sms",
      typeElement: "input",
      type: "number",
    },
    {
      label: "Группа регионов",
      name: "region_group_id",
      typeElement: "select",
      options: regionGroups?.data || [],
      isLoading: isRegionGroupsPending,
      valueKey: "id",
      labelKey: "name",
      isRequired: false,
    },

    {
      label: "Локальный",
      name: "is_local",
      typeElement: "checkbox",
    },
    {
      label: "Количество GB",
      name: "quantity_internet",
      typeElement: "input",
      type: "number",
    },

    {
      label: "Количество дней",
      name: "expiry_day",
      typeElement: "input",
      type: "number",
    },
    {
      label: "Региональный",
      name: "is_region",
      typeElement: "checkbox",
    },
    {
      label: "Описание тарифа",
      name: "description",
      typeElement: "textarea",
    },

    {
      label: "Количество минут",
      name: "quantity_minute",
      typeElement: "input",
      type: "number",
    },
    {
      label: "128 KB/s",
      name: "tariff_128",
      typeElement: "checkbox",
    },
    {
      label: "Примечание (UZ)",
      name: "note_uz",
      typeElement: "textarea",
    },
    {
      label: "SKU ID (Физ)",
      name: "fiz_sku_id",
      typeElement: "input",
    },
    {
      label: "256 KB/s",
      name: "tariff_256",
      typeElement: "checkbox",
    },
    {
      label: "Примечание (RU)",
      name: "note_ru",
      typeElement: "textarea",
    },
    {
      label: "SKU ID (E-sim)",
      name: "sku_id",
      typeElement: "input",
    },
    {
      label: "384 KB/s",
      name: "tariff_384",
      typeElement: "checkbox",
    },
    {
      label: "Примечание (EN)",
      name: "note_en",
      typeElement: "textarea",
    },
    {
      label: "Кешбек",
      name: "cashback_percent",
      typeElement: "input",
      type: "number",
    },
    {
      label: "4G",
      name: "tariff_4g",
      typeElement: "checkbox",
    },
    {
      label: "Скрыть с сайта",
      name: "hide_site",
      typeElement: "checkbox",
    },
    {
      label: "B2B",
      name: "b2b",
      typeElement: "checkbox",
    },
    {
      label: "5G",
      name: "tariff_5g",
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

    if (typeElement === "input" || typeElement === "textarea") {
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
          checked={name === "type_sim" ? value == "esim" : !!value}
          onCheckedChange={(checked) => handleChange(name, !!checked)}
          required={isRequired}
        />
      );
    }
    return null;
  };
  return (
    <div className="w-full mx-auto my-0 px-4 py-2 overflow-auto">
      <div className="grid grid-cols-1 w-full lg:grid-cols-[1fr_1fr_.5fr] md:grid-cols-2 gap-x-8 gap-y-3">
        {fields.map((field) => (
          <div
            key={field.name}
            className="grid grid-cols-[150px_1fr] items-center"
          >
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
