import CopyButton from "@/components/CopyButton";

type PreviewField = "iccid" | "tariff_name" | "internet";

interface SimsCellPreviewProps {
  sims?: any[];
  field: PreviewField;
  copyLabel?: string;
  mono?: boolean;
}

const readValue = (sim: any, field: PreviewField): string => {
  if (field === "iccid") return sim?.iccid ?? "";
  if (field === "tariff_name") return sim?.tariff?.name_ru || sim?.tariff?.name_en || "";
  const internet = sim?.tariff?.quantity_internet;
  return internet || internet === 0 ? `${internet} GB` : "";
};

/**
 * В заказе может быть несколько eSIM. В таблице показываем первую,
 * остальные — счётчиком; полный список доступен по клику на строку.
 */
function SimsCellPreview({ sims, field, copyLabel, mono }: SimsCellPreviewProps) {
  if (!sims?.length) return <span className="text-gray-400">—</span>;

  const value = readValue(sims[0], field);
  const rest = sims.length - 1;

  if (!value) return <span className="text-gray-400">—</span>;

  return (
    <div className="flex items-center gap-1">
      <span className={mono ? "font-mono text-sm text-gray-900" : "text-sm text-gray-900"}>
        {value}
      </span>
      {copyLabel && <CopyButton value={value} label={copyLabel} />}
      {rest > 0 && (
        <span
          title={`Ещё ${rest} — откройте заказ`}
          className="shrink-0 px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600"
        >
          +{rest}
        </span>
      )}
    </div>
  );
}

export default SimsCellPreview;
