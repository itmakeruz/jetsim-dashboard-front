import React, { useState } from "react";
import CustomInput from "@/components/formElements/CustomInput";
import { getImageUrl } from "@/utils/imageUtils";

function RegionsForm({ onChange, formData, required, selectedData }) {
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
    onChange(e);
  };

  return (
    <>
      <CustomInput
        onChange={onChange}
        className="max-w-[320px]"
        label="Название"
        placeholder="Название"
        name="name"
        value={formData?.name ?? selectedData?.name ?? ""}
        required={required}
      />
      <CustomInput
        onChange={handleFileChange}
        className="max-w-[320px] cursor-pointer"
        label="Изображение"
        placeholder="Изображение"
        name="img"
        type="file"
        required={required}
      />
      {(previewImage || formData?.img || selectedData?.img) && (
        <div className="mt-2 ml-auto">
          <img
            className="w-8 h-8 object-cover rounded-lg border border-gray-300"
            src={
              previewImage ||
              (typeof (formData?.img || selectedData?.img) === "string"
                ? getImageUrl(formData?.img || selectedData?.img)
                : null)
            }
            alt="Region image"
          />
        </div>
      )}
      <label className="flex gap-2 items-center select-none text-[16px] text-main-black font-normal">
        <input
          type="checkbox"
          name="selecting"
          checked={formData?.selecting == "1" || selectedData?.selecting == "1"}
          onChange={onChange}
          className="self-start text-[16px]"
        />
        Чаще выбирают
      </label>
    </>
  );
}

export default RegionsForm;
