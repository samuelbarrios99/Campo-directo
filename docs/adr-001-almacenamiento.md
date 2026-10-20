# ADR-001: Diseño del almacenamiento del proyecto en Amazon S3
- Fecha: 20 de octubre de 2026
- Autor: Daniel Mercado 
- Estado: Aceptada
## Contexto
El proyecto CampoDirecto se encontraba alojado en un entorno de desarrollo local con almacenamiento en un sistema de archivos plano unificado, lo que impedía su escalabilidad y alta disponibilidad para los productores del Atlántico. El problema concreto a resolver era la falta de aislamiento y protección de la información confidencial (como datos de campesinos y rutas logísticas) frente a los activos públicos del sitio web (código frontend e imágenes de catálogos). Adicionalmente, el almacenamiento carecía de mecanismos automáticos para prevenir la pérdida de datos por borrados accidentales y un control de costos eficiente, lo que generaba una acumulación infinita de archivos obsoletos y un gasto financiero lineal e insostenible a largo plazo.
## Decision
Se adoptó una arquitectura de almacenamiento desacoplada en Amazon S3 compuesta por la siguiente estructura:
1. Dos Buckets: Un bucket web de acceso Público para la carga de la interfaz y catálogo de cosechas, y un bucket de respaldos 100% Privado para salvaguardar la información sensible del negocio.
2. Prefijos Organizados: En el bucket público se crearon los prefijos frontend/ y productos/. En el bucket privado se estructuraron los prefijos respaldos-db/, logistica/ y metricas-precios/.
3. Versionado Diferenciado: Se activó el versionado únicamente en el bucket público para garantizar la recuperación inmediata del sitio ante errores humanos. Se dejó apagado en el bucket privado para evitar la multiplicación exponencial de costos por archivos pesados de bases de datos.
4. Regla de Ciclo de Vida: Se configuró la regla retencion-sitio en el bucket público aplicada a todos los objetos con los plazos: transición a Standard-IA a los 30 días, transición a Glacier a los 90 días y Eliminación Permanente de versiones no vigentes a los 180 días.
## Alternativas consideradas
1. Bucket único unificado con acceso público por políticas de objeto: Se evaluó mantener un solo bucket para todo el proyecto manejando la privacidad mediante permisos individuales por archivo. Se descartó porque aumentaba drásticamente la superficie de ataque y el riesgo de una filtración de datos masiva por un error de configuración manual en los permisos de S3.
2. Versionado activo en toda la infraestructura sin reglas de ciclo de vida: Se consideró encender el versionado en todos los contenedores de forma permanente y sin restricciones. Se descartó debido a que el almacenamiento de múltiples copias de respaldos de bases de datos (.sql) y logs pesados generaba un sobrecosto financiero del 78.7% anual por almacenar basura digital e histórica sin utilidad operativa.
## Consecuencias
### Positivas
• Alta Disponibilidad y Seguridad: Los activos web se sirven de forma masiva a los clientes mientras que los datos confidenciales de los campesinos del Caribe quedan blindados contra accesos no autorizados.
• Resiliencia Operativa: Capacidad de recuperar la plataforma web en segundos ante eliminaciones accidentales gracias a los delete markers del versionado.
• Optimización Financiera Automática: Reducción drástica del gasto de almacenamiento en un 78.7% anual mediante la degradación automatizada de archivos fríos.
### Costos o desventajas que aceptamos
• Complejidad en el despliegue: El equipo de desarrollo debe configurar adecuadamente las rutas de carga apuntando a dos buckets distintos con credenciales de IAM específicas.
• Tiempo de recuperación diferido: Aceptar que la restauración de código histórico o auditorías de precios del trimestre pasado que residan en Glacier tardará un par de horas en completarse de forma asíncrona.
### Que habria que revisar mas adelante
• Evaluar la implementación de AWS CloudFront como CDN sobre el bucket público para reducir la latencia de carga del catálogo de yuca y frutas en la región Caribe.
• Monitorear los patrones de crecimiento del prefijo productos/ para ajustar los días de transición a Glacier si el volumen de fotos subido por los campesinos excede las proyecciones iniciales.
