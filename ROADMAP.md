# Hoja de ruta de Ritmo

Ritmo es una app pública de descubrimiento musical con asistencia de IA. El producto puede generar ingresos, así que las funciones de música y karaoke deben respetar los permisos del catálogo y del proveedor.

## Ya disponible en el prototipo

- App web adaptable e instalable (PWA).
- Recomendaciones de muestra por estado de ánimo.
- Asistente de texto con OpenAI cuando se configura una clave; modo de muestra sin ella.
- Dictado y lectura en voz alta según las funciones del navegador.
- Enlaces para abrir canciones en YouTube Music y buscar videoclips o karaoke en YouTube.

## Siguiente etapa: producto usable

1. Publicar la PWA y conectar el servidor de IA con una clave guardada como secreto.
2. Mejorar descubrimiento, búsqueda y recomendaciones; guardar preferencias solo con consentimiento.
3. Mantener YouTube como enlace al reproductor oficial para música, videoclips y karaoke.
4. Diseñar una integración de catálogo comercial solo después de revisar por escrito el acceso, territorios, monetización, playback, voz y sincronización audiovisual.
5. Añadir cuentas y biblioteca personal cuando haya un servicio de almacenamiento y política de privacidad definidos.

## Karaoke avanzado

La búsqueda de videos de karaoke puede probarse mediante YouTube. Letras sincronizadas, pistas instrumentales, separación de voces y puntuación del canto requieren permisos y tecnología adicionales. No se debe separar ni alterar el audio de videos de YouTube. La primera versión avanzada debe usar pistas y letras con licencia explícita para ese uso.

## Modelo de ingresos por explorar

- Suscripción o publicidad para funciones propias de Ritmo, si la integración musical elegida lo permite.
- Nunca cobrar por acceder a videos incrustados de YouTube ni ocultar anuncios de su reproductor.
- No basar la reproducción comercial en Spotify sin autorización específica: sus políticas restringen la monetización de apps de streaming y prohíben algunas funciones de asistente por voz.
- Apple MusicKit permite playback en web y Android para personas con acceso a Apple Music, pero su encaje con el modelo de ingresos y las funciones de karaoke debe validarse en los términos vigentes antes de adoptarlo.
- Antes de lanzar, verificar las condiciones con los proveedores y titulares de derechos; esta hoja de ruta no sustituye esa revisión.

## Fuentes oficiales consultadas

- [Políticas de YouTube para desarrolladores](https://developers.google.com/youtube/terms/developer-policies-guide)
- [Política de Spotify para desarrolladores](https://developer.spotify.com/policy)
- [MusicKit de Apple](https://developer.apple.com/musickit/)
- [Términos de Apple Media Services](https://www.apple.com/legal/internet-services/itunes/do/terms-en.html)
