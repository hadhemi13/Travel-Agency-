"use client";
import { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface PasswordFormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  containerClass?: string;
}

const PasswordFormInput = <T extends FieldValues>({
  name,
  control,
  label,
  containerClass = "",
}: PasswordFormInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={containerClass}>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
          <div className="relative">
            <input
              {...field}
              type={showPassword ? "text" : "password"}
              placeholder="••••••"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-500">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default PasswordFormInput;