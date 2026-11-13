<template>
  <TarjetaDetalle titulo="Dress Code" resumen="Una orientación para tu vestuario">
    <!-- La pareja girando 360° (src/assets/videos/Couple_rotating.mp4) -->
    <template v-if="videoDressCode" #destacado>
      <VideoGiratorio :src="videoDressCode" descripcion="Pareja con traje formal y vestido de gala girando" />
    </template>

    <template #icono>
      <!-- Ícono de línea: corbatín -->
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 20 6 12v24l14-8z" />
        <path d="M28 20l14-8v24l-14-8z" />
        <rect x="20" y="18" width="8" height="12" rx="2" />
        <path d="M11 20v8M37 20v8" />
      </svg>
    </template>

    <VideoGiratorio
      v-if="videoDressCode"
      class="video-ventana"
      :src="videoDressCode"
      descripcion="Pareja con traje formal y vestido de gala girando"
    />
    <p class="subtitulo">Formal / Etiqueta</p>
    <p class="texto-seccion">
      Te invitamos a vestir con elegancia para este día tan especial.
    </p>
    <p class="texto-seccion nota">
      Con mucho cariño te pedimos evitar el <strong>blanco</strong> y sus tonos
      (marfil, crema o perla), reservados para la novia.
    </p>
  </TarjetaDetalle>
</template>

<script setup lang="ts">
import TarjetaDetalle from "@/components/TarjetaDetalle.vue";
import VideoGiratorio from "@/components/VideoGiratorio.vue";

/*
  Busca el video sin romper la página si no existe (se acepta
  src/assets/videos/Couple_rotating.mp4 o dresscode.mp4); si no hay, queda el ícono.
*/
const encontrados = import.meta.glob<string>("../assets/videos/{Couple_rotating,dresscode}.{mp4,webm,mov}", {
  eager: true,
  query: "?url",
  import: "default",
});
const videoDressCode = Object.values(encontrados)[0] ?? null;
</script>

<style scoped>
.video-ventana {
  max-width: 190px;
  margin-bottom: 16px;
}

.subtitulo {
  margin: -4px 0 10px;
  font-family: var(--fuente-mayus);
  font-size: 0.8rem;
  letter-spacing: 2px;
  color: var(--oro);
}

.nota {
  margin-top: 12px;
}
</style>
