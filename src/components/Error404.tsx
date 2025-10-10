import { error404 } from "../assets/lottie";
import Lottie from "lottie-react";

export default function Error404() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="mb-6 flex flex-col items-center justify-center">
          <Lottie
            animationData={error404}
            loop={true}
            style={{ width: 300, height: 300 }}
          />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Sahifa topilmadi
        </h1>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Siz qidirayotgan sahifa mavjud emas yoki ruxsatingiz yo'q. Iltimos,
          to'g'ri URL manzilni tekshiring.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-[#f06f14] text-white rounded-sm hover:bg-[#f06f14]/80 transition-colors"
          >
            Orqaga qaytish
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-gray-600 text-white rounded-sm hover:bg-gray-700/80 transition-colors"
          >
            Bosh sahifaga
          </button>
        </div>
      </div>
    </div>
  );
}
