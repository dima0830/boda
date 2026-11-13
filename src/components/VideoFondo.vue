<template>
  <!--
    VIDEO DE FONDO: queda fijo detrás de toda la invitación mientras las
    secciones crema pasan por encima. Se ve en la portada, alrededor de la
    tarjeta de Celebración y entre las tarjetas de "Ver más".
    Archivo: src/assets/videos/video-fondo.mp4

    Notas para iPhone (Safari):
    - El video tiene que estar VISIBLE para que se reproduzca solo: no se oculta
      con opacidad; mientras carga se ve la imagen "poster".
    - Necesita los atributos muted y playsinline escritos en el HTML.
    - En modo ahorro de batería iOS bloquea la reproducción automática:
      entonces arranca con el primer toque o scroll de la persona.
  -->
  <div class="video-fondo" aria-hidden="true">
    <video
      v-if="!fallo"
      ref="videoRef"
      class="video"
      :src="videoUrl"
      :poster="posterUrl"
      muted
      playsinline
      webkit-playsinline
      autoplay
      loop
      preload="auto"
      disablepictureinpicture
      disableremoteplayback
      @timeupdate="vigilarTramo"
      @error="fallo = true"
    ></video>
    <img v-else :src="posterUrl" alt="" class="video" />
    <div class="oscurecer"></div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import videoUrl from "@/assets/videos/video-fondo.mp4";
import posterUrl from "@/assets/images/video-fondo-poster.webp";

/*
  Tramo del video que se repite, en segundos.
  VIDEO_FIN = null: se ve completo en bucle. Pon un número para repetir solo un tramo.
*/
const VIDEO_INICIO = 0;
const VIDEO_FIN: number | null = null;

const videoRef = ref<HTMLVideoElement | null>(null);
const fallo = ref(false);

const EVENTOS_PRIMER_GESTO = ["touchstart", "pointerdown", "scroll", "keydown"] as const;

async function reproducir() {
  const video = videoRef.value;
  if (!video || !video.paused) return;
  try {
    await video.play();
    quitarEsperaDeGesto();
  } catch {
    // bloqueado (p. ej. modo ahorro de batería): se reintenta con el primer gesto
  }
}

function quitarEsperaDeGesto() {
  EVENTOS_PRIMER_GESTO.forEach((e) => window.removeEventListener(e, reproducir));
}

/* Al volver a la pestaña o desbloquear el teléfono, iOS a veces deja el video en pausa */
function alCambiarVisibilidad() {
  if (document.visibilityState === "visible") reproducir();
}

function vigilarTramo() {
  const video = videoRef.value;
  if (video && VIDEO_FIN !== null && video.currentTime >= VIDEO_FIN) {
    video.currentTime = VIDEO_INICIO;
  }
}

onMounted(() => {
  const video = videoRef.value;
  if (!video) return;
  // iOS exige que muted y playsinline estén como atributos, no solo como propiedades
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  if (VIDEO_INICIO > 0) video.currentTime = VIDEO_INICIO;

  reproducir();
  EVENTOS_PRIMER_GESTO.forEach((e) =>
    window.addEventListener(e, reproducir, { passive: true }),
  );
  document.addEventListener("visibilitychange", alCambiarVisibilidad);
});

onBeforeUnmount(() => {
  quitarEsperaDeGesto();
  document.removeEventListener("visibilitychange", alCambiarVisibilidad);
});
</script>

<style scoped>
/* Pegado a la pantalla dentro de la invitación: no ocupa espacio en el flujo */
.video-fondo {
  position: sticky;
  top: 0;
  z-index: 0;
  height: 100vh;
  height: 100lvh;
  margin-bottom: -100vh;
  margin-bottom: -100lvh;
  overflow: hidden;
  background: #2a261d;
}

.video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* sin controles ni botón de "play" encima en iOS */
  pointer-events: none;
}

.video::-webkit-media-controls,
.video::-webkit-media-controls-start-playback-button {
  display: none !important;
  -webkit-appearance: none;
}

.oscurecer {
  position: absolute;
  inset: 0;
  background: rgba(28, 24, 16, 0.18);
}
</style>
