# Ritmo

App web instalable para descubrir música por estado de ánimo y abrir canciones, videoclips y versiones de karaoke en los reproductores oficiales de YouTube. La asistencia de IA está pausada por ahora.

## Demo pública

Abre [Ritmo en Render](https://ritmo-ai.onrender.com).

## Qué funciona en esta versión

- Interfaz adaptable a teléfono y escritorio, con base PWA para instalar desde el navegador.
- Selecciones de canciones organizadas por estado de ánimo.
- Búsqueda de canciones en YouTube Music.
- Búsqueda de videoclips y karaoke en YouTube.
- No se envían solicitudes a OpenAI ni se necesita una clave de API.

## Iniciar en tu computadora

Se necesita Node.js. Inicia el servidor con:

```powershell
npm start
```

Luego abre `http://localhost:3000`.

## Qué falta para completar el producto

- Cuentas, biblioteca personal y listas.
- Integración con un catálogo de letras que permita su uso dentro de la app. Las letras sincronizadas necesitan derechos de exhibición.
- Motor de karaoke que sincronice letras y evalúe la voz. Esta versión abre búsquedas de karaoke en YouTube y no graba ni puntúa la voz.
- Aplicaciones nativas para las tiendas de iOS y Android. La PWA sirve para probar en varios dispositivos desde el navegador.
- La asistencia de IA queda para una etapa posterior.

## Límites del reproductor

Este prototipo abre música en YouTube Music y búsquedas de video en YouTube; no extrae ni reproduce audio de YouTube dentro de un reproductor propio. Las integraciones deben respetar las [políticas para desarrolladores de YouTube](https://developers.google.com/youtube/terms/developer-policies-guide) y el [reproductor integrado oficial](https://developers.google.com/youtube/player_parameters/).

## Publicar

GitHub guarda el código fuente. El archivo `render.yaml` prepara el servidor Node para desplegar Ritmo en Render.

El plan gratuito de Render puede suspender el servicio tras un período sin tráfico y tardar en volver a iniciar. La app está pensada para ser pública y explorar ingresos. Consulta la [hoja de ruta](ROADMAP.md) para ver las decisiones y permisos que falta resolver antes de monetizar música o karaoke.

