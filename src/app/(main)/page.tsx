import Image from "next/image";
import { Button } from "primereact/button";

export default function Home() {
  return (
    <>
    <Button  label="BUTTON HOME" severity="warning"/>
    <label className="text-4xl underline">My Label</label>
    </>
  );
}
