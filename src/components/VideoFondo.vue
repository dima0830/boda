<template>
  <!--
    VIDEO DE FONDO: queda fijo detrás de toda la invitación mientras las
    secciones crema pasan por encima. Se ve en la portada, alrededor de la
    tarjeta de Celebración y entre las tarjetas de "Ver más".
    Archivo: src/assets/videos/video-ejemplo.mp4 (provisional hasta tener el video final).
  -->
  <div class="video-fondo" aria-hidden="true">
    <img src="@/assets/images/principal.jpg" alt="" class="respaldo" />
    <video
      v-if="!fallo"
      ref="videoRef"
      class="video"
      :class="{ listo }"
      :src="videoUrl"
      muted
      playsinline
      autoplay
      loop
      preload="auto"
      @loadedmetadata="iniciar"
      @playing="listo = true"
      @timeupdate="vigilarTramo"
      @error="fallo = true"
    ></video>
    <div class="oscurecer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import videoUrl from "@/assets/videos/video-ejemplo.mp4";

/*
  Tramo del video que se repite, en segundos.
  VIDEO_FIN = null: se ve completo en bucle. Pon un número para repetir solo un tramo.
*/
const VIDEO_INICIO = 0;
const VIDEO_FIN: number | null = null;

const videoRef = ref<HTMLVideoElement | null>(null);
const listo = ref(false);
const fallo = ref(false);

async function iniciar() {
  const video = videoRef.value;
  if (!video) return;
  video.currentTime = VIDEO_INICIO;
  try {
    await video.play();
  } catch {
    // reproducción automática bloqueada (p. ej. modo ahorro de batería): queda la foto de respaldo
  }
}

function vigilarTramo() {
  const video = videoRef.value;
  if (video && VIDEO_FIN !== null && video.currentTime >= VIDEO_FIN) {
    video.currentTime = VIDEO_INICIO;
  }
}
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

.respaldo,
.video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video {
  opacity: 0;
  transition: opacity 1.2s ease;
}

.video.listo {
  opacity: 1;
}

.oscurecer {
  position: absolute;
  inset: 0;
  background: rgba(28, 24, 16, 0.18);
}

@media (prefers-reduced-motion: reduce) {
  .video {
    display: none;
  }
}
</style>
