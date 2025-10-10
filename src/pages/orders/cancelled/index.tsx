import { useState } from "react";

function OrdersCancelled() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Отмененные заказы</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-600">
          Здесь будут отображаться отмененные заказы
        </p>
      </div>
    </div>
  );
}

export default OrdersCancelled;
