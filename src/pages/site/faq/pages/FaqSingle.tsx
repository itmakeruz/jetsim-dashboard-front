import Loader from "@/components/Loader";
import { useApi } from "@/hooks/useApi";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
const languageOptions = [
  { id: "ru", name: "Русский" },
  { id: "uz", name: "O‘zbek" },
  { id: "en", name: "English" },
];
function FaqSingle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading } = useApi({
    endpoint: `/faqs/${id}`,
    method: "GET",
  });

  return isLoading ? (
    <Loader />
  ) : (
    <div className="bg-white rounded-lg shadow-md flex flex-col p-6 max-w-3xl w-full">
      <h1 className="text-2xl font-semibold mb-4">Просмотр FAQ</h1>

      <p className="mb-2">
        <span className="">Вопрос:</span> {data?.data?.question}
      </p>

      <p className="mb-2">
        <span className="">Ответ:</span> {data?.data?.answer}
      </p>

      <p className="mb-6">
        <span className="">Язык:</span>{" "}
        {languageOptions.find((item) => item?.id == data?.data?.lang)?.name}
      </p>

      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-100 ml-auto text-gray-700 hover:bg-gray-200 rounded"
      >
        Назад к FAQ
      </button>
    </div>
  );
}

export default FaqSingle;
