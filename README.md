# CampoDirecto

Plataforma web que conecta a productores rurales del Atlántico (Colombia) directamente con compradores, sin intermediarios y mostrando siempre el precio del productor y el costo de transporte por separado ("precio transparente").

## Integrantes


| Integrante 
|---|---|
|Daniel Mercado| 
|Samuel Barrios | 
|Samuel Vega | 

## Tecnologías

- **Front-end:** React 19, React Router (`HashRouter`), Vite
- **Back-end:** Node.js, Express 4, `cors`, `dotenv`
- **Pruebas:** Vitest (API y front)
- **Infraestructura:** AWS S3 (front compilado) y AWS EC2 (API)

Estructura del repositorio:

```
api/                     back-end en Node
  src/rutas/             solo reciben y responden
  src/logica/            reglas del negocio (no mencionan req ni res)
  src/datos/             repositorios (hoy en memoria)
  src/config/            constantes con nombre: umbrales y listas
  src/middleware/ utils/ piezas compartidas (DRY)
front/                   front-end en React
  src/componentes/       Campo, TarjetaProducto, AuthLayout, ...
  src/paginas/           Login, Registro, Catálogo, Panel del productor
  src/api.js             único lugar donde se llama a la API
```

**Reglas compartidas entre front y back (DRY):** el front no copia reglas ni listas. Las categorías, municipios, unidades y roles se piden a `GET /catalogos`, y el precio transparente lo calcula la API; el front solo lo muestra.

## Cómo levantarlo en local

Requisitos: Node.js 20 o superior y Git.

```bash
git clone <url-del-repositorio>
cd <carpeta-del-repositorio>

# 1) API (puerto 3000)
cd api
npm install
cp .env.example .env
npm run dev

# 2) Front (en otra terminal, puerto 5173)
cd front
npm install
npm run dev
```

Abrir http://localhost:5173. Los datos viven en memoria: al reiniciar la API se pierden los usuarios creados y hay que registrarse de nuevo (los 8 productos de ejemplo vuelven solos).

**Variables de entorno**

| Archivo | Variable | Para qué sirve | De dónde se saca |
|---|---|---|---|
| `api/.env` | `PORT` | Puerto de la API (por defecto 3000) | Libre |
| `api/.env` | `FRONT_URL` | Único origen que puede llamar a la API (CORS). **Obligatoria**: sin ella la API no arranca | Local: `http://localhost:5173`. Producción: la URL del bucket de S3 |
| `front/.env.development` | `VITE_API_URL` | Dirección de la API | Local: `http://localhost:3000` (ya viene en el repositorio) |
| `front/.env.production` | `VITE_API_URL` | Dirección de la API en producción | `http://<IP-pública-de-la-EC2>:3000`. No se sube a Git (ver `front/.env.example`) |

## Endpoints de la API

| Método | Ruta | Qué hace | Respuesta |
|---|---|---|---|
| GET | `/salud` | Comprueba que la API está viva | 200 · `{ estado: "ok" }` |
| GET | `/catalogos` | Categorías, municipios, unidades y roles válidos | 200 · objeto |
| GET | `/productos` | Lista los productos disponibles. Filtros opcionales: `categoria`, `municipio`, `texto`, `productorId` | 200 · arreglo |
| GET | `/productos/resumen` | Total de productos, precio promedio y conteo por categoría | 200 · objeto |
| GET | `/productos/:id/precio-total?cantidad=` | Precio transparente: precio del productor + transporte estimado + total | 200 · objeto<br>400 · cantidad inválida<br>404 · no existe |
| POST | `/productos` | Publica un producto. Requiere nombre, categoría, municipio, precio, unidad, cantidad, productorId y productorNombre | 201 · el creado<br>400 · datos inválidos (con lista de qué está mal) |
| DELETE | `/productos/:id?productorId=` | Elimina un producto; solo su dueño | 200 · `{ eliminado: true }`<br>403 · no es el dueño<br>404 · no existe |
| POST | `/usuarios/registro` | Crea una cuenta. Requiere nombre, correo, teléfono, rol y contrasena | 201 · usuario sin contraseña<br>400 · datos inválidos<br>409 · el correo ya existe |
| POST | `/usuarios/login` | Inicia sesión con correo y contrasena | 200 · usuario sin contraseña<br>400 · faltan datos<br>401 · credenciales incorrectas |

Los errores siempre tienen la forma `{ "error": "mensaje", "detalles": ["..."] }`; `detalles` aparece cuando hay varios problemas de validación.

## Cómo correr las pruebas

```bash
cd api   && npm test     # 11 pruebas sobre las reglas del negocio
cd front && npm test     # 5 pruebas de componentes
```

Las pruebas de la API cubren las reglas de `src/logica/` e incluyen casos límite: precio de 0 y de 1 (frontera exacta), lista vacía y cuerpo vacío.

**Comprobar que las pruebas sirven:** en `api/src/logica/reglas-productos.js`, función `esNumeroDesde`, cambiar `numero >= minimo` por `numero > minimo` y correr `npm test`: la prueba "acepta el precio mínimo exacto de 1" debe fallar. Devolver el cambio después.

**Revisión de dependencias (`npm audit`):** ejecutado en `api/` y en `front/`, ambos reportaron `found 0 vulnerabilities` (fecha de ejecución: _completar_). Se vuelve a ejecutar antes de entregar.

## Despliegue

Publicado en:

- **Front (S3):** _URL del sitio, formato `http://<bucket>.s3-website-us-east-1.amazonaws.com`_
- **API (EC2):** _`http://<IP-pública>:3000/salud`_ (debe responder `{"estado":"ok"}`)

Orden para volver a desplegar:

1. **EC2 con Security Group mínimo.** Una sola regla de entrada: TCP 3000 desde cualquier IP (el front es público y la llama desde el navegador de cada usuario). SSH cerrado.
2. **Subir y dejar corriendo la API como servicio.** Por ejemplo, con el *user data* de la instancia (Amazon Linux):
   ```bash
   #!/bin/bash
   dnf install -y nodejs git
   git clone <url-del-repositorio> /opt/campodirecto
   cd /opt/campodirecto/api
   npm install --omit=dev
   printf 'PORT=3000\nFRONT_URL=http://<bucket>.s3-website-us-east-1.amazonaws.com\n' > .env
   cat > /etc/systemd/system/campodirecto.service << 'UNIT'
   [Unit]
   Description=API CampoDirecto
   After=network.target
   [Service]
   WorkingDirectory=/opt/campodirecto/api
   ExecStart=/usr/bin/node src/servidor.js
   Restart=always
   [Install]
   WantedBy=multi-user.target
   UNIT
   systemctl enable --now campodirecto
   ```
3. **Probar la API directo con la IP:** abrir `http://<IP>:3000/productos` en el navegador; debe devolver JSON.
4. **CORS:** `FRONT_URL` en el `.env` de la instancia debe ser exactamente la URL del bucket (sin barra final).
5. **Compilar el front con la IP de la API:**
   ```bash
   cd front
   printf 'VITE_API_URL=http://<IP-pública>:3000\n' > .env.production
   npm run build
   ```
6. **Subir el contenido de `front/dist/` a la raíz del bucket de S3** (con alojamiento de sitio web estático activado) y probar la página completa: registro, login, catálogo y panel.
7. **Capturar las evidencias y liberar los recursos:** terminar la instancia y liberar la Elastic IP si se reservó una.

## Limitaciones conocidas

- Los datos viven en memoria; para persistirlos hay que cambiar solo `api/src/datos/` (todas sus funciones ya son `async`).
- La API no emite tokens de sesión: el `productorId` de `POST /productos` y `DELETE /productos/:id` se recibe del cliente y podría falsificarse. Es una protección provisional hasta agregar autenticación real.
- El costo de transporte es una estimación (12 % del precio del productor, constante `TRANSPORTE_ESTIMADO_PORCENTAJE` en `api/src/config/constantes.js`) hasta que exista el módulo de transporte.
