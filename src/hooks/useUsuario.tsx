import { UsuariosService } from "@/services/usuarios.service";
import { UsuarioRequest } from "@/types/usuarios/usuario.request";
import { useState } from "react";

export const useUsuarios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await UsuariosService.getUsuarios();
      return response;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const createUsuario = async (usuarioRequest: UsuarioRequest) => {
    setLoading(true);
    setError("");
    try {
      const response = await UsuariosService.createUsuario(usuarioRequest);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUsuario = async (usuarioRequest: UsuarioRequest, id: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await UsuariosService.updateUsuario(usuarioRequest, id);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUsuario = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await UsuariosService.deleteUsuario(id);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    loading,
    error
  }
};
