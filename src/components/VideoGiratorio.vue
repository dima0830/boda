<template>
  <!--
    Video corto en bucle (p. ej. la pareja girando 360° para el Dress Code),
    enmarcado en una ventana en arco con filete dorado, como un retrato.
  -->
  <div class="arco">
  <video
    ref="videoRef"
    class="video-giratorio"
    :src="src"
    muted
    playsinline
    webkit-playsinline
    autoplay
    loop
    preload="auto"
    disablepictureinpicture
    disableremoteplayback
    :aria-label="descripcion"
    role="img"
  ></video>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

defineProps<{
  src: string;
  descripcion: string;
}>();

const videoRef = ref<HTMLVideoElement | null>(null);
let observador: IntersectionObserver | null = null;

onMounted(() => {
  const video = videoRef.value;
  if (!video) return;
  // iOS exige estos atributos escritos en el HTML para reproducir solo
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");

  // solo se reproduce mientras está en pantalla (ahorra batería)
  observador = new IntersectionObserver(([entrada]) => {
    if (entrada.isIntersecting) video.play().catch(() => {});
    else video.pause();
  });
  observador.observe(video);
});

onBeforeUnmount(() => observador?.disconnect());
</script>

<style scoped>
/* Ventana en arco: el fondo beige del video queda como parte del marco */
.arco {
  position: relative;
  width: 100%;
  max-width: 220px;
  aspect-ratio: 4 / 5;
  margin: 0 auto;
  border-radius: 999px 999px 10px 10px;
  overflow: hidden;
  background: #f2ecda; /* mismo tono que el fondo del video */
  box-shadow: 0 12px 24px -14px rgba(60, 50, 30, 0.45);
}

/* filete dorado interior */
.arco::after {
  content: "";
  position: absolute;
  inset: 6px;
  border: 1px solid var(--oro-claro);
  border-radius: 999px 999px 6px 6px;
  pointer-events: none;
}

.video-giratorio {
  display: block;
  width: 100%;
  height: 100%;
  /* el video es horizontal: se recorta al centro, donde está la pareja */
  object-fit: cover;
  object-position: 50% 100%;
  pointer-events: none;
}

.video-giratorio::-webkit-media-controls-start-playback-button {
  display: none !important;
  -webkit-appearance: none;
}
</style>
