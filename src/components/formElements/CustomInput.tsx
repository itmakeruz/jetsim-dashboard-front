import CustomLabel from "./CustomLabel";
interface CustomInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
  label?: string;
  error?: string;
  divClassname?: string;
  disabled?: boolean;
}

const CustomInput = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  name,
  disabled = false,
  required = true,
  defaultValue,
  className = "",
  label,
  error,
  divClassname = "",
  ...rest
}: CustomInputProps) => {
  return (
    <div className={`flex items-center justify-between gap-2 ${divClassname}`}>
      {label && <CustomLabel labelText={label} />}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={type === "file" ? undefined : value}
        onChange={onChange}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        className={`border w-full outline-none px-4 border-[rgb(116,120,141,0.35)] py-3 rounded text-sm ${
          error && "border-red-500"
        } ${disabled ? "!border-transparent" : ""}
        ${className} 
        `}
        {...rest}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CustomInput;
