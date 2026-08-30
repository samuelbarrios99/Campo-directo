const session = requireAuth();

if (session) {
  initAppHeader(session, "catalogo");

  const grid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");
  const resultsCount = document.getElementById("resultsCount");
  const buscarInput = document.getElementById("buscar");
  const filtroCategoria = document.getElementById("filtroCategoria");
  const filtroMunicipio = document.getElementById("filtroMunicipio");
  const ordenSelect = document.getElementById("orden");
  const resetBtn = document.getElementById("resetFilters");

  // Poblar selects de filtro
  CATEGORIAS.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filtroCategoria.appendChild(opt);
  });
  MUNICIPIOS.forEach((muni) => {
    const opt = document.createElement("option");
    opt.value = muni;
    opt.textContent = muni;
    filtroMunicipio.appendChild(opt);
  });

  function render() {
    const productos = getProductos().filter((p) => p.estado === "disponible");
    const texto = buscarInput.value.trim().toLowerCase();
    const categoria = filtroCategoria.value;
    const municipio = filtroMunicipio.value;
    const orden = ordenSelect.value;

    let filtrados = productos.filter((p) => {
      const coincideTexto = !texto || p.nombre.toLowerCase().includes(texto);
      const coincideCategoria = !categoria || p.categoria === categoria;
      const coincideMunicipio = !municipio || p.municipio === municipio;
      return coincideTexto && coincideCategoria && coincideMunicipio;
    });

    if (orden === "precio-asc") filtrados.sort((a, b) => a.precio - b.precio);
    if (orden === "precio-desc") filtrados.sort((a, b) => b.precio - a.precio);
    if (orden === "reciente") {
      filtrados.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion));
    }

    resultsCount.textContent = `${filtrados.length} producto${filtrados.length === 1 ? "" : "s"} disponible${filtrados.length === 1 ? "" : "s"}`;

    grid.innerHTML = "";
    emptyState.hidden = filtrados.length > 0;
    grid.hidden = filtrados.length === 0;

    filtrados.forEach((p) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <span class="cat-tag">${p.categoria}</span>
        <h3>${p.nombre}</h3>
        <p class="meta">${p.productorNombre} · ${p.municipio}</p>
        <div class="price-row">
          <span class="price">${formatPrecio(p.precio)}</span>
          <span class="unit">por ${p.unidad}</span>
        </div>
        <button class="cta" type="button">Pedir</button>
      `;
      card.querySelector(".cta").addEventListener("click", () => {
        alert("Los pedidos estarán disponibles cuando construyamos ese flujo. Por ahora, este es solo el catálogo.");
      });
      grid.appendChild(card);
    });
  }

  [buscarInput, filtroCategoria, filtroMunicipio, ordenSelect].forEach((el) => {
    el.addEventListener("input", render);
    el.addEventListener("change", render);
  });

  resetBtn.addEventListener("click", () => {
    buscarInput.value = "";
    filtroCategoria.value = "";
    filtroMunicipio.value = "";
    ordenSelect.value = "reciente";
    render();
  });

  render();
}
