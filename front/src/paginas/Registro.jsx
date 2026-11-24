import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from '../componentes/AuthLayout';
import Campo from '../componentes/Campo';
import { registrarUsuario } from '../api';
import useCatalogos from '../hooks/useCatalogos';
import { useSesion, rutaInicial } from '../contexto/SesionContext';

const PUNTOS = [
  { numero: '01', titulo: 'Productores', texto: 'Publica y comercializa tus productos.' },
  { numero: '02', titulo: 'Compradores', texto: 'Encuentra productos directamente del campo.' },
  { numero: '03', titulo: 'Sin intermediarios', texto: 'Conecta directamente con otros usuarios.' }
];

// Solo texto de presentación: qué roles existen lo decide la API.
const TEXTO_ROL = {
  productor: { titulo: 'Productor', detalle: 'Quiero vender mis productos' },
  comprador: { titulo: 'Comprador', detalle: 'Quiero comprar productos' }
};

const VACIO = { nombre: '', correo: '', telefono: '', rol: '', contrasena: '', confirmar: '' };

export default function Registro() {
  const [valores, setValores] = useState(VACIO);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { catalogos } = useCatalogos();
  const { usuario } = useSesion();
  const navegar = useNavigate();

  if (usuario) return <Navigate to={rutaInicial(usuario)} replace />;

  const cambiar = (campo) => (valor) => setValores({ ...valores, [campo]: valor });
  // Única comprobación del front: que repitió bien la contraseña. Todo lo demás lo valida la API.
  const noCoinciden = valores.confirmar !== '' && valores.confirmar !== valores.contrasena;

  async function enviar(evento) {
    evento.preventDefault();
    setError('');
    if (noCoinciden || valores.confirmar === '') {
      setError('Confirma tu contraseña: las dos deben coincidir.');
      return;
    }

    setEnviando(true);
    try {
      const { confirmar, ...datos } = valores;
      await registrarUsuario(datos);
      navegar('/login', { state: { mensaje: '¡Cuenta creada! Ya puedes iniciar sesión.' } });
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="ÚNETE A CAMPO DIRECTO"
      titular={<>Conecta. <em>Comercializa.</em> Crece.</>}
      intro="Crea tu cuenta y comienza a formar parte de una nueva manera de conectar el campo con quienes necesitan sus productos."
      puntos={PUNTOS}
      etiqueta="CAMPO DIRECTO / REGISTRO"
      titulo="Crear cuenta"
      subtitulo="Completa tus datos para comenzar."
      pie={<>¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link></>}
    >
      <form onSubmit={enviar} noValidate>
        <Campo id="nombre" etiqueta="Nombre completo" valor={valores.nombre}
          onCambio={cambiar('nombre')} placeholder="Ej. Daniel Mercado" autoComplete="name" />
        <Campo id="correo" etiqueta="Correo electrónico" tipo="email" valor={valores.correo}
          onCambio={cambiar('correo')} placeholder="tucorreo@ejemplo.com" autoComplete="email" />
        <Campo id="telefono" etiqueta="Número de teléfono" tipo="tel" valor={valores.telefono}
          onCambio={cambiar('telefono')} placeholder="300 000 0000" autoComplete="tel" />

        <fieldset className="roles">
          <legend>¿Cómo utilizarás CampoDirecto?</legend>
          <div className="roles-opciones">
            {catalogos?.roles.map((rol) => (
              <label key={rol} className={`role-option ${valores.rol === rol ? 'is-selected' : ''}`}>
                <input type="radio" name="rol" value={rol} checked={valores.rol === rol}
                  onChange={() => cambiar('rol')(rol)} />
                <span>
                  <strong>{TEXTO_ROL[rol]?.titulo ?? rol}</strong>
                  <small>{TEXTO_ROL[rol]?.detalle}</small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Campo id="contrasena" etiqueta="Contraseña" tipo="password" valor={valores.contrasena}
          onCambio={cambiar('contrasena')} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
        <Campo id="confirmar" etiqueta="Confirmar contraseña" tipo="password" valor={valores.confirmar}
          onCambio={cambiar('confirmar')} placeholder="Repite tu contraseña" autoComplete="new-password"
          error={noCoinciden ? 'Las contraseñas no coinciden.' : ''} />

        {error && <div className="form-message error" role="alert">{error}</div>}

        <button type="submit" className="boton-principal" disabled={enviando}>
          <span>{enviando ? 'Creando cuenta...' : 'Crear mi cuenta'}</span>
          <span>→</span>
        </button>
      </form>
    </AuthLayout>
  );
}
