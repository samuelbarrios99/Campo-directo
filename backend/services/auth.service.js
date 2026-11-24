(() => {
  "use strict";

  const db = () => window.supabaseClient;
  const validar = window.CampoValidaciones;

  async function registrar(datos) {
    validar.texto(datos.nombre, "Nombre", 120);
    validar.telefono(datos.telefono);
    validar.email(datos.email);
    validar.password(datos.password);
    validar.rol(datos.tipo);

    const { data, error } = await db().auth.signUp({
      email: datos.email.trim().toLowerCase(),
      password: datos.password,
      options: {
        data: {
          nombre_completo: datos.nombre.trim(),
          telefono: datos.telefono.trim(),
          tipo_usuario: datos.tipo
        },
        emailRedirectTo: `${window.location.origin}/login.html`
      }
    });

    if (error) throw error;

    return {
      usuario: data.user,
      sesion: data.session,
      requiereConfirmacion: !data.session
    };
  }

  async function iniciarSesion(email, password) {
    validar.email(email);
    validar.requerido(password, "Contraseña");

    const { data, error } = await db().auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password
    });

    if (error) throw error;

    return data;
  }

  async function cerrarSesion() {
    const { error } = await db().auth.signOut();

    if (error) throw error;

    window.location.replace("/login.html");
  }

  async function obtenerUsuario() {
    const { data, error } = await db().auth.getUser();

    if (error) throw error;

    return data.user;
  }

  async function obtenerSesion() {
    const { data, error } = await db().auth.getSession();

    if (error) throw error;

    return data.session;
  }

  async function recuperarPassword(email) {
    validar.email(email);

    const { error } = await db().auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/actualizar-password.html`
      }
    );

    if (error) throw error;

    return true;
  }

  async function actualizarPassword(nuevaPassword) {
    validar.password(nuevaPassword);

    const { data, error } = await db().auth.updateUser({
      password: nuevaPassword
    });

    if (error) throw error;

    return data.user;
  }

  async function actualizarEmail(nuevoEmail) {
    validar.email(nuevoEmail);

    const { data, error } = await db().auth.updateUser({
      email: nuevoEmail.trim().toLowerCase()
    });

    if (error) throw error;

    return data.user;
  }

  db().auth.onAuthStateChange((evento) => {
    window.dispatchEvent(
      new CustomEvent("campoDirecto:auth", {
        detail: { evento }
      })
    );
  });

  window.CampoAuth = {
    registrar,
    iniciarSesion,
    cerrarSesion,
    obtenerUsuario,
    obtenerSesion,
    recuperarPassword,
    actualizarPassword,
    actualizarEmail
  };
})();