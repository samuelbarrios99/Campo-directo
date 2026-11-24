import { describe, it, expect } from 'vitest';
import {
  validarProducto, calcularPrecioTransparente, calcularResumen, filtrarProductos
} from './reglas-productos.js';

const productoValido = {
  nombre: 'Tomate chonto', categoria: 'Frutas y verduras', municipio: 'Malambo',
  precio: 2500, unidad: 'kg', cantidad: 100,
  productorId: 'u1', productorNombre: 'Finca Los Mangos'
};

describe('validarProducto', () => {
  it('acepta un producto completo y correcto', () => {
    expect(validarProducto(productoValido).valido).toBe(true);
  });

  it('acepta el precio mínimo exacto de 1 (caso límite)', () => {
    expect(validarProducto({ ...productoValido, precio: 1 }).valido).toBe(true);
  });

  it('rechaza un precio de 0 (caso límite)', () => {
    const resultado = validarProducto({ ...productoValido, precio: 0 });
    expect(resultado.valido).toBe(false);
    expect(resultado.errores[0]).toContain('precio');
  });

  it('rechaza una categoría que no existe', () => {
    expect(validarProducto({ ...productoValido, categoria: 'Joyería' }).valido).toBe(false);
  });

  it('rechaza un cuerpo vacío y lista todos los errores', () => {
    const resultado = validarProducto({});
    expect(resultado.valido).toBe(false);
    expect(resultado.errores.length).toBeGreaterThan(3);
  });
});

describe('calcularPrecioTransparente', () => {
  it('suma el transporte estimado al precio del productor ($2.500 + $300)', () => {
    const r = calcularPrecioTransparente(2500);
    expect(r.transporteEstimado).toBe(300);
    expect(r.totalUnitario).toBe(2800);
  });

  it('multiplica el total por la cantidad', () => {
    expect(calcularPrecioTransparente(2500, 10).total).toBe(28000);
  });
});

describe('calcularResumen', () => {
  it('devuelve ceros con una lista vacía (caso límite)', () => {
    expect(calcularResumen([])).toEqual({ totalProductos: 0, precioPromedio: 0, porCategoria: {} });
  });

  it('calcula promedio y conteo por categoría, ignorando los no disponibles', () => {
    const productos = [
      { estado: 'disponible', categoria: 'Agrícola', precio: 1000 },
      { estado: 'disponible', categoria: 'Agrícola', precio: 2000 },
      { estado: 'agotado', categoria: 'Pesca', precio: 99999 }
    ];
    expect(calcularResumen(productos)).toEqual({
      totalProductos: 2, precioPromedio: 1500, porCategoria: { Agrícola: 2 }
    });
  });
});

describe('filtrarProductos', () => {
  const lista = [
    { nombre: 'Yuca criolla', categoria: 'Agrícola', municipio: 'Soledad', estado: 'disponible' },
    { nombre: 'Miel', categoria: 'Apícola', municipio: 'Galapa', estado: 'disponible' },
    { nombre: 'Yuca vieja', categoria: 'Agrícola', municipio: 'Soledad', estado: 'agotado' }
  ];

  it('filtra por texto y excluye los no disponibles', () => {
    const r = filtrarProductos(lista, { texto: 'yuca' });
    expect(r).toHaveLength(1);
    expect(r[0].nombre).toBe('Yuca criolla');
  });

  it('filtra por productorId para mostrar solo los productos de un productor', () => {
    const propios = [
      { nombre: 'A', productorId: 'u1', estado: 'disponible' },
      { nombre: 'B', productorId: 'u2', estado: 'disponible' }
    ];
    expect(filtrarProductos(propios, { productorId: 'u1' })).toHaveLength(1);
  });
});
