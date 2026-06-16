import { Plus } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import UniversalBtn from "@/components/buttons/UniversalBtn";
import CustomInput from "@/components/formElements/CustomInput";
import CustomLabel from "@/components/formElements/CustomLabel";
import CustomTable from "@/components/tables/CustomTable";
import UniversalModal from "@/components/modals/UniversalModal";
import { size } from "@/constants/paginationStuffs";
import { promocodeColumns } from "@/constants/tableColumns";
import { referenceAPI } from "@/lib/api";
import formatNumber from "@/utils/formatNumber";
import { showToast } from "@/utils/toastHelper";
import { useAuthStore } from "@/store/authStore";

const defaultFormData = {
  creation_mode: "AUTO",
  code: "",
  limit_type: "UNLIMITED",
  usage_limit: "",
  expiry_type: "none",
  expires_at: "",
  agent_id: "",
  status: "ACTIVE",
};

const defaultReportFilters = {
  date_from: "",
  date_to: "",
};

const defaultAgentSettings = {
  client_discount_amount: 0,
  agent_credit_amount: 0,
  is_creation_enabled: true,
  creation_mode: "BOTH",
  allow_limit_once: true,
  allow_limit_unlimited: true,
  allow_limit_custom: true,
  allow_no_expiry: true,
  allow_expires_at: true,
};

const getInitialFormData = (
  isAdmin: boolean,
  agentSettings: typeof defaultAgentSettings,
) => {
  const creationMode =
    !isAdmin && agentSettings.creation_mode === "MANUAL" ? "MANUAL" : "AUTO";

  const limitType = agentSettings.allow_limit_unlimited
    ? "UNLIMITED"
    : agentSettings.allow_limit_once
      ? "ONCE"
      : "CUSTOM";

  const expiryType =
    !isAdmin && !agentSettings.allow_no_expiry && agentSettings.allow_expires_at
      ? "date"
      : "none";

  return {
    ...defaultFormData,
    creation_mode: creationMode,
    limit_type: isAdmin ? defaultFormData.limit_type : limitType,
    expiry_type: expiryType,
  };
};

function Promocodes() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [reportFilters, setReportFilters] = useState(defaultReportFilters);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isAgent = user?.role === "AGENT";

  const { data: response, isLoading } = useQuery({
    queryKey: ["promocodes", user?.role, params],
    queryFn: () =>
      isAdmin
        ? referenceAPI.getAdminPromocodes({ page: 1, size, ...params })
        : referenceAPI.getMyPromocodes({ page: 1, size, ...params }),
    enabled: Boolean(user?.role),
    staleTime: 30000,
  });

  const { data: agentSettingsResponse } = useQuery({
    queryKey: ["my-promocode-settings"],
    queryFn: () => referenceAPI.getMyPromocodeSettings(),
    enabled: isAgent,
    staleTime: 30000,
  });

  const balance = response?.data?.data?.balance ?? 0;
  const promocodes = isAdmin
    ? response?.data?.data?.items || response?.data?.data || []
    : (response?.data?.data?.items ?? []);
  const meta = response?.data?.meta;
  const agentSettings =
    agentSettingsResponse?.data?.data ?? defaultAgentSettings;
  const canCreatePromocode =
    isAdmin || (isAgent && agentSettings.is_creation_enabled);

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      isAdmin
        ? referenceAPI.createAdminPromocode(data)
        : referenceAPI.createMyPromocode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
      showToast.success("Промокод успешно создан!");
      closeCreateModal();
    },
    onError: (error: any) => {
      showToast.error(
        error?.response?.data?.message ||
          "Произошла ошибка при создании промокода",
      );
    },
  });

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData(getInitialFormData(isAdmin, agentSettings));
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: any = {
      limit_type: formData.limit_type,
    };

    if (!isAdmin) {
      payload.creation_mode = formData.creation_mode;
    }

    if (formData.creation_mode === "MANUAL") {
      payload.code = formData.code.trim().toUpperCase();
    }

    if (formData.limit_type === "CUSTOM") {
      payload.usage_limit = Number(formData.usage_limit);
    }

    if (formData.expiry_type === "date") {
      payload.expires_at = new Date(formData.expires_at).toISOString();
    }

    if (isAdmin) {
      payload.status = formData.status;
      if (formData.agent_id) {
        payload.agent_id = Number(formData.agent_id);
      }
    }

    createMutation.mutate(payload);
  };

  const getExcelParams = () => {
    return Object.fromEntries(
      Object.entries(reportFilters).filter(([, value]) => Boolean(value)),
    );
  };

  const handleExcelExport = async () => {
    try {
      const { data } = isAdmin
        ? await referenceAPI.getAdminPromocodeReportExcel(getExcelParams())
        : await referenceAPI.getMyPromocodeReportExcel(getExcelParams());

      const url = URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${isAdmin ? "admin" : "agent"}-promocode-report-${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error: any) {
      showToast.error(
        error?.response?.data?.message || "Excel yuklashda xatolik yuz berdi",
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-main-black">Промокоды</h1>

        {isAgent && (
          <div className="flex items-center gap-3">
            <div className="bg-white flex items-center gap-3 border border-gray-100 rounded px-4 py-2 shadow-sm">
              <p className="text-xs text-gray-500">Баланс</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatNumber(balance)} ₽
              </p>
            </div>

            {canCreatePromocode ? (
              <UniversalBtn
                className="text-sm"
                icon={Plus}
                onClick={() => {
                  setFormData(getInitialFormData(isAdmin, agentSettings));
                  setIsCreateModalOpen(true);
                }}
              >
                Создать промокод
              </UniversalBtn>
            ) : (
              <UniversalBtn className="text-sm opacity-60" disabled>
                Создание запрещено
              </UniversalBtn>
            )}
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <UniversalModal
          isShow={isCreateModalOpen}
          title="Новый промокод"
          btnText="Создать"
          onClose={closeCreateModal}
          onSubmit={handleCreateSubmit}
          loading={createMutation.isPending}
        >
          <CreatePromocodeForm
            formData={formData}
            setFormData={setFormData}
            isAdmin={isAdmin}
            agentSettings={agentSettings}
          />
        </UniversalModal>
      )}

      <ReportExcelFilters
        filters={reportFilters}
        setFilters={setReportFilters}
        onExcelExport={handleExcelExport}
      />

      <div className="bg-white rounded shadow-sm border overflow-hidden h-full">
        <CustomTable
          defaultPageSize={meta?.totalSize}
          columns={promocodeColumns}
          data={promocodes}
          isLoading={isLoading}
          skeletonCount={10}
          hasPagination={true}
          pagination={meta}
          showFullscreenButton={false}
        />
      </div>
    </div>
  );
}

function ReportExcelFilters({
  filters,
  setFilters,
  onExcelExport,
}: {
  filters: typeof defaultReportFilters;
  setFilters: React.Dispatch<React.SetStateAction<typeof defaultReportFilters>>;
  onExcelExport: () => void;
}) {
  const updateFilter = (name: keyof typeof defaultReportFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded shadow-sm border p-4">
      <div className="flex flex-wrap items-end gap-3">
        <FilterInput
          label="Дата от"
          type="date"
          value={filters.date_from}
          onChange={(value) => updateFilter("date_from", value)}
        />
        <FilterInput
          label="Дата до"
          type="date"
          value={filters.date_to}
          onChange={(value) => updateFilter("date_to", value)}
        />
        <UniversalBtn type="button" className="h-[38px]" onClick={onExcelExport}>
          Excel
        </UniversalBtn>
      </div>
    </div>
  );
}

function FilterInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-main-grey">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border w-[180px] outline-none px-3 border-[rgb(116,120,141,0.35)] py-2 rounded text-sm"
      />
    </label>
  );
}

function CreatePromocodeForm({
  formData,
  setFormData,
  isAdmin,
  agentSettings,
}: {
  formData: typeof defaultFormData;
  setFormData: React.Dispatch<React.SetStateAction<typeof defaultFormData>>;
  isAdmin: boolean;
  agentSettings: typeof defaultAgentSettings;
}) {
  const isManualMode = formData.creation_mode === "MANUAL";
  const isCustomLimit = formData.limit_type === "CUSTOM";
  const hasExpiryDate = formData.expiry_type === "date";
  const autoDisabled = !isAdmin && agentSettings.creation_mode === "MANUAL";
  const manualDisabled = !isAdmin && agentSettings.creation_mode === "AUTO";
  const onceDisabled = !isAdmin && !agentSettings.allow_limit_once;
  const unlimitedDisabled = !isAdmin && !agentSettings.allow_limit_unlimited;
  const customDisabled = !isAdmin && !agentSettings.allow_limit_custom;
  const noExpiryDisabled = !isAdmin && !agentSettings.allow_no_expiry;
  const expiresAtDisabled = !isAdmin && !agentSettings.allow_expires_at;

  const handleCodeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      code: value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 32),
    }));
  };

  const handleLimitChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      usage_limit: value.replace(/[^\d]/g, ""),
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <CustomLabel labelText="* Способ создания" />
        <div className="flex flex-wrap gap-6">
          <RadioOption
            name="creation_mode"
            label="Сгенерировать автоматически"
            checked={formData.creation_mode === "AUTO"}
            disabled={autoDisabled}
            onChange={() =>
              setFormData((prev) => ({ ...prev, creation_mode: "AUTO" }))
            }
          />
          <RadioOption
            name="creation_mode"
            label="Ввести вручную"
            checked={formData.creation_mode === "MANUAL"}
            disabled={manualDisabled}
            onChange={() =>
              setFormData((prev) => ({ ...prev, creation_mode: "MANUAL" }))
            }
          />
        </div>
      </div>

      {isManualMode && (
        <div className="flex flex-col gap-2">
          <CustomLabel labelText="* Промокод" />
          <CustomInput
            value={formData.code}
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="PROMO2026"
            required={isManualMode}
            minLength={4}
            maxLength={32}
          />
          <p className="text-sm text-gray-500">
            Латинские буквы и цифры, 4–32 символа
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <CustomLabel labelText="* Лимит использования" />
        <div className="flex flex-wrap gap-6">
          <RadioOption
            name="limit_type"
            label="Одноразовый (1)"
            checked={formData.limit_type === "ONCE"}
            disabled={onceDisabled}
            onChange={() =>
              setFormData((prev) => ({ ...prev, limit_type: "ONCE" }))
            }
          />
          <RadioOption
            name="limit_type"
            label="Безлимитный"
            checked={formData.limit_type === "UNLIMITED"}
            disabled={unlimitedDisabled}
            onChange={() =>
              setFormData((prev) => ({ ...prev, limit_type: "UNLIMITED" }))
            }
          />
          <RadioOption
            name="limit_type"
            label="Указать число"
            checked={formData.limit_type === "CUSTOM"}
            disabled={customDisabled}
            onChange={() =>
              setFormData((prev) => ({ ...prev, limit_type: "CUSTOM" }))
            }
          />
        </div>

        {isCustomLimit && (
          <CustomInput
            value={formData.usage_limit}
            onChange={(e) => handleLimitChange(e.target.value)}
            placeholder="Введите лимит"
            required={isCustomLimit}
            className="max-w-[180px]"
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <RadioOption
          name="expiry_type"
          type="checkbox"
          label="Без срока действия"
          checked={formData.expiry_type === "none"}
          disabled={noExpiryDisabled}
          onChange={() =>
            setFormData((prev) => ({
              ...prev,
              expiry_type: prev.expiry_type === "none" ? "date" : "none",
            }))
          }
        />

        {hasExpiryDate && (
          <div className="flex flex-col gap-2">
            <CustomLabel labelText="* Дата окончания" />
            <CustomInput
              type="date"
              value={formData.expires_at}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  expires_at: e.target.value,
                }))
              }
              required={hasExpiryDate}
              disabled={expiresAtDisabled}
              className="max-w-[220px]"
            />
          </div>
        )}
      </div>

      {isAdmin && (
        <>
          <div className="flex flex-col gap-2">
            <CustomLabel labelText="ID агента" />
            <CustomInput
              value={formData.agent_id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  agent_id: e.target.value.replace(/[^\d]/g, ""),
                }))
              }
              placeholder="Необязательно"
              className="max-w-[180px]"
            />
          </div>

          <div className="flex flex-col gap-3">
            <CustomLabel labelText="Статус" />
            <div className="flex flex-wrap gap-6">
              <RadioOption
                name="status"
                label="Активный"
                checked={formData.status === "ACTIVE"}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, status: "ACTIVE" }))
                }
              />
              <RadioOption
                name="status"
                label="Неактивный"
                checked={formData.status === "INACTIVE"}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, status: "INACTIVE" }))
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function RadioOption({
  name,
  label,
  checked,
  onChange,
  type = "radio",
  disabled = false,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  type?: "radio" | "checkbox";
  disabled?: boolean;
}) {
  return (
    <label
      className={`flex items-center gap-2 text-main-black ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="accent-[#112d6c] w-5 h-5"
      />
      {label}
    </label>
  );
}

export default Promocodes;
