(() => {
  "use strict";

  async function exigirSesion() {
    try {
      const usuario = await window.CampoAuth.obtenerUsuario();

      if (!usuario) {
        window.location.replace("/login.html");
        return null;
      }

      return usuario;
    } catch (error) {
      console.error("Error verificando sesión:", error);
      window.location.replace("/login.html");
      return null;
    }
  }

  async function exigirRol(rolPermitido) {
    const usuario = await exigirSesion();

    if (!usuario) return null;

    try {
      const perfil = await window.CampoUsuarios.obtenerMiPerfil();

      if (perfil.tipo_usuario !== rolPermitido) {
        window.location.replace("/dashboard.html");
        return null;
      }

      return perfil;
    } catch (error) {
      console.error("Error verificando permisos:", error);
      window.location.replace("/login.html");
      return null;
    }
  }

  async function redirigirSiAutenticado() {
    const sesion = await window.CampoAuth.obtenerSesion();

    if (sesion) {
      window.location.replace("/dashboard.html");
    }
  }

  window.CampoMiddleware = {
    exigirSesion,
    exigirRol,
    redirigirSiAutenticado
  };
})();