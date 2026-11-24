(() => {
  "use strict";

  const db = () => window.supabaseClient;
  const validar = window.CampoValidaciones;
  const BUCKET = "productos";

  async function listarProductos(filtros = {}) {
    let consulta = db()
      .from("productos")
      .select(`
        *,
        categorias(nombre),
        municipios(nombre)
      `)
      .eq("estado", "publicado")
      .order("created_at", { ascending: false });

    if (filtros.busqueda) {
      const busqueda = String(filtros.busqueda)
        .trim()
        .replace(/[,%()]/g, "");

      if (busqueda) {
        consulta = consulta.ilike("nombre", `%${busqueda}%`);
      }
    }

    if (filtros.categoria_id) {
      consulta = consulta.eq("categoria_id", filtros.categoria_id);
    }

    if (filtros.municipio_id) {
      consulta = consulta.eq("municipio_id", filtros.municipio_id);
    }

    if (filtros.precioMaximo !== undefined) {
      consulta = consulta.lte(
        "precio",
        validar.numeroPositivo(filtros.precioMaximo, "Precio máximo")
      );
    }

    const { data, error } = await consulta;

    if (error) throw error;

    return data;
  }

  async function obtenerProducto(id) {
    validar.requerido(id, "Identificador del producto");

    const { data, error } = await db()
      .from("productos")
      .select(`
        *,
        categorias(nombre),
        municipios(nombre)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    return data;
  }

  async function listarMisProductos() {
    const usuario = await window.CampoAuth.obtenerUsuario();

    if (!usuario) throw new Error("Debes iniciar sesión.");

    const { data, error } = await db()
      .from("productos")
      .select("*")
      .eq("productor_id", usuario.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  }

  async function publicarProducto(producto) {
    const usuario = await window.CampoAuth.obtenerUsuario();

    if (!usuario) throw new Error("Debes iniciar sesión.");

    const nuevoProducto = {
      productor_id: usuario.id,
      nombre: validar.texto(producto.nombre, "Nombre", 120),
      descripcion: producto.descripcion
        ? validar.texto(producto.descripcion, "Descripción", 2000)
        : null,
      categoria_id: producto.categoria_id,
      municipio_id: producto.municipio_id,
      precio: validar.numeroPositivo(producto.precio, "Precio"),
      cantidad: validar.numeroPositivo(producto.cantidad, "Cantidad"),
      unidad: validar.texto(producto.unidad, "Unidad", 30),
      imagen_path: producto.imagen_path || null,
      estado: "publicado"
    };

    validar.requerido(nuevoProducto.categoria_id, "Categoría");
    validar.requerido(nuevoProducto.municipio_id, "Municipio");

    const { data, error } = await db()
      .from("productos")
      .insert(nuevoProducto)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async function actualizarProducto(id, cambios) {
    validar.requerido(id, "Producto");

    const permitidos = [
      "nombre",
      "descripcion",
      "categoria_id",
      "municipio_id",
      "precio",
      "cantidad",
      "unidad",
      "imagen_path",
      "estado"
    ];

    const actualizacion = {};

    for (const campo of permitidos) {
      if (cambios[campo] !== undefined) {
        actualizacion[campo] = cambios[campo];
      }
    }

    if (actualizacion.nombre !== undefined) {
      actualizacion.nombre = validar.texto(
        actualizacion.nombre,
        "Nombre",
        120
      );
    }

    if (actualizacion.precio !== undefined) {
      actualizacion.precio = validar.numeroPositivo(
        actualizacion.precio,
        "Precio"
      );
    }

    if (actualizacion.cantidad !== undefined) {
      const cantidad = Number(actualizacion.cantidad);

      if (!Number.isFinite(cantidad) || cantidad < 0) {
        throw new Error("La cantidad no puede ser negativa.");
      }

      actualizacion.cantidad = cantidad;
    }

    if (
      actualizacion.estado !== undefined &&
      !["publicado", "pausado", "agotado"].includes(actualizacion.estado)
    ) {
      throw new Error("Estado de producto no válido.");
    }

    if (!Object.keys(actualizacion).length) {
      throw new Error("No hay cambios para guardar.");
    }

    const { data, error } = await db()
      .from("productos")
      .update(actualizacion)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return data;
  }

  async function eliminarProducto(id) {
    validar.requerido(id, "Producto");

    const { error } = await db()
      .from("productos")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return true;
  }

  async function subirImagen(archivo) {
    if (!(archivo instanceof File)) {
      throw new Error("Selecciona una imagen válida.");
    }

    const tipos = ["image/jpeg", "image/png", "image/webp"];

    if (!tipos.includes(archivo.type)) {
      throw new Error("Solo se permiten imágenes JPG, PNG o WEBP.");
    }

    if (archivo.size > 5 * 1024 * 1024) {
      throw new Error("La imagen no puede superar 5 MB.");
    }

    const usuario = await window.CampoAuth.obtenerUsuario();

    if (!usuario) throw new Error("Debes iniciar sesión.");

    const extension = archivo.name.split(".").pop().toLowerCase();
    const nombre = `${usuario.id}/${crypto.randomUUID()}.${extension}`;

    const { data, error } = await db()
      .storage
      .from(BUCKET)
      .upload(nombre, archivo, {
        cacheControl: "3600",
        upsert: false,
        contentType: archivo.type
      });

    if (error) throw error;

    const { data: urlData } = db()
      .storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return {
      path: data.path,
      url: urlData.publicUrl
    };
  }

  async function listarCategorias() {
    const { data, error } = await db()
      .from("categorias")
      .select("*")
      .order("nombre");

    if (error) throw error;

    return data;
  }

  window.CampoProductos = {
    listarProductos,
    obtenerProducto,
    listarMisProductos,
    publicarProducto,
    actualizarProducto,
    eliminarProducto,
    subirImagen,
    listarCategorias
  };
})();