import { UsuarioResponse } from "@/types/usuarios/usuario.response";
import { create } from "zustand";

interface UserState {
    user: UsuarioResponse | null;
    setUser: (user: UsuarioResponse) => void;
    removeUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    setUser: (user) => set({user}),
    removeUser: () => set({user: null})
}))