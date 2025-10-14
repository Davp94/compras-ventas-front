import { apiClient } from "@/config/service.config";
import { ClienteResponse } from "@/types/notas/cliente.response";
import { NotaRequest } from "@/types/notas/nota.request";
import { NotaResponse } from "@/types/notas/nota.response";

export class NotaService {
    public static async getNotas(): Promise<NotaResponse[]> {
        try {
            const response = await apiClient.get<NotaResponse[]>('/nota');
            return response.data
        } catch (error) {
            throw new Error('Error al obtener notas');
        }
    }

    public static async getClientes(): Promise<ClienteResponse[]> {
        try {
            const response = await apiClient.get<ClienteResponse[]>('/nota/cliente');
            return response.data
        } catch (error) {
            throw new Error('Error al obtener clientes');
        }
    }

    public static async createNota(notaRequest: NotaRequest): Promise<NotaResponse> {
        try {
            const response = await apiClient.post<NotaResponse>('/nota', notaRequest);
            return response.data
        } catch (error) {
            throw new Error('Error al crear nota');
        }
    }
}