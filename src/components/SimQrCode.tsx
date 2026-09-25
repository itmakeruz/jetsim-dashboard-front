import { useEffect, useState } from "react";
import { ordersAPI } from "@/lib/api";

interface SimQrCodeProps {
  simId: number;
  /** Строка активации (LPA) — показываем под картинкой для ручного ввода */
  activationCode?: string | null;
}

function SimQrCode({ simId, activationCode }: SimQrCodeProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    setSrc(null);
    setError(false);

    ordersAPI
      .getSimQrCode(simId)
      .then((res) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(res.data);
        setSrc(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [simId]);

  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">QR-код</h3>
        <p className="text-sm text-gray-500">
          QR-код недоступен — партнёр ещё не выдал профиль для этой eSIM.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">QR-код</h3>

      <div className="flex flex-col items-center gap-3">
        {src ? (
          <img
            src={src}
            alt={`QR-код eSIM #${simId}`}
            className="w-[200px] h-[200px] object-contain"
          />
        ) : (
          <div className="w-[200px] h-[200px] rounded bg-gray-100 animate-pulse" />
        )}

        {activationCode && (
          <p className="w-full break-all text-center text-xs font-mono text-gray-500">
            {activationCode}
          </p>
        )}
      </div>
    </div>
  );
}

export default SimQrCode;
