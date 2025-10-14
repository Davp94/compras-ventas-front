import { MovimientoRequest } from "./movimiento.request";

export interface NotaRequest {
    tipoNota: string;
    descuento: number;
    totalCalculado: number;
    observaciones: string;
    clienteId: number;
    usuarioId: number;
    movimientos: MovimientoRequest[];
}