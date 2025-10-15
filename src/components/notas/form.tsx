import { useInventario } from "@/hooks/useInventario";
import { useNota } from "@/hooks/useNota";
import { ProductosResponse } from "@/types/inventario/productos.response";
import { ClienteResponse } from "@/types/notas/cliente.response";
import { NotaRequest } from "@/types/notas/nota.request";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";

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
    const productosRetrieved = await getProductosAlmacen(0);
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
    setValue(`movimientos.${index}.productoId`, producto.id);
    setValue(`movimientos.${index}.precioUnitarioVenta`, producto.precioVenta);
    setValue(`movimientos.${index}.precioUnitarioCompra`, producto.precioVenta);
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

  const onSubmit = async (data: NotaRequest) => {
    try {
      await createNota(data);
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
      <div>
        <div>
          <h1>Crear Nota</h1>
          <p>Creacion de notas de compra/venta con movimientos de inventario</p>
        </div>
        <form>
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
          <Card title="Productos y Movimientos">
                
          </Card>
        </form>
      </div>
    </>
  );
}
