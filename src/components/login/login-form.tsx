import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Controller, useForm } from "react-hook-form";
import InputController from "../common/input-controller";
import { Password } from "primereact/password";
import { Button } from "primereact/button";

export default function LoginForm() {
  const router = useRouter();
  // TODO add login services
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = () => {}
  return (
    <>
      <div className="flex items-center justify-center w-[500px] p-4">
        <Card
          className="w-full"
          title={
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">COMPRAS VENTAS APP</h2>
            </div>
          }
          subTitle="Ingrese sus datos de acceso"
        >
          <div className="p-fluid">
            <div className="field">
              <InputController
                control={control}
                name="username"
                rules={{ required: "El username es requerido" }}
              />
            </div>
            <div className="field">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 8,
                    message: "La contraseña debe tener al menos 8 caracteres",
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <Password
                      id={field.name}
                      {...field}
                      className=""
                      placeholder="Ingrese correo"
                    />
                    {fieldState.error && (
                      <small>{fieldState.error.message}</small>
                    )}
                  </>
                )}
              />
            </div>
            <Button
                label="Inciar Sesion"
                icon="pi pi-sign-in"
                className="w-full"
                onClick={handleSubmit(onSubmit)}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
