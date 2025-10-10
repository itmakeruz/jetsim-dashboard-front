export default function SimCardsTable({ selectedSimCards }) {
  if (selectedSimCards.length === 0) return null;

  const getSimCardType = (simCard) => {
    if (simCard.esim) return "E-SIM";
    if (simCard.physical_sim) return "Fizik SIM";
    if (simCard.integration) return "Integratsiya";
    return "-";
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: { text: "Mavjud", classes: "bg-green-100 text-green-800" },
      inactive: { text: "Faol emas", classes: "bg-red-100 text-red-800" },
    };

    const config = statusConfig[status] || {
      text: status,
      classes: "bg-gray-100 text-gray-800",
    };

    return (
      <span className={`px-2 py-1 rounded text-xs ${config.classes}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tanlangan SIM kartalar:
      </label>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">
                ICCID
              </th>
              <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">
                Turi
              </th>
              <th className="border px-4 py-2 text-left text-sm font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedSimCards.map((simCard, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-sm font-mono">
                  {simCard.ssid}
                </td>
                <td className="border px-4 py-2 text-sm">
                  {getSimCardType(simCard)}
                </td>
                <td className="border px-4 py-2 text-sm">
                  {getStatusBadge(simCard.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
