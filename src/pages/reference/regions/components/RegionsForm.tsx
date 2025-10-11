import { useState } from "react";
import CustomInput from "@/components/formElements/CustomInput";
import { getImageUrl } from "@/utils/imageUtils";

import { handleChange } from './../../../../utils/handleChange';

interface RegionsFormProps {
  formData: any;
  setFormData: any;
  editData: any;
}

function RegionsForm({ formData, setFormData, editData }: RegionsFormProps) {
  const [previewImage, setPreviewImage] = useState(null);

  return (
    <>
      <CustomInput
        onChange={handleChange(setFormData)}
        className="max-w-[320px]"
        label="Название (RU)"
        placeholder="Название на русском"
        name="name_ru"
        value={formData?.name_ru ?? ""}
        required
      />

      <CustomInput
        onChange={handleChange(setFormData)}
        className="max-w-[320px]"
        label="Название (EN)"
        placeholder="Название на английском"
        name="name_en"
        value={formData?.name_en ?? ""}
        required
      />
      <CustomInput
        onChange={handleChange(setFormData, setPreviewImage)}
        className="max-w-[320px] cursor-pointer"
        label="Изображение"
        placeholder="Изображение"
        name="image"
        type="file"
        required={!editData}
      />

      {(previewImage || formData?.image || editData?.image) && (
        <div className="mt-2">
          <img
            className="w-16 h-16 object-cover rounded-lg border border-gray-300"
            src={
              previewImage ||
              (typeof (formData?.image || editData?.image) === "string"
                ? getImageUrl(formData?.image || editData?.image)
                : null)
            }
            alt="Region image"
          />
        </div>
      )}
    </>
  );
}

export default RegionsForm;
