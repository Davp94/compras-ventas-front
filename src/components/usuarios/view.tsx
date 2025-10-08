import { UsuarioResponse } from "@/types/usuarios/usuario.response";
import { Button } from "primereact/button";

interface UsuariosViewProps {
    usuario: UsuarioResponse | null,
    hideDialog: () => void
}
export default function UsuariosView({usuario, hideDialog}: UsuariosViewProps) {
    return (
        <>
            <p>{JSON.stringify(usuario)}</p>
            <Button label="Cerrar" onClick={hideDialog}/>
        </>
    );
} 