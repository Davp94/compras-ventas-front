"use client";

import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { DataTable, DataTablePageEvent, DataTableSortEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ActionTypeEnum } from "@/constant/enum/action-type.enum";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useRouter } from "next/navigation";
import { useInventario } from "@/hooks/useInventario";
import { SucursalResponse } from "@/types/inventario/sucursal.response";
import { AlmacenResponse } from "@/types/inventario/almacen.response";
import { ProductosResponse } from "@/types/inventario/productos.response";
import { Dropdown } from "primereact/dropdown";
import ProductosForm from "./form";

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

  const onPageChange = (event: DataTablePageEvent) => {
    setLazyState({
      ...lazyState,
      pageNumber: event.page ? event.page + 1 : 1,
      pageSize: event.rows
    })
  }

  const onSort = (event: DataTableSortEvent) => {
    setLazyState({
      ...lazyState,
      sortField: event.sortField,
      sortOrder: event.sortOrder === 1 ? 'ASC' : 'DESC'
    })
  }

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
        <Button
          label="Stock"
          icon="pi pi-plus"
          severity="info"
          onClick={() => router.push(`nueva-nota?tipo=COMPRA&almacenId=${selectedAlmacen?.id}`)}
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

  const actionBodyTemplate = (rowData: ProductosResponse) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => console.log('')}
        />
        <Button
          icon="pi pi-eye"
          rounded
          outlined
          className="mr-2"
          severity="info"
          onClick={() => console.log('')}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => console.log('')}
        />
      </>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Manage Inventario</h4>
      <Dropdown 
        value={selectedSucursal}
        onChange={(e) => setSelectedSucursal(e.value)}
        options={sucursales}
        optionLabel="nombre"
        placeholder="Seleccione una sucursal"
        className="w-full md:w-14rem"
      />
      <Dropdown 
        value={selectedAlmacen}
        onChange={(e) => setSelectedAlmacen(e.value)}
        options={almacenes}
        optionLabel="nombre"
        placeholder="Seleccione un almacen"
        className="w-full md:w-14rem"
      />
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
          value={productos}
          dataKey="id"
          paginator
          rows={lazyState.pageSize}
          rowsPerPageOptions={[10, 20, 50]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
          globalFilter={globalFilter}
          header={header}
          lazy
          totalRecords={totalRecords}
          onPage={onPageChange}
          onSort={onSort}
          sortField={lazyState.sortField}
          sortOrder={lazyState.sortOrder === 'ASC' ? 1 : -1}
        >
          <Column
            field="nombre"
            header="Nombre"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="codigoBarra"
            header="Codigo Barra"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="marca"
            header="Marca"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="nombreCategoria"
            header="Categoria"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="precio"
            header="Precio"
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
        visible={productosDialog}
        style={{ width: "60vw" }}
        header="Productos Almacen Form"
        modal
        className="p-fluid"
        onHide={hideDialog}
      >
        {[ActionTypeEnum.CREATE, ActionTypeEnum.UPDATE].includes(
          flagAction
        ) && <ProductosForm />}
      </Dialog>
    </div>
  );
}
