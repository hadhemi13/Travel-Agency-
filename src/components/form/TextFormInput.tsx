import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface TextFormInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  type?: string;
  placeholder?: string;
  containerClass?: string;
  className?: string;
  combinedInput?: boolean; // Pour les inputs sans label (utilisé dans les formulaires combinés)
}

const TextFormInput = <T extends FieldValues>({
  name,
  control,
  label,
  type = "text",
  placeholder,
  containerClass = "",
  className = "",
  combinedInput = false,
}: TextFormInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={containerClass}>
          {!combinedInput && label && (
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {label}
            </label>
          )}
          <input
            {...field}
            type={type}
            placeholder={placeholder || label}
            className={
              combinedInput
                ? `form-control ${className}` // Utilise les classes Bootstrap existantes pour compatibilité
                : `w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition ${className}`
            }
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