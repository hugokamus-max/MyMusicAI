# Ritmo

Prototipo web instalable para descubrir música, pedir recomendaciones por texto o voz y abrir canciones, videoclips y versiones de karaoke en los reproductores oficiales de YouTube.

## Qué funciona en esta versión

- Interfaz adaptable a teléfono y escritorio, con base PWA para instalar desde el navegador.
- Recomendaciones de muestra con categorías por estado de ánimo.
- Asistente de demostración por texto que cambia la selección según la intención detectada.
- Dictado por micrófono con reconocimiento de voz del navegador, si el navegador lo admite.
- Acciones para abrir canciones en YouTube Music y búsquedas de videoclips o karaoke en YouTube.

## Qué falta para completar el producto

- Conectar un modelo de IA real para conversaciones y recomendaciones personalizadas.
- Cuentas, biblioteca personal y listas.
- Integración con un catálogo de letras que permita su uso dentro de la app. Las letras sincronizadas necesitan derechos de exhibición.
- Motor de karaoke que sincronice letras y evalúe la voz. Esta versión no graba ni puntúa la voz.
- Aplicaciones nativas para las tiendas de iOS y Android. La PWA es el primer paso para probar en varios dispositivos.

## Límites del reproductor

Este prototipo abre música en YouTube Music y búsquedas de video en YouTube; no extrae ni reproduce audio de YouTube dentro de un reproductor propio. Las integraciones deben respetar las [políticas para desarrolladores de YouTube](https://developers.google.com/youtube/terms/developer-policies-guide) y el [reproductor integrado oficial](https://developers.google.com/youtube/player_parameters/).

## Abrir

Abre `index.html` en un navegador. Para probar la instalación PWA y el modo sin conexión, publícalo en un servidor con HTTPS (por ejemplo, GitHub Pages) o sirve esta carpeta localmente por HTTP.

