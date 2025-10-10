import { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import CustomLabel from "./CustomLabel";

const MaskedPhoneInput = ({
  value = "",
  onChange,
  name,
  placeholder = "+998 __ ___ __ __",
  label,
  className,
  required,
  divClassname,
  disabled = false,
}) => {
  const [phoneValue, setPhoneValue] = useState(value);

  // Tashqaridan kelgan value o'zgarganda inputga to'g'ri formatda ko'rsatish
  useEffect(() => {
    setPhoneValue(value);
  }, [value]);

  const handleChange = (phoneNumber) => {
    // Faqat to'g'ri formatdagi raqamni qabul qilamiz
    if (phoneNumber) {
      // Raqam uzunligini tekshiramiz (Uzbekistan uchun +998 + 9 ta raqam = 13 ta)
      const cleanNumber = phoneNumber.replace(/\D/g, "");

      // Uzbekistan raqami uchun maksimal uzunlik: +998 + 9 ta raqam = 13 ta
      if (cleanNumber.length > 12) {
        return; // Uzun raqamlarni qabul qilmaymiz
      }

      // Faqat raqamlar va + belgisini qabul qilamiz
      const validPhoneNumber = phoneNumber.replace(/[^\d+]/g, "");
      if (validPhoneNumber !== phoneNumber) {
        return; // Noto'g'ri belgilarni qabul qilmaymiz
      }
    }

    setPhoneValue(phoneNumber);

    // Orqaga toza formatni qaytaramiz
    onChange({
      target: {
        name,
        value: phoneNumber || "",
      },
    });
  };

  return (
    <div className={`flex items-center justify-between gap-2 ${divClassname}`}>
      {label && <CustomLabel labelText={label} />}
      <PhoneInput
        id={name}
        name={name}
        placeholder={placeholder}
        value={phoneValue}
        onChange={handleChange}
        disabled={disabled}
        defaultCountry="UZ"
        international
        required={required}
        countryCallingCodeEditable={false}
        limitMaxLength={true}
        // inputComponent={(props) => (
        //   <input {...props} className="outline-none" />
        // )}
        className={`border w-full !outline-none px-4 py-3 border-[rgb(116,120,141,0.35)] rounded text-sm 
          ${className} ${disabled ? "" : ""}
          `}
      />
    </div>
  );
};

export default MaskedPhoneInput;
