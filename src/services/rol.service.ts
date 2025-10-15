import { apiClient } from "@/config/service.config";
import { PermisoRequest } from "@/types/permiso/permiso-request";
import { PermisoResponse } from "@/types/permiso/permiso-response";
import { RolesRequest } from "@/types/roles/roles-request";
import { RolesResponse } from "@/types/roles/roles.response";

export class RolService {
  public static async getRoles(): Promise<RolesResponse[]> {
    try {
      const response = await apiClient.get<RolesResponse[]>("/rol");
      return response.data;
    } catch (error) {
      throw new Error("Error recuperando los roles");
    }
  }

  public static async getRolById(id: number): Promise<RolesResponse> {
    try {
      const response = await apiClient.get<RolesResponse>(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Error obtener roles");
    }
  }

  public static async guardarRol(
    rolRequest: RolesRequest
  ): Promise<RolesResponse> {
    try {
      const response = await apiClient.post<RolesResponse>(
        "/roles",
        rolRequest
      );
      return response.data;
    } catch (error) {
      throw new Error("Error creando roles");
    }
  }

  public static async updateRol(
    rolRequest: RolesRequest,
    id: number
  ): Promise<RolesResponse> {
    try {
      const response = await apiClient.put<RolesResponse>(
        `/roles/${id}`,
        rolRequest
      );
      return response.data;
    } catch (error) {
      throw new Error("Error actualizar roles");
    }
  }

  public static async getpermisos(): Promise<PermisoResponse[]> {
    try {
      const response = await apiClient.get<PermisoResponse[]>(
        "/roles/permisos"
      );
      return response.data;
    } catch (error) {
      throw new Error("Error al recuperar permisos");
    }
  }

  public static async crearPermiso(
    permisoRequest: PermisoRequest
  ): Promise<PermisoResponse> {
    try {
      const response = await apiClient.post<PermisoResponse>(
        "/roles/permiso",
        permisoRequest
      );
      return response.data;
    } catch (error) {
      throw new Error("Error creando permisos");
    }
  }
}
