import { apiClient } from "@/config/service.config";
import { UsuarioRequest } from "@/types/usuarios/usuario.request";
import { UsuarioResponse } from "@/types/usuarios/usuario.response";

export class UsuariosService {
  public static async getUsuarios(): Promise<UsuarioResponse[]> {
    try {
      const response = await apiClient.get<UsuarioResponse[]>("/usuarios");
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
        "/usuarios",
        usuarioRequest
      );
      return response.data;
    } catch (error) {
      throw new Error("Error al crear el usuario");
    }
  }

  public static updateUsuario() {}

  public static deleteUsuario() {}
}
