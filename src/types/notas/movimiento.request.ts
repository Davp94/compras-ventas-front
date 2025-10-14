export interface MovimientoRequest {
    cantidad: number;
    precioUnitarioVenta: number;
    observaciones: string;
    precioUnitarioCompra: number;
    almacenId: number;
    productoId: number;
}