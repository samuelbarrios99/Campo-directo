import { useEffect, useState } from 'react';
import { obtenerCatalogos } from '../api';

// Las listas (categorías, municipios...) se piden una sola vez y se reusan en todas las páginas.
let guardado = null;

export default function useCatalogos() {
  const [catalogos, setCatalogos] = useState(guardado);
  const [error, setError] = useState('');

  useEffect(() => {
    if (guardado) return;
    obtenerCatalogos()
      .then((datos) => {
        guardado = datos;
        setCatalogos(datos);
      })
      .catch((e) => setError(e.message));
  }, []);

  return { catalogos, error };
}
