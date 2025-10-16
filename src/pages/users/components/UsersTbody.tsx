interface UsersProps {
  datas: any[];
  className?: string;
}

function UsersTbody({ datas, className }: UsersProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {datas.map((item) => (
        <div
          key={item.id}
          className={`border-b grid items-center py-2 ${className}`}
        >
          <span className="px-3 py-2">{item.id}</span>
          <span className="px-3 py-2">{item.email}</span>
          <span className="px-3 py-2">
            <span
              className={`px-2 py-1 rounded text-xs ${
                item.is_verified
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {item.is_verified ? "Да" : "Нет"}
            </span>
          </span>
          <span className="px-3 py-2 text-gray-600">
            {formatDate(item.created_at)}
          </span>
        </div>
      ))}
    </>
  );
}

export default UsersTbody;
