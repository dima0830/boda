<template>
  <section id="fotos" class="retratos panel">
    <div v-revelar class="seccion">
    <h2 class="titulo-seccion">Retratos de nuestro amor</h2>
    <p class="texto-seccion">La clave es disfrutar cada momento</p>

    <!-- Ícono de línea: cámara -->
    <svg
      class="icono-linea"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M6 16h8l3-5h14l3 5h8v22H6z" />
      <circle cx="24" cy="26" r="7" />
      <path d="M36 21h2" />
      <path d="M22 4v3M30 5l-2 3M14 5l2 3" />
    </svg>

    <GalleryCarousel :images="galleryImages" />
    </div>
  </section>
</template>

<script setup lang="ts">
import GalleryCarousel from "@/components/GalleryCarousel.vue";
/*
  Fotos de la galería: cualquier src/assets/images/galN.webp (gal1, gal2, …),
  en orden por número. Para agregar una foto basta con dejar el archivo ahí.
*/
const archivos = import.meta.glob<string>("../assets/images/gal*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});
const numero = (ruta: string) => Number(ruta.match(/gal(\d+)/)?.[1] ?? 0);

const galleryImages = Object.keys(archivos)
  .sort((a, b) => numero(a) - numero(b))
  .map((ruta) => archivos[ruta])
  .map((src, i) => ({ src, alt: `Recuerdo ${i + 1} de Andrea y Juan Carlos` }));
</script>

<style scoped>
.retratos {
  overflow: hidden;
}

.retratos .seccion {
  padding-top: 100px;
  padding-bottom: 100px;
}

.retratos .icono-linea {
  margin-bottom: 18px;
}
</style>
