(() => {
  "use strict";

  const db = () => window.supabaseClient;
  const validar = window.CampoValidaciones;

  async function obtenerMiPerfil() {
    const { data: authData, error: authError } =
      await db().auth.getUser();

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error("Debes iniciar sesión.");
    }

    const { data, error } = await db()
      .from("perfiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (error) throw error;

    return {
      ...data,
      email: authData.user.email
    };
  }

  async function actualizarMiPerfil(datos) {
    const usuario = await window.CampoAuth.obtenerUsuario();

    if (!usuario) {
      throw new Error("Debes iniciar sesión.");
    }

    const cambios = {};

    if (datos.nombre !== undefined) {
      cambios.nombre_completo = validar.texto(
        datos.nombre,
        "Nombre",
        120
      );
    }

    if (datos.telefono !== undefined) {
      validar.telefono(datos.telefono);
      cambios.telefono = datos.telefono.trim();
    }

    if (datos.municipio_id !== undefined) {
      cambios.municipio_id = datos.municipio_id || null;
    }

    if (!Object.keys(cambios).length) {
      throw new Error("No hay datos para actualizar.");
    }

    const { data, error } = await db()
      .from("perfiles")
      .update(cambios)
      .eq("id", usuario.id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async function listarMunicipios() {
    const { data, error } = await db()
      .from("municipios")
      .select("*")
      .order("nombre");

    if (error) throw error;

    return data;
  }

  window.CampoUsuarios = {
    obtenerMiPerfil,
    actualizarMiPerfil,
    listarMunicipios
  };
})();