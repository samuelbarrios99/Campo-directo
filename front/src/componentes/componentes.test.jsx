import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import Campo from './Campo';
import TarjetaProducto from './TarjetaProducto';
import Login from '../paginas/Login';
import { SesionProvider } from '../contexto/SesionContext';
import { formatearPesos } from '../utils/formato';

const producto = {
  id: 'p1', nombre: 'Tomate chonto', categoria: 'Frutas y verduras',
  productorNombre: 'Finca Los Mangos', municipio: 'Malambo',
  precio: 2500, unidad: 'kg', cantidad: 180
};

describe('formatearPesos', () => {
  it('muestra el valor con signo y separador de miles', () => {
    expect(formatearPesos(2500)).toBe('$2.500');
  });
});

describe('Campo', () => {
  it('muestra la etiqueta y el mensaje de error que recibe por props', () => {
    const html = renderToString(
      <Campo id="x" etiqueta="Correo" valor="" onCambio={() => {}} error="Falta el correo" />
    );
    expect(html).toContain('Correo');
    expect(html).toContain('Falta el correo');
  });

  it('dibuja un select con sus opciones cuando recibe `opciones`', () => {
    const html = renderToString(
      <Campo id="m" etiqueta="Municipio" valor="" onCambio={() => {}} opciones={['Soledad', 'Galapa']} />
    );
    expect(html).toContain('<select');
    expect(html).toContain('Galapa');
  });
});

describe('TarjetaProducto', () => {
  it('muestra los datos del producto y lo que recibe como children', () => {
    const html = renderToString(
      <TarjetaProducto producto={producto}><button>Acción</button></TarjetaProducto>
    );
    expect(html).toContain('Tomate chonto');
    expect(html).toContain('$2.500');
    expect(html).toContain('Acción');
  });
});

describe('Login', () => {
  it('muestra el formulario de inicio de sesión cuando no hay sesión', () => {
    const html = renderToString(
      <MemoryRouter><SesionProvider><Login /></SesionProvider></MemoryRouter>
    );
    expect(html).toContain('Correo electrónico');
    expect(html).toContain('Iniciar sesión');
  });
});
