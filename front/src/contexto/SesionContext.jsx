import { createContext, useContext, useState } from 'react';

const CLAVE_SESION = 'campoDirectoUsuario';
const SesionContext = createContext(null);

function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch {
    return null;
  }
}

// A dónde va cada rol al entrar: un solo lugar para esta decisión.
export function rutaInicial(usuario) {
  return usuario.rol === 'productor' ? '/panel' : '/catalogo';
}

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesion);

  function iniciar(datosUsuario) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
  }

  function cerrar() {
    localStorage.removeItem(CLAVE_SESION);
    setUsuario(null);
  }

  return (
    <SesionContext.Provider value={{ usuario, iniciar, cerrar }}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  return useContext(SesionContext);
}
