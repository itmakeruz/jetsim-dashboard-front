import { useCallback, useEffect, useState } from "react";
import { Column } from "./tableType";
import { useSearchParams } from "react-router-dom";

interface TableHeadProps {
  columns: Column[];
  hasActions?: boolean;
}
function TableHead({ columns, hasActions = false }: TableHeadProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    const filters: Record<string, string> = {};
    columns.forEach((col) => {
      if (col.filter) {
        if (typeof col.filter === "object" && col.filter.type === "dateRange") {
          const startVal = searchParams.get(col.filter.startKey);
          const endVal = searchParams.get(col.filter.endKey);
          if (startVal) filters[col.filter.startKey] = startVal;
          if (endVal) filters[col.filter.endKey] = endVal;
        } else {
          const key = col.filterKey || col.id;
          const value = searchParams.get(key);
          if (value) filters[key] = value;
        }
      }
    });
    setLocalFilters(filters);
  }, [columns, searchParams]);

  const applyFilters = useCallback(
    (key: string, value: string) => {
      const newParams = new URLSearchParams(searchParams);
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
      newParams.delete("page");
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      Object.entries(localFilters).forEach(([key, value]) => {
        const currentValue = searchParams.get(key) || "";
        if (currentValue !== value) {
          applyFilters(key, value);
        }
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [localFilters]);
  const updateFilter = useCallback((key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  }, []);
  const clearFilters = useCallback(
    (keys: string[]) => {
      const newParams = new URLSearchParams(searchParams);
      keys.forEach((k) => newParams.delete(k));
      newParams.delete("page");
      setSearchParams(newParams);
      setLocalFilters((prev) => {
        const next = { ...prev };
        keys.forEach((k) => delete next[k]);
        return next;
      });
    },
    [searchParams, setSearchParams]
  );

  const renderFilter = (column: Column) => {
    if (!column.filter) return null;
    const key = column.filterKey || column.id;
    const value = localFilters[key] || "";

    if (
      typeof column.filter === "object" &&
      column.filter.type === "dateRange"
    ) {
      const startKey = column.filter.startKey;
      const endKey = column.filter.endKey;
      const startValue = localFilters[startKey] || "";
      const endValue = localFilters[endKey] || "";
      return (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={startValue}
              onChange={(e) => {
                updateFilter(startKey, e.target.value);
                applyFilters(startKey, e.target.value);
              }}
              className="w-full min-w-0 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              title="Boshlanish sanasi"
            />
            <input
              type="date"
              value={endValue}
              onChange={(e) => {
                updateFilter(endKey, e.target.value);
                applyFilters(endKey, e.target.value);
              }}
              className="w-full min-w-0 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              title="Tugash sanasi"
            />
          </div>
        </div>
      );
    }

    if (typeof column.filter === "object" && column.filter.type === "select") {
      return (
        <select
          value={value}
          onChange={(e) => {
            updateFilter(key, e.target.value);
            applyFilters(key, e.target.value);
          }}
          className="w-max min-w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        >
          <option value="">Все</option>
          {column.filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (column.filter === "select") {
      return (
        <select
          value={value}
          onChange={(e) => {
            updateFilter(key, e.target.value);
            applyFilters(key, e.target.value);
          }}
          className="w-max min-w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
        >
          <option value="">Все</option>
        </select>
      );
    }

    if (column.filter === "date") {
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => {
            updateFilter(key, e.target.value);
            applyFilters(key, e.target.value);
          }}
          className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        style={{ width: column.width }}
        onChange={(e) => updateFilter(key, e.target.value)}
        placeholder={`${column.header}...`}
        className="min-w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    );
  };
  const hasFilters = columns.some((col) => col.filter);
  return (
    <thead className="border-b sticky top-0 bg-white z-10">
      <tr>
        {columns.map((column) => (
          <th
            key={column.id}
            className={`px-1 py-3 text-left text-sm font-semibold text-gray-700 ${column.width}`}
          >
            {column.header}
          </th>
        ))}
        {hasActions && <th></th>}
      </tr>
      {hasFilters && (
        <tr>
          {columns.map((column) => (
            <th key={`filter-${column.id}`} className="px-1 pb-2">
              {renderFilter(column)}
            </th>
          ))}
          {hasActions && <th></th>}
        </tr>
      )}
    </thead>
  );
}

export default TableHead;
