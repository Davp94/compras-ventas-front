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
import { useRouter } from "next/navigation";
import { useInventario } from "@/hooks/useInventario";
import { SucursalResponse } from "@/types/inventario/sucursal.response";
import { AlmacenResponse } from "@/types/inventario/almacen.response";
import { ProductosResponse } from "@/types/inventario/productos.response";

export default function InventarioMain() {
  const [productos, setProductos] = useState<ProductosResponse[] | undefined>([]);
  const [sucursales, setSucursales] = useState<SucursalResponse[] | undefined>([]);
  const [almacenes, setAlmacenes] = useState<AlmacenResponse[] | undefined>([]);
  const [productosDialog, setProductosDialog] = useState<boolean>(false);

  const [selectedSucursal, setSelectedSucursal] = useState<SucursalResponse | null>(null);
  const [selectedAlmacen, setSelectedAlmacen] = useState<AlmacenResponse | null>(null);

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [flagAction, setFlagAction] = useState<number>(0);
  const [totalRecords, setTotalRecords] = useState<number | undefined>(0);
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<any[]>>(null);

  const [lazyState, setLazyState] = useState({
    pageNumber: 1,
    pageSize: 10,
    sortField: "",
    sortOrder: 'ASC' as 'ASC' | 'DESC'
  });
  
  const { getProductosPagination, getAlmacenes, getSucursales, loading, error } = useInventario();

  const initComponent = async () => {
    try {
        const sucursalesRetrieved = await getSucursales();
        setSucursales(sucursalesRetrieved); 
    } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: (error instanceof Error) ? error.message : 'Error al obtener sucursales',
          life: 3000,
        });
    }

  };

  useEffect(() => {
    initComponent();
  }, []);

  useEffect(() => {
    const getAlmacenesFrom = async () => {
        if(selectedSucursal?.id){
            try {
                const almacenesRetrieved = await getAlmacenes(selectedSucursal.id);
                setAlmacenes(almacenesRetrieved);
                setSelectedAlmacen(null);
            } catch (error) {
                toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: (error instanceof Error) ? error.message : 'Error al obtener almacenes',
                life: 3000,
                });
            }
        } else {
            setAlmacenes([]);
            setSelectedAlmacen(null);
            setProductos([]);
            setTotalRecords(0);
        }
    };
    getAlmacenesFrom();
  }, [selectedSucursal]);

    useEffect(() => {
    const fetchProductos = async () => {
        if(selectedAlmacen?.id){
            try {
                const productosRetrieved = await getProductosPagination({
                    ...lazyState,
                    filterValue: globalFilter || null,
                    almacenId: selectedAlmacen.id
                });
                setProductos(productosRetrieved?.content);
                setTotalRecords(productosRetrieved?.totalElements);
            } catch (error) {
                toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: (error instanceof Error) ? error.message : 'Error al obtener productos',
                life: 3000,
                });
            }
        } else {
            setProductos([]);
            setTotalRecords(0);
        }
    };
    fetchProductos();
  }, [selectedAlmacen, lazyState, globalFilter]);

  const openNew = () => {
    setFlagAction(ActionTypeEnum.CREATE);
    setSubmitted(false);
    setProductosDialog(true);
  };

  const hideDialog = (updateData?: boolean) => {
    if (updateData) {
      initComponent();
    }
    setSubmitted(false);
    setProductosDialog(false);
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
