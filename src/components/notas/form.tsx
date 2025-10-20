'use client'
import { useInventario } from "@/hooks/useInventario";
import { useNota } from "@/hooks/useNota";
import { ProductosResponse } from "@/types/inventario/productos.response";
import { ClienteResponse } from "@/types/notas/cliente.response";
import { NotaRequest } from "@/types/notas/nota.request";
import { useRouter } from "next/navigation";
import { AutoComplete } from "primereact/autocomplete";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import InputController from "../common/input-controller";
import { Button } from "primereact/button";
import { useUserStore } from "@/state-management/usuario.state";

export default function NotasForm() {
  const [tipo, setTipo] = useState<string[]>(["COMPRA", "VENTA"]);
  const [productos, setProductos] = useState<ProductosResponse[] | undefined>(
    []
  );
  const [filtertedProdutos, setFilteredProductos] = useState<
    ProductosResponse[] | undefined
  >([]);
  const [clientes, setClientes] = useState<ClienteResponse[] | undefined>([]);
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const { createNota, getClientes } = useNota();
  const { getProductosAlmacen } = useInventario();
  const { user } = useUserStore();

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
      tipoNota: "COMPRA",
      descuento: 0,
      totalCalculado: 0,
      observaciones: "",
      clienteId: 0,
      usuarioId: 0,
      subTotal: 0,
      movimientos: [
        {
          cantidad: 0,
          precioUnitarioVenta: 0,
          observaciones: "",
          precioUnitarioCompra: 0,
          almacenId: 0,
          productoId: 0,
          total: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "movimientos",
  });

  const watchedMovimientos = watch("movimientos");
  const watchedDescuento = watch("descuento");

  const initForm = async () => {
    const productosRetrieved = await getProductosAlmacen(1);
    setProductos(productosRetrieved);
    const clientesRetrieved = await getClientes();
    setClientes(clientesRetrieved);
  };

  const searchProducto = (event: any) => {
    const query = event.query.toLowerCase();
    const filtered = productos?.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(query) ||
        producto.codigoBarra.toLowerCase().includes(query)
    );
    setFilteredProductos(filtered);
  };

  const onProductoSelect = (producto: ProductosResponse, index: number) => {
    console.log('PRODUCTO', producto);
    console.log('INDEX', index)
    setValue(`movimientos.${index}.productoId`, producto.id);
    setValue(`movimientos.${index}.precioUnitarioVenta`, producto.precioVentaActual);
    setValue(`movimientos.${index}.precioUnitarioCompra`, producto.precioVentaActual);
    calculateTotal(index);
  };

  const calculateTotal = (index: number) => {
    const movimiento = getValues(`movimientos.${index}`);
    const cantidad = movimiento.cantidad || 0;
    const precioUnitario = movimiento.precioUnitarioCompra || 0;
    const total = cantidad * precioUnitario;
    setValue(`movimientos.${index}.total`, total);
    calculateTotalGlobal();
  };
  const calculateTotalGlobal = () => {
    const movimientos = getValues("movimientos");
    const subTotal = movimientos.reduce(
      (sum, mov) => sum + (mov.total || 0),
      0
    );
    const descuento = getValues("descuento") || 0;
    const totalFinal = subTotal - descuento;
    setValue("totalCalculado", totalFinal);
    setValue("subTotal", subTotal);
  };

  const addMovimiento = () => {
    append({
      cantidad: 0,
      precioUnitarioVenta: 0,
      observaciones: "",
      precioUnitarioCompra: 0,
      almacenId: 0,
      productoId: 0,
      total: 0,
    });
  };

  const removeMovimiento = (index: number) => {
    remove(index);
    calculateTotalGlobal();
  };

  const onSubmit = async () => {
    try {
      const requestData = getValues();
      requestData.usuarioId = user!.id
      await createNota(requestData);
      toast.current?.show({
        severity: "success",
        summary: "Exito",
        detail: "Nota Creada exitosamente",
        life: 3000,
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error instanceof Error ? error.message : "Error al crear notas",
        life: 3000,
      });
    }
  };

  const onCloseForm = async () => {
    router.back();
  };

  useEffect(() => {
    initForm();
  }, []);

  useEffect(() => {
    calculateTotalGlobal();
  }, [watchedMovimientos, watchedDescuento]);

  return (
    <>
      <Toast ref={toast} />
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-800 text-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-2">🏪 Crear Nota</h1>
          <p className="text-blue-100">
            Creacion de notas de compra/venta con movimientos de inventario
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card title="Informacion de la Nota">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Controller
                name="tipoNota"
                control={control}
                rules={{ required: "El campo es requerido" }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      id={field.name}
                      {...field}
                      options={tipo}
                      placeholder="Seleccione tipo"
                      className="w-full"
                    />
                    {fieldState.error && (
                      <small>{fieldState.error.message}</small>
                    )}
                  </>
                )}
              />
              <Controller
                name="clienteId"
                control={control}
                rules={{ required: "El campo es requerido" }}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      id={field.name}
                      {...field}
                      options={clientes}
                      optionLabel="razonSocial"
                      optionValue="id"
                      placeholder="Seleccione el cliente"
                      className="w-full"
                    />
                    {fieldState.error && (
                      <small>{fieldState.error.message}</small>
                    )}
                  </>
                )}
              />
              <Controller
                name="descuento"
                control={control}
                rules={{ required: "El campo es requerido" }}
                render={({ field, fieldState }) => (
                  <>
                    <InputNumber
                      id={field.name}
                      {...field}
                      placeholder="Añada el descuento"
                      className="w-full"
                    />
                    {fieldState.error && (
                      <small>{fieldState.error.message}</small>
                    )}
                  </>
                )}
              />
            </div>
            <div className="mt-4">
              <Controller
                name="observaciones"
                control={control}
                rules={{ required: "El campo es requerido" }}
                render={({ field, fieldState }) => (
                  <>
                    <InputTextarea
                      id={field.name}
                      {...field}
                      rows={3}
                      placeholder="Ingrese observaciones adicionales"
                      className="w-full"
                    />
                    {fieldState.error && (
                      <small>{fieldState.error.message}</small>
                    )}
                  </>
                )}
              />
            </div>
          </Card>
          <Card
            title="Productos y Movimientos"
            subTitle={
              <Button
                icon="pi pi-plus"
                label="Agregar producto"
                onClick={() => addMovimiento()}
                size="small"
              />
            }
          >
            <div>
              {fields.map((field, index) => (
                <div key={field.id}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <Controller
                      name={`movimientos.${index}.productoId`}
                      control={control}
                      rules={{ required: "El campo es requerido" }}
                      render={({ field, fieldState }) => (
                        <>
                          <AutoComplete
                            field="nombre"
                            value={productos?.find((p) => p.id === field.value)}
                            placeholder="Buscar producto ..."
                            className="w-full"
                            suggestions={filtertedProdutos}
                            completeMethod={searchProducto}
                            onSelect={(e) => onProductoSelect(e.value, index)}
                            dropdown
                          />
                          {fieldState.error && (
                            <small>{fieldState.error.message}</small>
                          )}
                        </>
                      )}
                    />
                    <Controller
                      name={`movimientos.${index}.cantidad`}
                      control={control}
                      rules={{ required: "Cantidad es requerido" }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputNumber
                            id={field.name}
                            {...field}
                            className="w-full"
                            onChange={(e) => {
                              field.onChange(e.value);
                              calculateTotal(index);
                            }}
                          />
                          {fieldState.error && (
                            <small>{fieldState.error.message}</small>
                          )}
                        </>
                      )}
                    />
                    <Controller
                      name={`movimientos.${index}.precioUnitarioCompra`}
                      control={control}
                      rules={{ required: "El campo es requerido" }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputNumber
                            id={field.name}
                            {...field}
                            className="w-full"
                          />
                          {fieldState.error && (
                            <small>{fieldState.error.message}</small>
                          )}
                        </>
                      )}
                    />
                    <div>
                      <label>Total Producto</label>
                      <div>
                        Bs
                        {watch(`movimientos.${index}.total`).toFixed(2) ||
                          "0.00"}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <InputController
                      name={`movimientos.${index}.observaciones`}
                      control={control}
                      rules={null}
                    />
                    {fields.length > 1 && (
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        size="small"
                        onClick={() => removeMovimiento(index)}
                        className="mt-6"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Resumen">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="text-center">
                Bs {watch(`subTotal`).toFixed(2) || "0.00"}
              </div>
              <div className="text-center">
                Bs {watch(`descuento`).toFixed(2) || "0.00"}
              </div>
              <div className="text-center">
                Bs {watch(`totalCalculado`).toFixed(2) || "0.00"}
              </div>
            </div>
          </Card>
          <div>
            <Button
              severity="danger"
              label="Cancelar"
              onClick={() => onCloseForm()}
              className="mt-6"
            />
            <Button
              type="submit"
              label="Guardar Nota"
              className="mt-6"
            />
          </div>
        </form>
      </div>
    </>
  );
}
