import CoverImageField from "@/components/formElements/CoverImageField";
import { useState } from "react";
import CustomInput from "@/components/formElements/CustomInput";

import { handleChange } from "./../../../../utils/handleChange";
import FormImgView from "@/components/FormImgView";
import { statusOptions } from "@/constants/StaticOptions";
import CustomSelect from "@/components/formElements/CustomSelect";

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
        onChange={(e) =>
          setFormData((prev: any) => ({
            ...prev,
            iso_code: e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2),
          }))
        }
        className="max-w-[320px]"
        label="ISO-код страны"
        placeholder="Например, TR (пусто, если это не страна)"
        name="iso_code"
        value={formData?.iso_code ?? ""}
      />
      <CustomSelect
        onChange={handleChange(setFormData)}
        className="max-w-[320px] w-full"
        label="Статус"
        placeholder="Статус"
        name="status"
        value={formData?.status ?? ""}
        options={statusOptions}
      />
      <CustomInput
        onChange={handleChange(setFormData, setPreviewImage)}
        className="max-w-[320px] cursor-pointer"
        label="Флаг / иконка"
        placeholder="Изображение"
        name="image"
        type="file"
        required={!editData}
      />

      {(previewImage || formData?.image || editData?.image) && (
        <FormImgView
          previewImage={previewImage}
          formData={formData}
          editData={editData}
          alt="Region image"
        />
      )}
      <CoverImageField
        value={formData.cover_image}
        removed={formData.remove_cover}
        onChange={(file, remove) =>
          setFormData((prev) => ({
            ...prev,
            cover_image: file,
            remove_cover: remove,
          }))
        }
      />
    </>
  );
}

export default RegionsForm;
