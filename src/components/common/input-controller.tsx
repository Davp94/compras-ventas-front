import { InputText } from "primereact/inputtext";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface InputControllerProps {
  name: string;
  control: Control<any>;
  rules: RegisterOptions | null;
  label?: string;
  placeholder?: string;
  icon?: string;
}

export default function InputController({
  name,
  control,
  rules,
  label,
  placeholder,
  icon,
}: InputControllerProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules ? rules : undefined}
      render={({ field, fieldState }) => (
        <>
          <InputText
            id={field.name}
            {...field}
            className={`${fieldState.error ? 'p-invalid' : ''}`}
            placeholder={placeholder}
          />
          {fieldState.error && <small>{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}
