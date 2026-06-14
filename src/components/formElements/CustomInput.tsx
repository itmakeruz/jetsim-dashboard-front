import CustomLabel from "./CustomLabel";
interface CustomInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "type"
  > {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
  label?: string;
  divClassname?: string;
  disabled?: boolean;
  accept?: string;
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
  divClassname = "",
  accept,
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
        accept={accept}
        value={type === "file" ? undefined : value}
        onChange={onChange}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        className={`border w-full outline-none px-4 border-[rgb(116,120,141,0.35)] py-3 rounded text-sm ${disabled ? "!border-transparent" : ""}
        ${className} 
        `}
        {...rest}
      />
    </div>
  );
};

export default CustomInput;
