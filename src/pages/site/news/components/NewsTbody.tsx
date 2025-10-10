import { languageOptions } from "@/constants/languagesOptions";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

function NewsTbody({ datas, onEdit, onDelete, className }) {
  return (
    <>
      {datas.map((item, index) => (
        <div
          key={index}
          className={`grid w-full min-h-[36px] border-t border-[#E3E4E8] items-center gap-4 text-sm text-main-black font-medium ${className}`}
        >
          <span>{index + 1}</span>
          <Link
            to={`/site/news/${item.id}`}
            className="line-clamp-1 overflow-ellipsis hover:text-blue-600 transition-colors"
          >
            {item.title}
          </Link>
          <span className="line-clamp-1 overflow-ellipsis">
            {item.description}
          </span>
          <span>
            {languageOptions.find((data) => data?.id == item?.lang)?.name}
          </span>

          <span className="flex items-center justify-start gap-3">
            <Link
              to={`/site/news/${item.id}`}
              className="line-clamp-1 overflow-ellipsis"
            >
              <Eye className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-600" />
            </Link>
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

export default NewsTbody;
