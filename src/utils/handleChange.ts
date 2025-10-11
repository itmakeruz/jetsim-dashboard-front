import React from "react";

export const handleChange =
  <T extends object>(
    setState: React.Dispatch<React.SetStateAction<T>>,
    setPreviewImage?: React.Dispatch<React.SetStateAction<string | null>>
  ) =>
  (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, type, value, checked, files } = e.target as HTMLInputElement;

    if (type === "file") {
      const file = files?.[0];
      if (file) {
        setState((prev) => ({ ...prev, [name]: file }));

        const reader = new FileReader();
        reader.onload = (ev) => {
          setPreviewImage?.(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    const finalValue = type === "checkbox" ? checked : value;

    setState((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };
