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
import { NotaResponse } from "@/types/notas/nota.response";
import { useRouter } from "next/navigation";
import { useNota } from "@/hooks/useNota";

export default function NotasHome() {
  const [notas, setNotas] = useState<NotaResponse[] | undefined>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<NotaResponse[]>>(null);

  const { getNotas } = useNota();

  const initComponent = async () => {
    try {
      const notas = await getNotas();
      setNotas(notas);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          error instanceof Error ? error.message : "Error al obtener notas",
        life: 3000,
      });
    }
  };
  useEffect(() => {
    initComponent();
  }, []);

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const rightToolbarTemplate = () => {
    return (
      <>
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
        <Button
          label="Añadir"
          icon="pi pi-plus"
          severity="info"
          onClick={() =>
            router.push(
              `nueva-nota?tipo=VENTA`
            )
          }
        />
      </>
    );
  };

  const statusBodyTemplate = (rowData: NotaResponse) => {
    return (
      <Tag value={rowData.estadoNota} severity={getSeverity(rowData)}></Tag>
    );
  };

  const getSeverity = (rowDAta: NotaResponse) => {
    switch (rowDAta.estadoNota) {
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
      <h4 className="m-0">Notas de Compra/Venta</h4>
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
        <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>

        <DataTable
          ref={dt}
          value={notas}
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
            field="id"
            header="Codigo Nota"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="fechaEmision"
            header="Fecha Emision"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="tipoNota"
            header="Tipo Nota"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="observaciones"
            header="observaciones"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="estadoNota"
            header="Estado"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
