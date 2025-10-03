export interface UsuarioResponse {
    id: number;
    correo: string;
    username: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    documentoIdentidad: string;
    estado: string;
    roles: number[];
}