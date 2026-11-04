import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowLeftRight,
  Banknote,
  Check,
  CreditCard,
  Loader2,
  Mail,
  Minus,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  User,
  Wifi,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { ordersAPI } from "@/lib/api";
import { showToast } from "@/utils/toastHelper";
import formatNumber from "@/utils/formatNumber";

interface TariffOption {
  id: number;
  name_ru: string;
  status: string;
  quantity_internet: number | null;
  validity_period: number | null;
  price_sell: number | null;
}

type PaymentMethod = "CASH" | "CARD" | "TRANSFER" | "OTHER";

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { id: "CASH", label: "Наличные", icon: Banknote },
  { id: "CARD", label: "Карта", icon: CreditCard },
  { id: "TRANSFER", label: "Перевод", icon: ArrowLeftRight },
  { id: "OTHER", label: "Другое", icon: MoreHorizontal },
];

const inputCls =
  "w-full border border-[rgb(116,120,141,0.35)] rounded-lg py-2.5 text-sm outline-none transition focus:border-main-orange focus:ring-2 focus:ring-main-orange/15";

const emptyForm = {
  tariff: null as TariffOption | null,
  quantity: "1",
  email: "",
  name: "",
  phone: "",
  payment_method: "CASH" as PaymentMethod,
  comment: "",
};

/**
 * Страница создания заказа сотрудником: тариф, клиент (письмо с eSIM уйдёт на его email) и способ оплаты,
 * которую сотрудник принял сам. request_id живёт, пока открыта страница: двойной клик или повтор
 * после обрыва связи не выпустит вторую eSIM.
 */
function CreateOrder() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [requestId, setRequestId] = useState(() => crypto.randomUUID());
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: tariffsResponse, isLoading: tariffsLoading } = useQuery({
    queryKey: ["order-create-tariffs", debounced],
    queryFn: () => ordersAPI.searchTariffsForOrder(debounced),
    staleTime: 30000,
  });
  const tariffs: TariffOption[] = (tariffsResponse?.data?.data ?? []).filter(
    (t: TariffOption) => t.status === "ACTIVE" && t.price_sell,
  );

  const close = () => navigate("/orders");

  const quantity = Math.min(10, Math.max(1, parseInt(form.quantity, 10) || 1));
  const total = (form.tariff?.price_sell ?? 0) * quantity;

  const mutation = useMutation({
    mutationFn: () =>
      ordersAPI.createAdminOrder({
        tariff_id: form.tariff!.id,
        quantity,
        client_email: form.email.trim(),
        client_name: form.name.trim() || undefined,
        client_phone: form.phone.trim() || undefined,
        payment_method: form.payment_method,
        comment: form.comment.trim() || undefined,
        request_id: requestId,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      const body = res?.data;
      if (body?.success) {
        showToast.success(`Заказ #${body.data.order_id} оформлен, eSIM отправлена клиенту`);
      } else {
        // Заказ создан, но выдача не завершилась: повторять нельзя — смотрим историю заказа
        showToast.error(
          `Заказ #${body?.data?.order_id}: ${body?.message ?? "выдача eSIM не завершена"}`,
        );
      }
      navigate("/orders");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message;
      showToast.error(
        (Array.isArray(message) ? message.join("; ") : message) ||
          "Не удалось оформить заказ. Проверьте историю заказов перед повтором",
      );
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tariff) return showToast.error("Выберите тариф");
    mutation.mutate();
  };

  const set = (key: keyof typeof emptyForm) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const setQuantity = (n: number) => setForm((f) => ({ ...f, quantity: String(Math.min(10, Math.max(1, n))) }));

  // Оформлять заказы клиентам могут администраторы; бухгалтер заказы только смотрит
  if (user && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") return <Navigate to="/orders" replace />;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={close}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>К заказам</span>
        </button>
      </div>
      <h1 className="text-2xl font-semibold text-main-black">Новый заказ</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* 1. Тариф */}
        <section className="lg:col-span-3 bg-white rounded-xl shadow-sm border p-6 flex flex-col gap-4">
          <StepTitle n={1} title="Выберите тариф" />
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию или SKU"
              className={`${inputCls} pl-9 pr-4`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 content-start">
            {tariffsLoading && <p className="col-span-full text-sm text-gray-500 py-6 text-center">Загрузка тарифов…</p>}
            {!tariffsLoading && tariffs.length === 0 && (
              <p className="col-span-full text-sm text-gray-500 py-6 text-center">Нет подходящих тарифов</p>
            )}
            {tariffs.map((t) => {
              const selected = form.tariff?.id === t.id;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setForm((f) => ({ ...f, tariff: t }))}
                  className={`relative text-left rounded-xl border p-4 transition flex flex-col gap-3 ${
                    selected
                      ? "border-main-orange bg-main-orange/5 ring-2 ring-main-orange/20"
                      : "border-gray-200 bg-white hover:border-main-orange/50 hover:shadow-sm"
                  }`}
                >
                  {selected && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-main-orange text-white grid place-content-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                  <span className="font-semibold text-main-black leading-snug pr-6">{t.name_ru}</span>
                  <span className="flex flex-wrap gap-1.5">
                    {t.quantity_internet ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                        <Wifi className="w-3 h-3" />
                        {t.quantity_internet} ГБ
                      </span>
                    ) : null}
                    {t.validity_period ? (
                      <span className="text-xs bg-gray-100 text-gray-700 rounded-full px-2 py-0.5">
                        {t.validity_period} дн.
                      </span>
                    ) : null}
                  </span>
                  <span className="text-lg font-bold text-main-orange">{formatNumber(t.price_sell)} ₽</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2–3. Клиент, оплата, итог */}
        <section className="lg:col-span-2 lg:sticky lg:top-4 bg-white rounded-xl shadow-sm border p-6 flex flex-col gap-4">
          <StepTitle n={2} title="Клиент" />
          <div className="flex flex-col gap-3">
            <IconInput icon={Mail}>
              <input
                type="email"
                required
                placeholder="Email — туда уйдёт eSIM"
                value={form.email}
                onChange={set("email")}
                className={`${inputCls} pl-9 pr-3`}
              />
            </IconInput>
            <div className="grid grid-cols-2 gap-3">
              <IconInput icon={User}>
                <input placeholder="Имя" value={form.name} onChange={set("name")} className={`${inputCls} pl-9 pr-3`} />
              </IconInput>
              <IconInput icon={Phone}>
                <input placeholder="Телефон" value={form.phone} onChange={set("phone")} className={`${inputCls} pl-9 pr-3`} />
              </IconInput>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-main-black">Количество eSIM</span>
              <div className="flex items-center border border-[rgb(116,120,141,0.35)] rounded-lg overflow-hidden">
                <button type="button" onClick={() => setQuantity(quantity - 1)} disabled={quantity <= 1} className="w-9 h-9 grid place-content-center hover:bg-gray-50 disabled:opacity-40">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} disabled={quantity >= 10} className="w-9 h-9 grid place-content-center hover:bg-gray-50 disabled:opacity-40">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <StepTitle n={3} title="Оплата принята" />
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_OPTIONS.map(({ id, label, icon: Icon }) => {
              const active = form.payment_method === id;
              return (
                <button
                  type="button"
                  key={id}
                  onClick={() => setForm((f) => ({ ...f, payment_method: id }))}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition ${
                    active
                      ? "border-main-orange bg-main-orange text-white"
                      : "border-gray-200 text-main-black hover:border-main-orange/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
          <input
            placeholder="Комментарий (необязательно)"
            maxLength={500}
            value={form.comment}
            onChange={set("comment")}
            className={`${inputCls} px-3`}
          />

          <div className="rounded-xl bg-main-orange text-white p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3 text-sm">
              <span className="opacity-80">{form.tariff ? `${form.tariff.name_ru} × ${quantity}` : "Выберите тариф"}</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-sm opacity-80">К оплате клиентом</span>
              <span className="text-2xl font-bold">{formatNumber(total)} ₽</span>
            </div>
            <button
              type="submit"
              disabled={mutation.isPending || !form.tariff}
              className="h-10 rounded-lg bg-white text-main-orange font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition hover:bg-gray-100"
            >
              {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {mutation.isPending ? "Оформляем…" : "Оформить заказ"}
            </button>
            <button type="button" onClick={close} className="text-xs opacity-75 hover:opacity-100 transition">
              Отмена
            </button>
          </div>
        </section>
      </div>
    </form>
  );
}

function StepTitle({ n, title }: { n: number; title: string }) {
  return (
    <h3 className="flex items-center gap-2 text-sm font-semibold text-main-black">
      <span className="w-6 h-6 rounded-full bg-main-orange text-white text-xs grid place-content-center">{n}</span>
      {title}
    </h3>
  );
}

function IconInput({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="relative">
      <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      {children}
    </div>
  );
}

export default CreateOrder;
