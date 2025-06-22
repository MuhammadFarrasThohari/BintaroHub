import React from 'react';

const InputField = ({
  type = 'text',
  name,
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  minLength,
  ariaLabel,
}) => {
  const inputId = id || name; // fallback if `id` not provided

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block mb-1.5 text-base font-lsRegular text-allBlack">
          {label}
        </label>
      )}
      <div className="input input-bordered flex items-center gap-2 w-full input-xl">
        <input
          id={inputId}
          type={type}
          className="grow"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          aria-label={ariaLabel || placeholder || label}
        />
      </div>
    </div>
  );
};

export default InputField;
