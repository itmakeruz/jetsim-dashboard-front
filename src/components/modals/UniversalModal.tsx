import { X } from "lucide-react";
import UniversalBtn from "../buttons/UniversalBtn";

function UniversalModal({
  title,
  onClose,
  onSubmit,
  loading = false,
  children,
  width = "min-w-[600px]",
  isShow,
  btnText = "Сохранить",
  isButtonsDisabled = false,
}) {
  return (
    <div
      className={`fixed inset-0 z-[20] grid place-content-center ${
        !isShow && "pointer-events-none"
      }`}
    >
      {isShow && (
        <div
          className="bg-[rgba(0,0,0,10%)] absolute inset-0"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`bg-white transition-all flex flex-col duration-200 z-[1] rounded main-shadow p-6 relative ${width} ${
          isShow ? "scale-[1] opacity-[1]" : "scale-[0.6] opacity-0"
        }`}
      >
        <div className="mb-6">
          {title && (
            <h2 className=" text-[24px] font-medium text-main-black">
              {title}
            </h2>
          )}
          <button
            className="absolute cursor-pointer right-3 top-3"
            onClick={onClose}
            type="button"
          >
            <X />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex max-h-[85vh] h-full flex-col gap-3"
        >
          {children}
          {!isButtonsDisabled && (
            <div className="flex mt-[20px] justify-end gap-6">
              <UniversalBtn
                onClick={onClose}
                className="!bg-[rgb(116,120,141,10%)] !text-main-grey"
              >
                Отмена
              </UniversalBtn>
              <UniversalBtn type="submit" loading={loading}>
                {btnText}
              </UniversalBtn>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default UniversalModal;
