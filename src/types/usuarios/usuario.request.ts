export interface UsuarioRequest {
    nombres : string;
    apellidos: string;
    fechaNacimiento: string;
    genero: string;
    telefono: string;
    direccion: string;
    documentoIdentidad: string;
    tipoDocumento: string;
    nacionalidad: string;
    correo: string;
    password: string;
    roles: number[];
}
