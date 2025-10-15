import { RolService } from "@/services/rol.service";
import { UsuariosService } from "@/services/usuarios.service";
import { PermisoRequest } from "@/types/permiso/permiso-request";
import { RolesRequest } from "@/types/roles/roles-request";
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
  const getRolById = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await RolService.getRolById(id);
      return response;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createRol = async (rolesRquest: RolesRequest) => {
    setLoading(true);
    setError("");
    try {
      const response = await RolService.guardarRol(rolesRquest);
      return response;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRol = async (rolesRquest: RolesRequest, id: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await RolService.updateRol(rolesRquest, id);
      return response;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRol = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await RolService.getRolById(id);
      return response;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPermisos = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await RolService.getpermisos();
      return response;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const crearPermiso = async (permisoRequest: PermisoRequest) => {
    setLoading(true);
    setError("");
    try {
      const response = await RolService.crearPermiso(permisoRequest);
      return response;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getRoles,
    getRolById,
    createRol,
    updateRol,
    deleteRol,
    getPermisos,
    crearPermiso,
    loading,
    error,
  };
};
