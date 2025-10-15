import { apiClient } from "@/config/service.config";
import { AlmacenResponse } from "@/types/inventario/almacen.response";
import { ProductosResponse } from "@/types/inventario/productos.response";
import { SucursalResponse } from "@/types/inventario/sucursal.response";
import { PaginationResponse } from "@/types/paginacion/pagination.response";

export class InventarioService {

    public static async getProductos(params: {
        pageNumber?: number;
        pageSize?: number;
        sortField?: string;
        sortOrder?: 'ASC' | 'DESC';
        filterValue?: string;
        almacenId?: number;
        nombre?: string;
        descripcion?: string;
        codigoBarra?: string;
        marca?: string;
        nombreCategoria?: string;
    }): Promise<PaginationResponse<ProductosResponse>> {
        try {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(
                    ([_, value]) => value !== undefined && value !== null && value !== ''
                )
            );
            const response = await apiClient.get<PaginationResponse<ProductosResponse>>(
                '/producto/paginacion', {params: cleanParams}
            );
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener los productos');
        }
    }

    public static async getProductosAlmacen(almacenId: number): Promise<ProductosResponse[]>{
         try {
            const response = await apiClient.get<ProductosResponse[]>(`/productos/almacen/${almacenId}`);
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener productos');
        }
    }

    public static async getSucursales(): Promise<SucursalResponse[]>{
        try {
            const response = await apiClient.get<SucursalResponse[]>('/sucursal');
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener sucursales');
        }
    }


    public static async getAlmacenes(sucursalId: number): Promise<AlmacenResponse[]>{
        try {
            const response = await apiClient.get<AlmacenResponse[]>('/sucursal/almacen');
            return response.data;
        } catch (error) {
            throw new Error('Error al obtener los almacenes');
        }
    }
}