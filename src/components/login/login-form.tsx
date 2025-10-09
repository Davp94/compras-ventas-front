'use client'
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Controller, useForm } from "react-hook-form";
import InputController from "../common/input-controller";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useAuth } from "@/hooks/useAuth";
import { LoginRequest } from "@/types/login/login.request";

export default function LoginForm() {
  const router = useRouter();
  const {login, loading, error} = useAuth();
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

  const onSubmit = async () => {
    try {
      const loginRequest: LoginRequest = getValues();
      await login(loginRequest);
      router.push('/')
    } catch (error) {
      console.log('ERROR LOGIN', error);
    }
  }
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
            <div className="field mb-4">
              <InputController
                control={control}
                name="username"
                rules={{ required: "El username es requerido" }}
              />
            </div>
            <div className="field mb-4">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <Password
                      id={field.name}
                      {...field}
                      className=""
                      placeholder="Ingrese su contraseña"
                      toggleMask
                      feedback={false}
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
