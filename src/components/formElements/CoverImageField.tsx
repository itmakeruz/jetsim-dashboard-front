import { useEffect, useId, useRef, useState } from "react";
import { getImageUrl } from "@/utils/imageUtils";

export default function CoverImageField({
  value,
  removed,
  onChange,
}: {
  value?: File | string | null;
  removed?: boolean;
  onChange: (file: File | null, remove: boolean) => void;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(typeof value === "string" && value ? getImageUrl(value) : "");
  }, [value]);
  return (
    <div className="w-full max-w-[420px] flex flex-col gap-3">
      <label htmlFor={id} className="text-sm font-medium">
        Фото обложки
      </label>
      <p className="text-xs text-gray-500">
        Фон карточки и страницы направления. Флаг загружается отдельно. JPEG,
        PNG или WebP, до 8 МБ. Рекомендуем 1600 × 1000 px без надписей.
      </p>
      <input
        ref={inputRef}
        id={id}
        name="cover_image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="text-sm w-full"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          if (
            !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
            file.size > 8 * 1024 * 1024
          ) {
            setError("Выберите JPEG, PNG или WebP размером до 8 МБ.");
            event.target.value = "";
            return;
          }
          setError("");
          onChange(file, false);
        }}
      />
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
      {!removed && preview && (
        <>
          <img
            src={preview}
            alt="Предпросмотр фото обложки"
            className="w-full aspect-[8/5] object-cover rounded-xl border border-gray-200"
          />
          <button
            type="button"
            className="text-sm text-red-600 self-start"
            onClick={() => {
              if (inputRef.current) inputRef.current.value = "";
              setError("");
              onChange(null, true);
            }}
          >
            Убрать обложку
          </button>
        </>
      )}
      {removed && (
        <p className="text-xs text-gray-500">
          Обложка будет убрана после сохранения.
        </p>
      )}
    </div>
  );
}
