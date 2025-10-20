import { apiClient } from "@/config/service.config";
import { UsuarioRequest } from "@/types/usuarios/usuario.request";
import { UsuarioResponse } from "@/types/usuarios/usuario.response";

export class UsuariosService {
  public static async getUsuarios(): Promise<UsuarioResponse[]> {
    try {
      const response = await apiClient.get<UsuarioResponse[]>("/usuario");
      return response.data;
    } catch (error) {
      throw new Error("Error recuperando el usuario");
    }
  }

    public static async getUsuarioById(id: number): Promise<UsuarioResponse> {
    try {
      const response = await apiClient.get<UsuarioResponse>(`/usuario/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Error recuperando el usuario");
    }
  }

  public static async createUsuario(
    usuarioRequest: UsuarioRequest
  ): Promise<UsuarioResponse> {
    try {
      const response = await apiClient.post<UsuarioResponse>(
        "/usuario",
        usuarioRequest
      );
      return response.data;
    } catch (error) {
      throw new Error("Error al crear el usuario");
    }
  }

  public static async updateUsuario(usuarioRequest: UsuarioRequest, id: number): Promise<UsuarioResponse> {
    try {
      const response = await apiClient.put<UsuarioResponse>(
        `/usuario/${id}`,
        usuarioRequest
      );
      return response.data;
    } catch (error) {
      throw new Error("Error al actualizar el usuario");
    }
  }

  public static async deleteUsuario(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<void>(`/usuario/${id}`)
      return response.data
    } catch (error) {
      throw new Error("Error al borrar el usuario");
    }
  }
}
