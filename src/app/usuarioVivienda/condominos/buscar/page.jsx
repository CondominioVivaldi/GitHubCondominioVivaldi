// src/app/usuarioVivienda/condominos/buscar/page.jsx

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Pagina para que cargar los datos del condomino cuyo usuario este activo
export default function BuscarCondomino() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [condomino, setCondomino] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCondomino = async () => {
      try {
        const response = await fetch("/api/usuarioVivienda/condominos/activo");
        if (response.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        if (!response.ok) {
          throw new Error("Error al obtener el condomino activo");
        }
        const data = await response.json();
        setCondomino(data);
      }
      catch (err) {
        setError(err.message);
      }
      finally {
        setLoading(false);
      }
    };

    fetchCondomino();
  }
  , []);

  useEffect(() => {
    if (condomino) {
      router.push(`/usuarioVivienda/condominos/${condomino.id}`);
    }
  }, [condomino, router]);

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (notFound) {
    return <div>No se encontró ningún condomino activo.</div>;
  }
  return null;
}
