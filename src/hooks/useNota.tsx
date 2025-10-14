import { NotaService } from "@/services/nota.service";
import { NotaRequest } from "@/types/notas/nota.request";
import { useState } from "react";

export const useNota = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getNotas = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await NotaService.getNotas();
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

  const getClientes = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await NotaService.getClientes();
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
  const createNota = async (notaRequest: NotaRequest) => {
    setLoading(true);
    setError("");
    try {
      const response = await NotaService.createNota(notaRequest);
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
    getNotas,
    getClientes,
    createNota,
    loading,
    error
  }
};
