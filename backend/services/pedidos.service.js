(() => {
  "use strict";

  const db = () => window.supabaseClient;
  const validar = window.CampoValidaciones;

  async function crearPedido(productoId, cantidad, direccion, notas = null) {
    validar.requerido(productoId, "Producto");

    const cantidadValidada = validar.numeroPositivo(
      cantidad,
      "Cantidad"
    );

    const direccionValidada = validar.texto(
      direccion,
      "Dirección de entrega",
      300
    );

    const { data, error } = await db().rpc("crear_pedido", {
      p_producto_id: productoId,
      p_cantidad: cantidadValidada,
      p_direccion: direccionValidada,
      p_notas: notas ? String(notas).trim() : null
    });

    if (error) throw error;

    return data;
  }

  async function listarMisCompras() {
    const usuario = await window.CampoAuth.obtenerUsuario();

    if (!usuario) throw new Error("Debes iniciar sesión.");

    const { data, error } = await db()
      .from("pedidos")
      .select(`
        *,
        detalle_pedidos(*)
      `)
      .eq("comprador_id", usuario.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  }

  async function listarPedidosRecibidos() {
    const usuario = await window.CampoAuth.obtenerUsuario();

    if (!usuario) throw new Error("Debes iniciar sesión.");

    const { data, error } = await db()
      .from("pedidos")
      .select(`
        *,
        detalle_pedidos(*)
      `)
      .eq("productor_id", usuario.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  }

  async function obtenerPedido(id) {
    validar.requerido(id, "Pedido");

    const { data, error } = await db()
      .from("pedidos")
      .select(`
        *,
        detalle_pedidos(*)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  async function actualizarEstado(id, nuevoEstado) {
    validar.requerido(id, "Pedido");
    validar.estadoPedido(nuevoEstado);

    const { data, error } = await db()
      .from("pedidos")
      .update({ estado: nuevoEstado })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  window.CampoPedidos = {
    crearPedido,
    listarMisCompras,
    listarPedidosRecibidos,
    obtenerPedido,
    actualizarEstado
  };
})();