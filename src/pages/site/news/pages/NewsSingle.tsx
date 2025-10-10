import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { languageOptions } from "@/constants/languagesOptions";
import Loader from "@/components/Loader";
import { showToast } from "@/utils/toastHelper";
import { getNewsPhotoUrl } from "@/utils/imageUtils";

function NewsSingle() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch single news data
  const {
    data: newsData,
    isLoading,
    error,
  } = useApi({
    endpoint: `/news/${id}`,
    method: "GET",
    onError: () => {
      showToast.error("Ошибка при загрузке новости!");
      navigate("/site/news");
    },
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error || !newsData) {
    return (
      <div className="bg-white rounded-lg flex flex-col shadow-md p-6 max-w-3xl w-full">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4 text-red-600">
            Новость не найдена
          </h1>
          <p className="text-gray-600 mb-6">
            Запрашиваемая новость не существует или была удалена.
          </p>
          <button
            onClick={() => navigate("/site/news")}
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded"
          >
            Вернуться к списку новостей
          </button>
        </div>
      </div>
    );
  }

  const news = newsData.data || newsData;

  return (
    <div className="bg-white rounded-lg flex flex-col shadow-md p-6 max-w-3xl w-full">
      {/* Image */}
      {news.photo && (
        <div className="w-full h-64 rounded mb-6 overflow-hidden">
          <img
            src={getNewsPhotoUrl(news.photo)}
            alt={news.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-4 text-main-black">
        {news.title}
      </h1>

      {/* Description */}
      <div className="text-gray-700 mb-6 whitespace-pre-wrap">
        {news.description}
      </div>

      {/* Language */}
      <p className="text-sm text-gray-600 mb-4">
        Язык:{" "}
        <span className="font-semibold">
          {languageOptions.find((data) => data?.id == news?.lang)?.name ||
            "Не указан"}
        </span>
      </p>

      {/* Created date if available */}
      {news.created_at && (
        <p className="text-sm text-gray-500 mb-4">
          Дата создания: {new Date(news.created_at).toLocaleDateString()}
        </p>
      )}

      {/* Back button */}
      <button
        onClick={() => navigate("/site/news")}
        className="mt-6 px-4 py-2 bg-gray-100 ml-auto text-gray-700 hover:bg-gray-200 rounded transition-colors"
      >
        Назад к новостям
      </button>
    </div>
  );
}

export default NewsSingle;
