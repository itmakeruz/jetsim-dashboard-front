type StatusBadgeProps = {
  status?: string | null;
  options?: { value: string; label: string }[];
  classes?: Record<string, string>;
};

// Text rangidan dot rangini olish
const getDotColor = (textClass: string): string => {
  if (textClass.includes("yellow")) return "bg-yellow-500";
  if (textClass.includes("green") || textClass.includes("emerald"))
    return "bg-green-500";
  if (textClass.includes("red") || textClass.includes("rose"))
    return "bg-red-500";
  if (textClass.includes("blue") || textClass.includes("sky"))
    return "bg-blue-500";
  if (textClass.includes("orange") || textClass.includes("amber"))
    return "bg-orange-500";
  if (textClass.includes("purple") || textClass.includes("violet"))
    return "bg-purple-500";
  if (textClass.includes("indigo")) return "bg-indigo-500";
  return "bg-gray-500";
};

function StatusBadge({ status, options, classes }: StatusBadgeProps) {
  if (!status)
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>-
      </span>
    );

  const styles = classes?.[status] || "bg-gray-100 text-gray-600";
  const label = options?.find((item) => item.value === status)?.label || status;
  const dotColor = getDotColor(styles);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${styles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {label}
    </span>
  );
}

export default StatusBadge;
