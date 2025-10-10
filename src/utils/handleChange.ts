import React from "react";
export const handleChange =
  <T extends object>(setState: React.Dispatch<React.SetStateAction<T>>) =>
  (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, type, value, checked, files } = e.target as HTMLInputElement;

    let finalValue: any = value;

    if (type === "checkbox") {
      finalValue = checked;
    } else if (type === "file") {
      finalValue = files?.[0] || null;
    }

    setState((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };
