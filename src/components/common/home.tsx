'use client'
import { useUserStore } from "@/state-management/usuario.state";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useUsuarios } from "@/hooks/useUsuario";
import { UsuarioResponse } from "@/types/usuarios/usuario.response";
export default function Home() {
  const [usuario, setUsuario] = useState<UsuarioResponse | undefined>();  
  const {  user, setUser } = useUserStore();
  const {getUsuarioById} = useUsuarios();

  const initComponent = async () => {
    const userId = Cookies.get('identifier') as unknown as number;
    const userData = await getUsuarioById(userId);
    userData!.id = userId;
    if(userData !== undefined){
        setUser(userData);
    }
    setUsuario(userData);
  }
  useEffect(() => {
    initComponent();
  },[])  
  return (
    <>
        <h1>BIENVENIDO</h1>
        <p>{usuario?.nombres}</p>
        <p>{usuario?.apellidos}</p>
    </>
  );
}
