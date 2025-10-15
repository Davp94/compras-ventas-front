import { Toast } from "primereact/toast";
import { RefObject, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import InputController from "../common/input-controller";
import { Button } from "primereact/button";
import { useRol } from "@/hooks/useRol";
import { PermisoRequest } from "@/types/permiso/permiso-request";

interface PermisosFormPros {
  hideDrawer: (updateData?: boolean) => void;
  toast: RefObject<Toast | null>;
}
export default function PermisosForm({ hideDrawer, toast }: PermisosFormPros) {
  const { crearPermiso } = useRol();
  const {
    control,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const onSubmit = async () => {
    const result: PermisoRequest = getValues();
    try {
      await crearPermiso(result);
      toast.current?.show({
        severity: "success",
        summary: "Permiso Creado",
        detail: "Permiso Creado exitosamente",
        life: 3000,
      });
      reset();
      onCloseForm(true);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Rejected",
        detail: "Error al crear el permiso",
        life: 3000,
      });
    }
  };

  const onCloseForm = async (updateData?: boolean) => {
    hideDrawer(updateData ? updateData : false);
  };

  useEffect(() => {}, []);

  return (
    <>
      <form className="w-full mt-6">
        <div className="grid grid-cols-1 p-fluid gap-4 mb-4">
          <div className="">
            <InputController
              name="nombre"
              control={control}
              rules={{
                required: "Nombre es requerido",
              }}
              label="Nombre*"
              placeholder="Nombre"
            />
          </div>
          <div className="">
            <InputController
              name="descripcion"
              control={control}
              rules={{
                required: "descripcion es requerido",
              }}
              label="Descripcion*"
              placeholder="descripcion"
            />
          </div>
        </div>
        <div className="flex flex-row justify-end items-end gap-2">
          <Button
            type="button"
            label="Cancelar"
            severity="danger"
            className="w-full"
            onClick={() => onCloseForm(false)}
          />
          <Button
            type="button"
            label="Guardar Permiso"
            className="w-full"
            onClick={onSubmit}
          />
        </div>
      </form>
    </>
  );
}
