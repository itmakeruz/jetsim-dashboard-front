import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import UniversalBtn from "@/components/buttons/UniversalBtn";
import CustomInput from "@/components/formElements/CustomInput";
import CustomLabel from "@/components/formElements/CustomLabel";
import Loader from "@/components/Loader";
import { referenceAPI } from "@/lib/api";
import { showToast } from "@/utils/toastHelper";

const defaultFormData = {
  default_client_discount_amount: "",
  default_agent_credit_amount: "",
  is_agent_creation_enabled: false,
  agent_creation_mode: "AUTO",
  allow_limit_once: false,
  allow_limit_unlimited: false,
  allow_limit_custom: false,
  allow_no_expiry: false,
  allow_expires_at: false,
};

const creationModes = [
  { value: "AUTO", label: "Только автогенерация" },
  { value: "MANUAL", label: "Только вручную" },
  { value: "BOTH", label: "Авто или вручную" },
];

const normalizeSettings = (responseData: any) => {
  const data = Array.isArray(responseData) ? responseData[0] : responseData;

  if (!data) return defaultFormData;

  return {
    default_client_discount_amount:
      data.default_client_discount_amount?.toString() ?? "",
    default_agent_credit_amount:
      data.default_agent_credit_amount?.toString() ?? "",
    is_agent_creation_enabled: Boolean(data.is_agent_creation_enabled),
    agent_creation_mode: data.agent_creation_mode || "AUTO",
    allow_limit_once: Boolean(data.allow_limit_once),
    allow_limit_unlimited: Boolean(data.allow_limit_unlimited),
    allow_limit_custom: Boolean(data.allow_limit_custom),
    allow_no_expiry: Boolean(data.allow_no_expiry),
    allow_expires_at: Boolean(data.allow_expires_at),
  };
};

function PromocodeSettings() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState(defaultFormData);

  const { data: response, isLoading } = useQuery({
    queryKey: ["promocode-settings"],
    queryFn: () => referenceAPI.getPromocodeSettings(),
    staleTime: 30000,
  });

  useEffect(() => {
    if (response?.data?.data) {
      setFormData(normalizeSettings(response.data.data));
    }
  }, [response]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => referenceAPI.updatePromocodeSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocode-settings"] });
      showToast.success("Настройки промокодов сохранены!");
    },
    onError: () => {
      showToast.error("Произошла ошибка при сохранении настроек");
    },
  });

  const handleNumberChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value.replace(/[^\d]/g, ""),
    }));
  };

  const handleCheckboxChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateMutation.mutate({
      default_client_discount_amount: formData.default_client_discount_amount
        ? Number(formData.default_client_discount_amount)
        : null,
      default_agent_credit_amount: formData.default_agent_credit_amount
        ? Number(formData.default_agent_credit_amount)
        : null,
      is_agent_creation_enabled: formData.is_agent_creation_enabled,
      agent_creation_mode: formData.agent_creation_mode,
      allow_limit_once: formData.allow_limit_once,
      allow_limit_unlimited: formData.allow_limit_unlimited,
      allow_limit_custom: formData.allow_limit_custom,
      allow_no_expiry: formData.allow_no_expiry,
      allow_expires_at: formData.allow_expires_at,
    });
  };

  if (isLoading) {
    return <Loader isFullScreen={false} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded shadow-sm border p-6 flex flex-col gap-6"
    >
      <h1 className="text-2xl font-semibold text-main-black">
        Глобальные настройки промокодов
      </h1>

      <div className="flex items-start gap-3 rounded border border-blue-100 bg-blue-50 px-4 py-3 text-main-black">
        <Info className="w-5 h-5 text-main-orange shrink-0 mt-0.5" />
        <p>
          Эти параметры применяются ко всем агентам, у которых не задана
          индивидуальная сумма
        </p>
      </div>

      <div className="flex flex-col gap-2 max-w-[360px]">
        <CustomLabel labelText="* Скидка клиенту по умолчанию (₽)" />
        <CustomInput
          value={formData.default_client_discount_amount}
          onChange={(e) =>
            handleNumberChange("default_client_discount_amount", e.target.value)
          }
          className="max-w-[140px]"
          placeholder="500"
        />
        <p className="text-sm text-gray-500">
          Сумма, которую клиент получает в виде скидки при использовании
          промокода
        </p>
      </div>

      <div className="flex flex-col gap-2 max-w-[360px]">
        <CustomLabel labelText="* Кредит агенту по умолчанию (₽)" />
        <CustomInput
          value={formData.default_agent_credit_amount}
          onChange={(e) =>
            handleNumberChange("default_agent_credit_amount", e.target.value)
          }
          className="max-w-[140px]"
          placeholder="700"
        />
        <p className="text-sm text-gray-500">
          Сумма, которая зачисляется агенту при использовании его промокода
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <CustomLabel labelText="Создание промокодов разрешено (глобально)" />
        <button
          type="button"
          onClick={() => handleCheckboxChange("is_agent_creation_enabled")}
          className={`relative h-8 w-14 rounded-full transition-colors ${
            formData.is_agent_creation_enabled
              ? "bg-main-orange"
              : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              formData.is_agent_creation_enabled
                ? "translate-x-6"
                : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-px bg-gray-100 grow" />
        <h2 className="text-xl font-semibold text-main-black">
          Шаблон правил для агентов
        </h2>
        <div className="h-px bg-gray-100 grow" />
      </div>

      <div className="flex items-start gap-3 rounded border border-blue-100 bg-blue-50 px-4 py-3 text-main-black">
        <Info className="w-5 h-5 text-main-orange shrink-0 mt-0.5" />
        <p>
          Используется как начальные значения при настройке агента (кнопка
          «Применить глобальный шаблон»)
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <CustomLabel labelText="Способ создания кода" />
        <div className="flex flex-wrap gap-6">
          {creationModes.map((mode) => (
            <label
              key={mode.value}
              className="flex items-center gap-2 cursor-pointer text-main-black"
            >
              <input
                type="radio"
                name="agent_creation_mode"
                value={mode.value}
                checked={formData.agent_creation_mode === mode.value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    agent_creation_mode: e.target.value,
                  }))
                }
                className="accent-[#112d6c] w-5 h-5"
              />
              {mode.label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <CustomLabel labelText="Допустимые лимиты использования" />
        <div className="flex flex-col gap-2">
          <CheckboxRow
            label="Одноразовый (1)"
            checked={formData.allow_limit_once}
            onChange={() => handleCheckboxChange("allow_limit_once")}
          />
          <CheckboxRow
            label="Безлимитный"
            checked={formData.allow_limit_unlimited}
            onChange={() => handleCheckboxChange("allow_limit_unlimited")}
          />
          <CheckboxRow
            label="Указать число"
            checked={formData.allow_limit_custom}
            onChange={() => handleCheckboxChange("allow_limit_custom")}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <CustomLabel labelText="Допустимые сроки действия" />
        <div className="flex flex-col gap-2">
          <CheckboxRow
            label="Бессрочный"
            checked={formData.allow_no_expiry}
            onChange={() => handleCheckboxChange("allow_no_expiry")}
          />
          <CheckboxRow
            label="С датой окончания"
            checked={formData.allow_expires_at}
            onChange={() => handleCheckboxChange("allow_expires_at")}
          />
        </div>
      </div>

      <UniversalBtn
        type="submit"
        className="self-start hover:!bg-main-orange/90"
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? "Сохранение..." : "Сохранить"}
      </UniversalBtn>
    </form>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-main-black">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-[#112d6c] w-5 h-5"
      />
      {label}
    </label>
  );
}

export default PromocodeSettings;
