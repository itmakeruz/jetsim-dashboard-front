import PercentChange from "@/components/PercentChange";
import { useDataContext } from "@/context/DataContext";
import formatNumber from "@/utils/formatNumber";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function SalesChart() {
  const { currentData, monthlyComparison } = useDataContext();

  return (
    <div className="bg-white main-shadow rounded p-4 pb-5 col-span-3">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-[10px]">
          <h2 className="text-lg font-bold text-main-black">
            Продажа за {monthlyComparison?.current_month?.name || "месяц"}
          </h2>
          {currentData.chartDatas.percent && (
            <PercentChange percent={currentData.chartDatas.percent} />
          )}
        </div>
        <div className="text-lg font-bold text-main-black">
          {formatNumber(currentData.chartDatas.summ)} сум
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={currentData.chartDatas.datas}
          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "10px",
            }}
            labelStyle={{ fontWeight: "bold" }}
            formatter={(value, name) => {
              const labels = {
                total_amount: "Общая сумма",
                product_amount: "Сумма товаров",
                simcard_amount: "Сумма сим-карт",
                orders_count: "Количество заказов",
              };
              return [formatNumber(value), labels[name] || name];
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="total_amount"
            stroke="#8884d8"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            name="Общая сумма"
          />
          <Line
            type="monotone"
            dataKey="product_amount"
            stroke="#82ca9d"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            name="Сумма товаров"
          />
          <Line
            type="monotone"
            dataKey="simcard_amount"
            stroke="#ffc658"
            strokeWidth={2}
            activeDot={{ r: 6 }}
            name="Сумма сим-карт"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
