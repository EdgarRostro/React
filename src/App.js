import * as React from "react";
import { useState } from "react";
import { suma, resta, ComponenteSimple } from "./funciones/funcionesSimples";
export default function App() {
  const [conteo, funcionConteo] = useState(0);
  const [cadenas, funcionCadena] = useState("cadena");
  const [arreglos, funcionArreglo] = useState([
    { nombre: "Ruben" },
    { nombre: "Sergio" },
  ]);
  const [objeto, funcionObjeto] = useState({ nombre: "Ruben" });

  return (
    <div>
      
      {suma()}
      
      <ComponenteSimple />
      
      <button onClick={() => funcionConteo(conteo + 1)}>Sumatoria</button>
    </div>
  );
}