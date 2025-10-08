import { apiClient } from "@/config/service.config";
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
    
    //   public static async createUsuario(
    //     usuarioRequest: UsuarioRequest
    //   ): Promise<UsuarioResponse> {
    //     try {
    //       const response = await apiClient.post<UsuarioResponse>(
    //         "/usuarios",
    //         usuarioRequest
    //       );
    //       return response.data;
    //     } catch (error) {
    //       throw new Error("Error al crear el usuario");
    //     }
    //   }
    
    //   public static async updateUsuario(usuarioRequest: UsuarioRequest, id: number): Promise<UsuarioResponse> {
    //     try {
    //       const response = await apiClient.put<UsuarioResponse>(
    //         `/usuarios/${id}`,
    //         usuarioRequest
    //       );
    //       return response.data;
    //     } catch (error) {
    //       throw new Error("Error al actualizar el usuario");
    //     }
    //   }
    
    //   public static async deleteUsuario(id: number): Promise<void> {
    //     try {
    //       const response = await apiClient.delete<void>(`/usuarios/${id}`)
    //       return response.data
    //     } catch (error) {
    //       throw new Error("Error al borrar el usuario");
    //     }
    //   }
}