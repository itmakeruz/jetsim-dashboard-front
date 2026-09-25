import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  value?: string | null;
  label?: string;
}

function CopyButton({ value, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!value) return null;

  const handleCopy = async (e: React.MouseEvent) => {
    // Строки таблицы кликабельны и открывают модалку — копирование не должно её открывать
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard недоступен вне https — молча ничего не делаем
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={label ? `Скопировать ${label}` : "Скопировать"}
      aria-label={label ? `Скопировать ${label}` : "Скопировать"}
      className="shrink-0 p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-600" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

export default CopyButton;
