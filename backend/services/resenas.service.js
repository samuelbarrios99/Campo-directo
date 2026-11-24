(() => {
  "use strict";

  const db = () => window.supabaseClient;
  const validar = window.CampoValidaciones;

  async function crearResena(datos) {
    const usuario = await window.CampoAuth.obtenerUsuario();

    if (!usuario) throw new Error("Debes iniciar sesión.");

    validar.requerido(datos.producto_id, "Producto");
    validar.requerido(datos.pedido_id, "Pedido");

    const calificacion = validar.calificacion(datos.calificacion);

    const comentario = datos.comentario
      ? validar.texto(datos.comentario, "Comentario", 1000)
      : null;

    const { data, error } = await db()
      .from("resenas")
      .insert({
        comprador_id: usuario.id,
        producto_id: datos.producto_id,
        pedido_id: datos.pedido_id,
        calificacion,
        comentario
      })
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async function listarResenasProducto(productoId) {
    validar.requerido(productoId, "Producto");

    const { data, error } = await db()
      .from("resenas")
      .select("*")
      .eq("producto_id", productoId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  }

  async function obtenerPromedioProducto(productoId) {
    const resenas = await listarResenasProducto(productoId);

    if (!resenas.length) {
      return {
        promedio: 0,
        total: 0
      };
    }

    const suma = resenas.reduce(
      (total, resena) => total + resena.calificacion,
      0
    );

    return {
      promedio: Number((suma / resenas.length).toFixed(1)),
      total: resenas.length
    };
  }

  window.CampoResenas = {
    crearResena,
    listarResenasProducto,
    obtenerPromedioProducto
  };
})();