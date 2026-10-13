# Ritmo

App web instalable para descubrir música, pedir recomendaciones por texto o voz y abrir canciones, videoclips y versiones de karaoke en los reproductores oficiales de YouTube.

## Qué funciona en esta versión

- Interfaz adaptable a teléfono y escritorio, con base PWA para instalar desde el navegador.
- Recomendaciones de muestra con categorías por estado de ánimo.
- Asistente de demostración si no hay una clave configurada; con una clave usa OpenAI Responses API para conversar y sugerir canciones.
- Dictado por micrófono con reconocimiento de voz del navegador, si el navegador lo admite.
- Lectura en voz alta de la respuesta con la voz disponible en el navegador.
- Acciones para abrir canciones en YouTube Music y búsquedas de videoclips o karaoke en YouTube.

## Iniciar en tu computadora

Se necesita Node.js. Copia `.env.example` a `.env`, agrega tu clave de API y luego inicia el servidor:

```powershell
Copy-Item .env.example .env
# Edita .env y reemplaza pega_tu_clave_aqui
node server.js
```

La clave se queda en `.env`, que Git ignora. No la publiques ni la pegues en el chat. Sin clave, la app sigue funcionando en modo de muestra. La API de OpenAI puede generar cargos según tu cuenta y uso.

## Qué falta para completar el producto

- Cuentas, biblioteca personal y listas.
- Integración con un catálogo de letras que permita su uso dentro de la app. Las letras sincronizadas necesitan derechos de exhibición.
- Motor de karaoke que sincronice letras y evalúe la voz. Esta versión no graba ni puntúa la voz.
- Aplicaciones nativas para las tiendas de iOS y Android. La PWA sirve para probar en varios dispositivos desde el navegador.

## Límites del reproductor

Este prototipo abre música en YouTube Music y búsquedas de video en YouTube; no extrae ni reproduce audio de YouTube dentro de un reproductor propio. Las integraciones deben respetar las [políticas para desarrolladores de YouTube](https://developers.google.com/youtube/terms/developer-policies-guide) y el [reproductor integrado oficial](https://developers.google.com/youtube/player_parameters/).

## Publicar

GitHub guarda el código fuente. Para usar la IA en línea, el servidor Node también debe desplegarse en un servicio que mantenga la clave como secreto; GitHub Pages por sí solo no ejecuta el servidor.

La app está pensada para ser pública y explorar ingresos. Consulta la [hoja de ruta](ROADMAP.md) para ver las decisiones y permisos que falta resolver antes de monetizar música o karaoke.
