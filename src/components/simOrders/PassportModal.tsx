import { X } from "lucide-react";
import { getPassportImageUrl } from "@/utils/imageUtils";

export default function PassportModal({
  showPassportModal,
  setShowPassportModal,
  passport,
}) {
  if (!showPassportModal) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Просмотр паспорта</h3>
          <button
            type="button"
            onClick={() => setShowPassportModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          {passport ? (
            typeof passport === "string" ? (
              <img
                src={getPassportImageUrl(passport)}
                alt="Паспорт"
                className="max-h-[70vh] max-w-full object-contain rounded border border-gray-300 bg-gray-200"
                style={{ display: "block" }}
              />
            ) : (
              <img
                src={URL.createObjectURL(passport)}
                alt="Паспорт"
                className="max-h-[70vh] max-w-full object-contain rounded border border-gray-300 bg-gray-200"
                style={{ display: "block" }}
              />
            )
          ) : (
            <span>Паспорт файла нет</span>
          )}
        </div>
      </div>
    </div>
  );
}
