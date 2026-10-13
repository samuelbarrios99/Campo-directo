#CAMPO DIRECTO
CampoDirecto es una plataforma digital diseñada para conectar directamente a productores rurales del departamento del Atlántico con compradores, facilitando la comercialización de productos agrícolas, pecuarios y rurales.La plataforma busca reducir la dependencia de intermediarios, permitiendo que los productores publiquen sus productos, establezcan sus precios, indiquen las cantidades disponibles y reciban pedidos directamente de consumidores, restaurantes, tiendas, empresas y otros compradores.CampoDirecto también integrará herramientas para consultar precios, coordinar entregas, conectar productores con transportadores, realizar compras colectivas, reservar cosechas futuras y construir un sistema de reputación entre usuarios.El proyecto comenzará en el Atlántico, con una visión de expansión hacia otros departamentos de la región Caribe. Su objetivo es facilitar una relación comercial más directa y transparente entre quienes producen en el campo y quienes necesitan sus productos. 
## Despliegue en AWS
| Integrante | URL del sitio | Bucket publico | Bucket privado |
|---|---|---|---|
| Samuel Barrios | http://cuc-bp-equiposds-sitio-2026.s3-website-us-east-1.amazonaws.com/#  | cuc-bp-equiposds-sitio-2026 |cuc-bp-eqsds-barrios-privado-2026 |








Se migro a AWS S3 para tener mayor control sobre la infraestructura en la nube, gestionar la seguridad mediante politicas de servicios e integrar el proyecto directamente dentro del ecosistema de Amazon Web Services 

¿Para que sirve el bucket privado?
Se usa para guardar informacion sensible para archivos internos que no deben ser visibles en internet 
¿Para que sirve el bucket publico?
Esta configurado para alojamiento de sitios web estaticos. Tienes permisos para que cualquier persona en internet pueda acceder y ver la pagina web.