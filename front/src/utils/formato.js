// Solo presentación: cómo se muestra un valor. Las reglas del negocio viven en la API.
export function formatearPesos(valor) {
  return '$' + Number(valor).toLocaleString('es-CO');
}
