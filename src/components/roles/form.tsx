import { ActionTypeEnum } from "@/constant/enum/action-type.enum";

import { Toast } from "primereact/toast";
import { RefObject, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputController from "../common/input-controller";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";

import { Sidebar } from "primereact/sidebar";
import { RolesResponse } from "@/types/roles/roles.response";
import { PermisoResponse } from "@/types/permiso/permiso-response";
import { useRol } from "@/hooks/useRol";
import { RolesRequest } from "@/types/roles/roles-request";
import PermisosForm from "./permiso-form";
interface RolesFormPros {
  rolId: number | null;
  hideDialog: (updateData?: boolean) => void;
  toast: RefObject<Toast | null>;
  flagAction: number;
}
export default function RolesForm({
  rolId,
  hideDialog,
  toast,
  flagAction,
}: RolesFormPros) {
  const [rol, setRol] = useState<RolesResponse | null>(null);
  const [permisos, setPermisos] = useState<PermisoResponse[]>([]);
  const [permisosRol, setPermisosRol] = useState<any>("");
  const [permisosDrawer, setPermisosDrawer] = useState<boolean>(false);
  const { loading, createRol, getRolById, getPermisos, updateRol } = useRol();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      id: null,
      nombre: "",
      descripcion: "",
    },
  });

  const initForm = async () => {
    const permisosRetrieved = await getPermisos();
    setPermisos(permisosRetrieved);
    try {
      if (rolId != null) {
        const rolRetrieved = await getRolById(rolId);
        setRol(rolRetrieved);
        setPermisosRol(
          permisosRetrieved.filter((permiso) =>
            rolRetrieved.permisosIds.includes(permiso.id)
          )
        );
        setValue("nombre", rolRetrieved.nombre);
        setValue("descripcion", rolRetrieved.descripcion);
      }
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Rejected",
        detail: "Error al recuperar rol",
        life: 3000,
      });
    }
  };

  const onSubmit = async () => {
    if (flagAction == ActionTypeEnum.CREATE) {
      const result: RolesRequest = getValues();
      result.permisosIds = permisosRol.map((permisoRol: PermisoResponse) => permisoRol.id);
      try {
        await createRol(result);
        reset();
        onCloseForm(true);
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Rejected",
          detail: "Error al crear el rol",
          life: 3000,
        });
      }
    }
    if (flagAction == ActionTypeEnum.UPDATE) {
      const resultUpdate: RolesRequest = getValues();
      resultUpdate.permisosIds = permisosRol.map((permisoRol: PermisoResponse) => permisoRol.id);
      try {
        await updateRol(resultUpdate, rolId as number);
        reset();
        onCloseForm(true);
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Rejected",
          detail: "Error al actualizar el rol",
          life: 3000,
        });
      }
      onCloseForm(true);
    }
  };

  const onCloseForm = async (updateData?: boolean) => {
    hideDialog(updateData ? updateData : false);
  };

  const onCloseDrawer = async (updateData?: boolean) => {
    if(updateData){
      const permisosRetrieved = await getPermisos();
      setPermisos(permisosRetrieved);
    }
    setPermisosDrawer(false);
  }

  useEffect(() => {
    initForm();
  }, []);

  return (
    <>
      <form className="w-full mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 p-fluid gap-4 mb-4">
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
          <div className="">
            <MultiSelect
              value={permisosRol}
              onChange={(e) => setPermisosRol(e.value)}
              options={permisos}
              optionLabel="nombre"
              placeholder="Selecciones permisos para el rol"
              maxSelectedLabels={3}
              className="w-full md:w-20rem"
            />
          </div>
          <div>
            <Button
            type="button"
            label="Crear Permiso"
            className="w-full"
            onClick={()=>setPermisosDrawer(true)}
          />
          </div>
          {permisosRol.length > 0 && (
            <div className="w-full">
              <h2>Permisos Seleccionados:</h2>
            
            {permisosRol.map((permisoRol: PermisoResponse) => (
              <label key={permisoRol.id}>{permisoRol.nombre} -</label>
            ))}
            </div>
          )}
        </div>
        <div className="md:w-1/2 flex flex-row justify-end items-end gap-2">
          <Button
            type="button"
            label="Cancelar"
            severity="danger"
            className="w-full"
            onClick={() => onCloseForm(false)}
          />
          <Button
            type="button"
            label="Guardar Rol"
            className="w-full"
            onClick={onSubmit}
          />
        </div>
      </form>
      <Sidebar
        visible={permisosDrawer}
        position="right"
        onHide={() => onCloseDrawer(false)}
      >
        <h2>Permisos Form</h2>
        <PermisosForm hideDrawer={onCloseDrawer} toast={toast} />
      </Sidebar>
    </>
  );
}
