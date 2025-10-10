import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Radix Select uchun import
import CustomLabel from "./CustomLabel";

const CustomSelect = ({
  value,
  options,
  placeholder,
  onChange,
  className = `border-0`,
  divClassname = "",
  required = false,
  isError,
  setIsError,
  label,
  name,
  disabled = false,
  loading = false,
}) => {
  return (
    <div className={`flex items-center justify-between gap-2 ${divClassname}`}>
      {label && <CustomLabel labelText={label} />}
      <Select
        value={value?.toString()}
        onValueChange={(val) => {
          onChange({ target: { name, value: val } });
          if (setIsError) {
            setIsError(false);
          }
        }}
        disabled={disabled}
      >
        <SelectTrigger
          className={`${className} !text-main-black text-sm capitalize cursor-pointer pr-2 !ring-0 shadow-none ${
            required && isError ? "border-red-500" : ""
          }`}
        >
          {loading ? (
            <SelectValue placeholder={"Загрузка..."} />
          ) : (
            <SelectValue placeholder={placeholder || "Выбрать"} />
          )}
        </SelectTrigger>
        <SelectContent className="shadow-none text-main-black bg-white border border-gray-200 focus:ring-0 focus:outline-none">
          {options?.map((option, index) => (
            <SelectItem
              className="cursor-pointer capitalize"
              value={option?.id?.toString()}
              key={index}
            >
              {option?.label || option?.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CustomSelect;
