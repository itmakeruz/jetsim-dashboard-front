import TopProductItem from "./TopProductItem";
import { useDataContext } from "./../../../context/DataContext";

function TopProducts() {
  const { currentData } = useDataContext();

  const totalSold = currentData.topProducts.reduce(
    (prev, curr) => prev + curr.sold,
    0
  );

  return (
    <div className="bg-white flex flex-col main-shadow rounded px-4 py-2 pb-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-main-black whitespace-nowrap">
          Топ 10
        </h2>
      </div>
      <div className="flex flex-col gap-4 mb-10">
        {currentData.topProducts.map((product) => (
          <TopProductItem
            key={product.id}
            title={product.title}
            sold={product.sold}
            color={product.color}
          />
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between">
        <span className="font-medium text-sm">Тотал</span>
        <span className="font-medium text-sm">{totalSold}</span>
      </div>
    </div>
  );
}

export default TopProducts;
