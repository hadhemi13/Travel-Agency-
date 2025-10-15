import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface TextFormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  type?: string;
  placeholder?: string;
  containerClass?: string;
}

const TextFormInput = <T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  containerClass = "",
}: TextFormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={containerClass}>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {label}
          </label>
          <input
            {...field}
            type={type}
            placeholder={placeholder || label}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          {error && (
            <p className="mt-1 text-sm text-red-500">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default TextFormInput;