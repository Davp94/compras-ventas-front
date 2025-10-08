import { ActionTypeEnum } from "@/constant/enum/action-type.enum";
import { RolesResponse } from "@/types/roles/roles.response";
import { UsuarioResponse } from "@/types/usuarios/usuario.response";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { RefObject, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputController from "../common/input-controller";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { useUsuarios } from "@/hooks/useUsuario";
import { useRol } from "@/hooks/useRol";

interface UsuariosFormProps {
  usuario: UsuarioResponse | null;
  hideDialog: (updateData?: boolean) => void;
  toast: RefObject<Toast | null>;
  flagAction: number;
}
export default function UsuariosForm({
  usuario,
  hideDialog,
  toast,
  flagAction,
}: UsuariosFormProps) {
  const [roles, setRoles] = useState<any>([]);
  const [rolesUsuario, setRolesUsuario] = useState<any>("");
  const { createUsuario, updateUsuario} = useUsuarios();
  const { getRoles } = useRol();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      id: 0,
      correo: "",
      username: "",
      nombres: "",
      apellidos: "",
      telefono: "",
      documentoIdentidad: "",
      estado: "",
      roles: [],
    },
  });

  const initForm = async () => {
    const rolesRetrieved = await getRoles();
    setRoles(rolesRetrieved);
    if (usuario != null && flagAction == ActionTypeEnum.UPDATE) {
      setValue("id", usuario.id);
      setValue("nombres", usuario.nombres);
      setValue("apellidos", usuario.apellidos);
      setValue("telefono", usuario.telefono);
      setValue("correo", usuario.correo);
      setValue("username", usuario.username);
      setValue("documentoIdentidad", usuario.documentoIdentidad);
      setValue("estado", usuario.estado);
      setRolesUsuario(usuario.roles);
    }
  };

  const onSubmit = async () => {
    if (flagAction == ActionTypeEnum.CREATE) {
      const result = getValues();
      result.roles = rolesUsuario;
      try {
        await createUsuario(result);
        reset();
        onCloseForm(true);
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al crear el usuario",
          life: 3000,
        });
      }
    }

    if (flagAction == ActionTypeEnum.UPDATE) {
      const result = getValues();
      result.roles = rolesUsuario;
      try {
        updateUsuario(result, result.id)
        reset();
        onCloseForm(true);
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: "Error al actualizar el usuario",
          life: 3000,
        });
      }
    }
  };

  const onCloseForm = async (updateData?: boolean) => {
    // add condition
    hideDialog(updateData ? updateData : false);
  };

  useEffect(() => {
    initForm();
  }, []);
  return (
    <>
      <form className="w-full mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 p-fluid gap-4 mb-4">
          <div className="">
            <Controller
              name="correo"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
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
          <div>
            <InputController
              name="nombres"
              control={control}
              rules={{ required: "Nombres son requeridos" }}
            />
          </div>
          <div>
            <InputController
              name="apellidos"
              control={control}
              rules={{ required: "Apellidos son requeridos" }}
            />
          </div>
          <div>
            <InputController
              name="telefono"
              control={control}
              rules={{ required: "telefono es requerido" }}
            />
          </div>
          <div>
            <InputController
              name="username"
              control={control}
              rules={{ required: "username es requerido" }}
            />
          </div>
          <div>
            <MultiSelect
                value={rolesUsuario} 
                onChange={(e) => setRolesUsuario(e.value)} 
                options={roles} 
                optionLabel="nombre" 
                placeholder="Seleccione roles para el usuario" 
                maxSelectedLabels={3}
                optionValue="id"
                className="w-full md:w-20rem"
            />
          </div>
        </div>
        <div className="md:w-1/2 flex flex-row justify-end items-end gap-2">
            <Button label="Cancelar" severity="danger" className="w-full" onClick={() => onCloseForm}/>
            <Button label="Guardar Usuario" className="w-full" onClick={() => onSubmit}/>
        </div>
      </form>
    </>
  );
}
