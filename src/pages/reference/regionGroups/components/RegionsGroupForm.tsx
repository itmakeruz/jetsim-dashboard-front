import React, { useState } from "react";
import CustomInput from "@/components/formElements/CustomInput";
import { getImageUrl } from "@/utils/imageUtils";

function RegionsGroupForm({ formData, setFormData, editData }) {
  const [previewImage, setPreviewImage] = useState(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file change for image preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);

      setFormData((prev: any) => ({
        ...prev,
        icon: file,
      }));
    }
  };

  return (
    <>
      <CustomInput
        onChange={handleChange}
        className="max-w-[320px]"
        label="Название (RU)"
        placeholder="Название на русском"
        name="name_ru"
        value={formData?.name_ru ?? editData?.name_ru ?? ""}
        required
      />
      <CustomInput
        onChange={handleChange}
        className="max-w-[320px]"
        label="Название (EN)"
        placeholder="Название на английском"
        name="name_en"
        value={formData?.name_en ?? editData?.name_en ?? ""}
        required
      />
      <CustomInput
        onChange={handleFileChange}
        className="max-w-[320px]"
        label="Иконка"
        placeholder="Выберите иконку"
        name="icon"
        type="file"
        accept="image/*"
        required={!editData}
      />
      {(previewImage || editData?.icon) && (
        <div className="mt-2 ml-auto">
          <img
            className="w-12 h-12 object-cover rounded-lg border border-gray-300"
            src={
              previewImage ||
              (editData?.icon ? getImageUrl(editData.icon) : null)
            }
            alt="Region group icon"
          />
        </div>
      )}
    </>
  );
}

export default RegionsGroupForm;
