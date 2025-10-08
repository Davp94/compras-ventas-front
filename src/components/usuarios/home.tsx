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
import UsuariosView from "./view";
import UsuariosForm from "./form";
import { useUsuarios } from "@/hooks/useUsuario";

export default function UsuariosHome() {
  const [usuarios, setUsuarios] = useState<any>([]);
  const [usuariosDialog, setUsuariosDialog] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [flagAction, setFlagAction] = useState<number>(0);
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<UsuarioResponse[]>>(null);

  const { getUsuarios, deleteUsuario: deleteUser, loading } = useUsuarios();

  const initComponent = async () => {
    const usuarios = await getUsuarios();
    console.log('USUARIOS RESPONSE', usuarios);
    setUsuarios(usuarios);
  };
  useEffect(() => {
    initComponent();
  }, []);

  const openNew = () => {
    setFlagAction(ActionTypeEnum.CREATE);
    setSubmitted(false);
    setUsuariosDialog(true);
  };

  const hideDialog = (updateData?: boolean) => {
    if (updateData) {
      initComponent();
    }
    setUsuario(null);
    setSubmitted(false);
    setUsuariosDialog(false);
  };

  const editUsuario = (usuario: UsuarioResponse) => {
    setFlagAction(ActionTypeEnum.UPDATE);
    setUsuario({ ...usuario });
    setUsuariosDialog(true);
  };

  const viewUsuario = (usuario: UsuarioResponse) => {
    setFlagAction(ActionTypeEnum.READ);
    setUsuario({ ...usuario });
    setUsuariosDialog(true);
  };

  const confirmDeleteProduct = (usuario: UsuarioResponse) => {
    confirmDialog({
      message: "Esta seguro de borrar el usuario?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept: () => deleteUsuario(usuario),
      reject: () =>
        toast.current?.show({
          severity: "warn",
          summary: "Operacion Rechazada",
          detail: "Usuario no Eliminado",
          life: 3000,
        }),
    });
  };

  const deleteUsuario = async (usuario: UsuarioResponse) => {
    await deleteUser(usuario.id);
    toast.current?.show({
      severity: "success",
      summary: "Successful",
      detail: "Usuario eliminado",
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

  const statusBodyTemplate = (rowData: UsuarioResponse) => {
    return <Tag value={rowData.estado} severity={getSeverity(rowData)}></Tag>;
  };

  const actionBodyTemplate = (rowData: UsuarioResponse) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editUsuario(rowData)}
        />
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          className="mr-2"
          severity="info"
          onClick={() => viewUsuario(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </>
    );
  };

  const getSeverity = (rowDAta: UsuarioResponse) => {
    switch (rowDAta.estado) {
      case "INACTIVO":
        return "danger";
      case "ACTIVO":
        return "success";
      case "OBSERVADO":
        return "warning";
      default:
        return null;
    }
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Usuarios</h4>
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
          value={usuarios}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
          globalFilter={globalFilter}
          header={header}
        >
          <Column
            field="nombres"
            header="Nombres"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="apellidos"
            header="Apellidos"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="correo"
            header="Correo"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="telefono"
            header="Telefono"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="documentoIdentidad"
            header="Documento Identidad"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="estado"
            header="Estado"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={usuariosDialog}
        style={{ width: "60vw" }}
        header="Product Details"
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
