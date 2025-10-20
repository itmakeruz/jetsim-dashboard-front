import formatNumber from "@/utils/formatNumber";

function TransactionsTbody({ datas, className }) {
  return (
    <>
      {datas.map((item, index) => (
        <div
          key={item.id}
          className={`grid w-full min-h-[36px] border-t border-[#E3E4E8] items-center gap-4 text-sm text-main-black font-medium ${className}`}
        >
          <span>{item.id}</span>
          <span>{item.agent ? item.agent.name : "-"}</span>
          <span>{item.user ? item.user.name : "-"}</span>
          <span>{formatNumber(+item.amount)} UZS</span>
          <span>{item.type}</span>
          <span>{item.action}</span>
          <span className="truncate">{item.message}</span>
          <span>{item.created_at?.slice(0, 16).replace("T", " ")}</span>
        </div>
      ))}
    </>
  );
}

export default TransactionsTbody;
