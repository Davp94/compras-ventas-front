import { RolService } from "@/services/rol.service";
import { UsuariosService } from "@/services/usuarios.service";
import { UsuarioRequest } from "@/types/usuarios/usuario.request";
import { useState } from "react";

export const useRol = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await RolService.getRoles();
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
    getRoles,
    loading,
    error
  }
};
