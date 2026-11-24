import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../componentes/AuthLayout';
import Campo from '../componentes/Campo';
import { iniciarSesion } from '../api';
import { useSesion, rutaInicial } from '../contexto/SesionContext';

const PUNTOS = [
  { numero: '01', titulo: 'Conecta', texto: 'Encuentra productores y compradores.' },
  { numero: '02', titulo: 'Comercializa', texto: 'Compra y vende productos directamente.' },
  { numero: '03', titulo: 'Crece', texto: 'Construye relaciones comerciales.' }
];

export default function Login() {
  const [valores, setValores] = useState({ correo: '', contrasena: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { usuario, iniciar } = useSesion();
  const navegar = useNavigate();
  const { state } = useLocation();

  if (usuario) return <Navigate to={rutaInicial(usuario)} replace />;

  const cambiar = (campo) => (valor) => setValores({ ...valores, [campo]: valor });

  async function enviar(evento) {
    evento.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const datosUsuario = await iniciarSesion(valores);
      iniciar(datosUsuario);
      navegar(rutaInicial(datosUsuario));
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="ACCESO A LA PLATAFORMA"
      titular={<>Del campo <em>directo</em> a ti.</>}
      intro="Ingresa a CampoDirecto y conecta directamente con productores y compradores del Atlántico."
      puntos={PUNTOS}
      etiqueta="CAMPO DIRECTO / ACCESO"
      titulo="Iniciar sesión"
      subtitulo="Ingresa tus datos para acceder a tu cuenta."
      pie={<>¿Todavía no tienes una cuenta? <Link to="/registro">Crear cuenta</Link></>}
    >
      <form onSubmit={enviar} noValidate>
        <Campo id="correo" etiqueta="Correo electrónico" tipo="email" valor={valores.correo}
          onCambio={cambiar('correo')} placeholder="tucorreo@ejemplo.com" autoComplete="email" />
        <Campo id="contrasena" etiqueta="Contraseña" tipo="password" valor={valores.contrasena}
          onCambio={cambiar('contrasena')} placeholder="Ingresa tu contraseña" autoComplete="current-password" />

        {state?.mensaje && <div className="form-message success" role="status">{state.mensaje}</div>}
        {error && <div className="form-message error" role="alert">{error}</div>}

        <button type="submit" className="boton-principal" disabled={enviando}>
          <span>{enviando ? 'Verificando...' : 'Iniciar sesión'}</span>
          <span>→</span>
        </button>
      </form>
    </AuthLayout>
  );
}
