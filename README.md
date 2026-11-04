# FES SPA

Primera versión estática del sitio de alojamientos, administración de propiedades y limpieza de FES SPA. HTML, CSS y JavaScript sin dependencias de instalación.

## Ejecutar

Desde `/workspace/FES-ESTILO-AIRBNB`:

```sh
python3 -m http.server 3000 --bind 0.0.0.0
```

## Alcance actual

- Diseño adaptable a móviles, catálogo, filtros por destino, capacidad y categoría.
- Favoritos temporales y consultas con validación de formulario y fechas.
- Propiedades, precios en CLP e imágenes son ejemplos; no representan inventario ni disponibilidad real.
- El formulario prepara una consulta localmente: no envía ni almacena datos.
- No hay autenticación, pagos, reservas, cálculo de comisiones ni backend.
- Las imágenes de referencia están guardadas en `assets/` y cargan sin conexión externa. Procedencia en `assets/SOURCES.md`. Las fuentes usan Google Fonts con alternativas del sistema.

Para publicar comercialmente se necesitan propiedades y fotografías autorizadas, precios y cargos reales, contacto de la empresa, condiciones de servicio y una integración para consultas y reservas.

## Descubrimiento y solicitud de reserva

El catálogo prioriza Concepción y permite explorar destinos de Chile. Los destinos sin propiedades de ejemplo muestran un estado vacío. Cada alojamiento tiene una ruta compartible (`#alojamiento/1`), galería ampliable, descripción, servicios y zona de referencia.

El panel de reserva valida fechas y capacidad y permite revisar el resumen antes de preparar la consulta. El total del huésped es precio por noche × noches: no se añaden cargos por limpieza ni servicio FES. La comisión por los arriendos corresponde al acuerdo con el propietario, sin porcentaje fijado aún; no se calcula ni cobra al huésped. La limpieza está incluida para los departamentos administrados por FES. No hay calendario de disponibilidad, bloqueo de fechas, envío, pago ni confirmación real.

Validado en Chromium: prioridad de Concepción, filtros, navegación y enlaces directos, galería, favoritos, rechazo de fechas inválidas, cálculo de tres noches ($48.000 × 3 = $144.000, sin cargos adicionales), resumen y formulario de solicitud. Comprobado ancho móvil de 390 px sin desbordamiento horizontal. Prueba funcional con recursos externos bloqueados; no valida la descarga de fotografías ni fuentes remotas.

## Identidad y atención

Paleta inspirada en la referencia de marca FES: verde bosque para acciones y textos, verde claro como acento y fondos suaves. El encabezado y pie usan una marca tipográfica provisional; reemplazarla por el archivo original PNG/SVG suministrado por FES cuando esté disponible. No se ha incorporado ni recreado el logo gráfico de referencia.

El acceso fijo «¿Te ayudamos?» abre preguntas frecuentes y consultas por tema. La ayuda dentro de una ficha conserva el alojamiento consultado. No hay mensajes enviados, chat en vivo ni enlaces ficticios de WhatsApp. Se requiere el contacto oficial para habilitar el envío.

Comprobaciones adicionales en Chromium: centro de ayuda, preguntas frecuentes, consulta contextual, restauración de foco al cerrar y anchos de 320, 390, 768 y 1440 px sin desbordamiento horizontal. El flujo de reserva existente sigue pasando.

## Selector de fechas

`calendar.js` agrega un calendario de rango compartido a la búsqueda y al formulario de reserva. Muestra dos meses en escritorio y uno en móvil, permite navegar por meses y resalta llegada, salida y noches intermedias. Los cambios se aplican con «Aplicar fechas»; cerrar o presionar Escape descarta los cambios pendientes. «Borrar fechas» elimina la selección aplicada. No permite fechas pasadas ni una salida anterior o igual a la llegada.

Mantiene los valores de los formularios existentes, su validación y el cálculo del precio. Incluye controles con etiquetas accesibles, navegación entre días con flechas, cierre con Escape y recuperación del foco. No consulta disponibilidad real.

Validado en Chromium: selección y aplicación del rango, cancelación, borrado, salida inválida deshabilitada, navegación de meses y teclado, foco, traslado de fechas de búsqueda al alojamiento, actualización del total y apertura del resumen. Comprobado sin desbordamiento horizontal en 320, 390, 768 y 1440 px.


Fotos de referencia incorporadas a la portada, las ocho tarjetas y las galerías ampliables. Comprobadas en Chromium con conexiones externas bloqueadas: todas las imágenes cargan y el detalle no desborda en 390 px. No representan los alojamientos reales de FES.

## Publicar una demostración para iPad

La web es estática y no necesita servidor de aplicación. Para regenerar el paquete:

```sh
python3 scripts/build_site.py
```

Genera `dist/` y `fes-spa-demo.zip`. El ZIP incluye `index.html` en la raíz, CSS, JavaScript, fotos locales y cabeceras de Netlify; no incluye Git ni herramientas de desarrollo.

Para publicar manualmente, abrir https://app.netlify.com/drop en un computador, iniciar sesión y subir la carpeta `dist/` (o descomprimir el ZIP y subir su contenido como carpeta). Netlify entrega un enlace HTTPS que se puede abrir en Safari desde el iPad. Para publicar desde Git, `netlify.toml` configura el comando de preparación y la carpeta de salida.

La publicación requiere una cuenta de hosting y aún no se ha realizado desde este entorno. El paquete se comprobó en Chromium con interacción táctil y tamaños de iPad vertical (820 × 1180), horizontal (1180 × 820) y móvil. Esto no sustituye una prueba en Safari real. El sitio sigue siendo una demostración sin pagos, reservas confirmadas ni envío de consultas.

## GitHub Pages

El sitio también funciona publicado directamente desde la raíz de `main`: usa rutas relativas, imágenes locales y navegación por fragmentos. No necesita Netlify ni una compilación para GitHub Pages.

En el repositorio, abrir **Settings → Pages → Build and deployment**, elegir **Deploy from a branch**, rama **main**, carpeta **/(root)** y guardar. GitHub mostrará el enlace de publicación cuando termine. El archivo `.nojekyll` permite servir los archivos estáticos directamente.

## Revisión de estadía

El resumen «Revisa y continúa» incluye foto, fechas y huéspedes editables, y precio total. «Detalles» abre un panel separado de información del precio (desde abajo en móvil) con noches × tarifa y total, sin recargos al huésped. La comisión al propietario no se muestra como cargo en este flujo. No se inventan reseñas, calificaciones ni descuentos.

Validado en Chromium: cambio de fechas y huéspedes desde el resumen, cancelación del calendario, recálculo de 3 a 4 noches ($144.000 a $192.000), actualización de la solicitud, detalle del precio y foco al cerrar. Panel comprobado a 320, 390, 820 y 1440 px.
