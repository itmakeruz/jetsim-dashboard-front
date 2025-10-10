import { languageOptions } from "@/constants/languagesOptions";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function FaqTbody({ datas, onEdit, onDelete, className }) {
  const navigate = useNavigate();

  return (
    <>
      {datas.map((item, index) => (
        <div
          key={index}
          className={`grid w-full min-h-[36px] border-t border-[#E3E4E8] items-center gap-4 text-sm text-main-black font-medium ${className}`}
        >
          <span>{index + 1}</span>
          <span className="line-clamp-1 overflow-ellipsis">
            {item.question}
          </span>
          <span className="line-clamp-1 overflow-ellipsis">{item.answer}</span>
          <span>
            {languageOptions.find((data) => data?.id == item?.lang)?.name}
          </span>

          <span className="flex items-center justify-start gap-3">
            <Eye
              onClick={() => navigate(`/site/faq/${item?.id}`)}
              className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-600"
            />
            <Pencil
              onClick={() => onEdit(item)}
              className="w-4 h-4 cursor-pointer text-gray-500 hover:text-blue-500"
            />
            <Trash2
              onClick={() => onDelete(item)}
              className="w-4 h-4 cursor-pointer text-gray-500 hover:text-red-500"
            />
          </span>
        </div>
      ))}
    </>
  );
}

export default FaqTbody;
