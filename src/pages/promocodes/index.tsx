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
  limit_type: "unlimited",
  usage_limit: "",
  expiry_type: "none",
  expires_at: "",
};

function Promocodes() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  const { data: response, isLoading } = useQuery({
    queryKey: ["my-promocodes", params],
    queryFn: () => referenceAPI.getMyPromocodes({ page: 1, size, ...params }),
    staleTime: 30000,
  });

  const balance = response?.data?.data?.balance ?? 0;
  const promocodes = response?.data?.data?.items ?? [];
  const meta = response?.data?.meta;
  const canCreatePromocode = user?.role === "AGENT";

  const createMutation = useMutation({
    mutationFn: (data: any) => referenceAPI.createMyPromocode(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-promocodes"] });
      showToast.success("Промокод успешно создан!");
      closeCreateModal();
    },
    onError: () => {
      showToast.error("Произошла ошибка при создании промокода");
    },
  });

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData(defaultFormData);
  };

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: any = {
      creation_mode: formData.creation_mode,
      usage_limit:
        formData.limit_type === "once"
          ? 1
          : formData.limit_type === "custom"
            ? Number(formData.usage_limit)
            : null,
      expires_at:
        formData.expiry_type === "date"
          ? new Date(formData.expires_at).toISOString()
          : null,
    };

    if (formData.creation_mode === "MANUAL") {
      payload.code = formData.code.trim().toUpperCase();
    }

    createMutation.mutate(payload);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-main-black">Промокоды</h1>

        <div className="flex items-center gap-3">
          <div className="bg-white flex items-center gap-3 border border-gray-100 rounded px-4 py-2 shadow-sm">
            <p className="text-xs text-gray-500">Баланс</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatNumber(balance)} ₽
            </p>
          </div>

          {canCreatePromocode && (
            <UniversalBtn
              className="text-sm"
              icon={Plus}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Создать промокод
            </UniversalBtn>
          )}
        </div>
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
          <CreatePromocodeForm formData={formData} setFormData={setFormData} />
        </UniversalModal>
      )}

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

function CreatePromocodeForm({
  formData,
  setFormData,
}: {
  formData: typeof defaultFormData;
  setFormData: React.Dispatch<React.SetStateAction<typeof defaultFormData>>;
}) {
  const isManualMode = formData.creation_mode === "MANUAL";
  const isCustomLimit = formData.limit_type === "custom";
  const hasExpiryDate = formData.expiry_type === "date";

  const handleCodeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      code: value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 32),
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
            onChange={() =>
              setFormData((prev) => ({ ...prev, creation_mode: "AUTO" }))
            }
          />
          <RadioOption
            name="creation_mode"
            label="Ввести вручную"
            checked={formData.creation_mode === "MANUAL"}
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
            checked={formData.limit_type === "once"}
            onChange={() =>
              setFormData((prev) => ({ ...prev, limit_type: "once" }))
            }
          />
          <RadioOption
            name="limit_type"
            label="Безлимитный"
            checked={formData.limit_type === "unlimited"}
            onChange={() =>
              setFormData((prev) => ({ ...prev, limit_type: "unlimited" }))
            }
          />
          <RadioOption
            name="limit_type"
            label="Указать число"
            checked={formData.limit_type === "custom"}
            onChange={() =>
              setFormData((prev) => ({ ...prev, limit_type: "custom" }))
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
              className="max-w-[220px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function RadioOption({
  name,
  label,
  checked,
  onChange,
  type = "radio",
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  type?: "radio" | "checkbox";
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-main-black">
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="accent-[#112d6c] w-5 h-5"
      />
      {label}
    </label>
  );
}

export default Promocodes;
