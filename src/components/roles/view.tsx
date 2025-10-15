"use client";

import { RolesResponse } from "@/types/roles/roles.response";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
interface RolesViewProps {
  rol: RolesResponse | null;
  hideDialog: () => void;
}
export default function RolesView({ rol, hideDialog }: RolesViewProps) {
  return (
    <>
      <p>{JSON.stringify(rol)}</p>
      <Button label="Cerrar" onClick={hideDialog} />
    </>
  );
}
