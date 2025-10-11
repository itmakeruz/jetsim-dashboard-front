import { getImageUrl } from '@/utils/imageUtils'

interface FormImgType {
    previewImage: string | null
    formData: any
    editData: any
    alt: string
}

function FormImgView({ previewImage, formData, editData, alt }: FormImgType) {

    return (
        <div className="mt-2">
            <img
                className="w-20 h-16 object-cover rounded border border-gray-300"
                src={
                    previewImage ||
                    (typeof (formData?.image || editData?.image || editData?.icon) === "string"
                        ? getImageUrl(formData?.image || editData?.image || editData?.icon)
                        : null)
                }
                alt={alt}
            />
        </div>
    )
}

export default FormImgView