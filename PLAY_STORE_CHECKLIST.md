# Ritmo en Google Play — preparación

## Datos de la app

- Nombre provisional en la tienda: Ritmo
- Identificador Android confirmado: `com.hugokamus.ritmoai`
- Sitio: https://ritmo-ai.onrender.com/
- Cuenta seleccionada: personal
- Correo de soporte y privacidad: hugom4541@gmail.com
- Formato a subir: Android App Bundle (`.aab`)
- API objetivo para una app nueva hoy: Android 16 / API 36

## Lo que ya preparamos en el proyecto

- Política de privacidad en `privacy.html` y enlace desde la app. Debe revisarse antes de publicarla.
- Ficha de tienda preliminar en `PLAY_LISTING_DRAFT.md`.
- Iconos PNG de 192 y 512 píxeles para el manifiesto instalable.
- Biblioteca de favoritos local, sin cuenta ni sincronización.
- Manifiesto web con ruta inicial y alcance consistentes.
- La app no pide permisos de micrófono ni ubicación y la IA permanece desactivada.

## Pasos para poder publicar

1. Crear/verificar la cuenta personal de Play Console. Google cobra US$25 una sola vez por registro. Google puede pedir documento oficial, dirección y verificación de teléfono/correo. En cuentas personales nuevas, Google muestra el nombre legal, país y correo de desarrollador según los datos del perfil. Decide antes qué nombre y correo quieres hacer públicos.
2. Crear la ficha de Ritmo y completar la clasificación de contenido, público objetivo, anuncios y formulario de Seguridad de los datos con las prácticas reales de la app y sus proveedores.
3. Revisar la política `privacy.html`, publicarla en una URL HTTPS estable y usar la misma URL en Play Console.
4. Generar el proyecto Android Trusted Web Activity (TWA) con Bubblewrap, usar el identificador confirmado, comprobar que el sitio abre dentro de la app y generar el `.aab`.
5. Crear y guardar de forma segura la clave de firma. No subir el keystore, sus contraseñas ni archivos de firma a GitHub. Configurar los Digital Asset Links con la huella de la clave que Google Play usará para firmar la app.
6. Subir primero a una prueba interna. Si esta es una cuenta personal creada después del 13 de noviembre de 2023, Google exige una prueba cerrada con al menos 12 personas inscritas continuamente durante 14 días y luego solicitar acceso a producción.
7. Completar ficha de tienda: descripción, capturas de pantalla de Android, icono de tienda de 512×512, gráfico promocional si se solicita y datos de contacto; enviar a revisión.

## Bloqueos técnicos actuales

- La carpeta local de este paquete no tiene remoto Git configurado; el repositorio publicado se administra por GitHub y se debe actualizar allí después de revisar los cambios.
- En este equipo detecté Node, pero no Java, `keytool`, Android SDK ni Gradle disponibles en PATH. Bubblewrap necesita herramientas Android para producir y firmar el `.aab`; todavía no se generó un binario.
- El servidor ya permitirá servir `/.well-known/assetlinks.json`. La verificación de pantalla completa TWA depende de ese archivo y requiere la huella de firma definitiva; todavía no se creó ni debe inventarse.
- Ritmo sigue dependiendo de YouTube/YouTube Music para reproducir música y video. Los favoritos locales agregan una función propia, pero Google revisa cada app y no se puede garantizar aprobación. Antes de enviar, habrá que probar la app en Android y seguir ampliando utilidad propia si las pruebas o las políticas lo requieren.

## Observación sobre monetización

La cuenta personal puede monetizar, pero Google indica que la dirección completa del comerciante puede aparecer públicamente si monetizas mediante apps pagas o compras dentro de la app. Verifica en Play Console qué datos se mostrarán según la forma de monetización elegida.

