"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { RadioButton, RadioButtonChangeEvent } from "primereact/radiobutton";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { UsuarioResponse } from "@/types/usuarios/usuario.response";
import { ActionTypeEnum } from "@/constant/enum/action-type.enum";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useUsuarios } from "@/hooks/useUsuario";
import { RolesResponse } from "@/types/roles/roles.response";
import { useRol } from "@/hooks/useRol";

export default function RolesHome() {
  const [roles, setRoles] = useState<RolesResponse[]>([]);
  const [roleDialog, setRolesDialog] = useState<boolean>(false);
  const [rol, setRol] = useState<RolesResponse | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [flagAction, setFlagAction] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<RolesResponse[]>>(null);

  //TODO add hook Roles
  const { getRoles } = useRol();

  const initComponent = async () => {
    const roles = await getRoles();
    setRoles(roles);
  };
  useEffect(() => {
    initComponent();
  }, []);

  const openNew = () => {
    setFlagAction(ActionTypeEnum.CREATE);
    setSubmitted(false);
    setRolesDialog(true);
  };

  const hideDialog = (updateData?: boolean) => {
    if (updateData) {
      initComponent();
    }
    setRol(null);
    setSubmitted(false);
    setRolesDialog(false);
  };

  const editRol = (rol: RolesResponse) => {
    setFlagAction(ActionTypeEnum.UPDATE);
    setRol({ ...rol });
    setRolesDialog(true);
  };

  const viewRol = (rol: RolesResponse) => {
    setFlagAction(ActionTypeEnum.READ);
    setRol({ ...rol });
    setRolesDialog(true);
  };

  const confirmDeleteRol = (rol: RolesResponse) => {
    confirmDialog({
      message: "Esta seguro de borrar el rol?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => deleteRol(rol),
      reject: () =>
        toast.current?.show({
          severity: "warn",
          summary: "Operacion Rechazada",
          detail: "Rol no Eliminado",
          life: 3000,
        }),
    });
  };

  const deleteRol = async (rol: RolesResponse) => {
    await deleteRolF(rol.id);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Rol eliminado",
      life: 3000,
    });
    initComponent();
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    );
  };

  const actionBodyTemplate = (rowData: RolesResponse) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editRol(rowData)}
        />
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          className="mr-2"
          severity="info"
          onClick={() => viewRol(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteRol(rowData)}
        />
      </>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Roles</h4>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search..."
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            setGlobalFilter(target.value);
          }}
        />
      </IconField>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>

        <DataTable
          ref={dt}
          value={roles}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
        >
          <Column
            field="nombre"
            header="Nombre"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="descripcion"
            header="Descripcion"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={roleDialog}
        style={{ width: "60vw" }}
        header="Rol Details"
        modal
        className="p-fluid"
        onHide={hideDialog}
      >
        {flagAction == ActionTypeEnum.READ && <UsuariosView usuario={usuario} hideDialog={hideDialog}/>}
        {[ActionTypeEnum.CREATE, ActionTypeEnum.UPDATE].includes(
          flagAction
        ) && <UsuariosForm usuario={usuario} flagAction={flagAction} toast={toast} hideDialog={hideDialog}/>}
      </Dialog>
      <ConfirmDialog />
    </div>
  );
}
