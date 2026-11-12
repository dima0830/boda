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
import galleryOne from "@/assets/images/gal1.jpg";
import galleryTwo from "@/assets/images/gal2.jpg";
import galleryThree from "@/assets/images/gal3.jpg";
import galleryFour from "@/assets/images/gal4.jpg";
import galleryFive from "@/assets/images/gal5.jpg";
import gallerySix from "@/assets/images/gal6.jpg";
import gallerySeven from "@/assets/images/gal7.jpg";
import galleryEight from "@/assets/images/gal8.jpg";
import galleryNine from "@/assets/images/gal9.jpg";
import galleryTen from "@/assets/images/gal10.jpg";
import galleryEleven from "@/assets/images/gal11.jpg";
import galleryTwelve from "@/assets/images/gal12.jpg";
import galleryThirteen from "@/assets/images/gal13.jpg";
import galleryFourteen from "@/assets/images/gal14.jpg";

const galleryImages = [
  galleryOne,
  galleryTwo,
  galleryThree,
  galleryFour,
  galleryFive,
  gallerySix,
  gallerySeven,
  galleryEight,
  galleryNine,
  galleryTen,
  galleryEleven,
  galleryTwelve,
  galleryThirteen,
  galleryFourteen,
].map((src, i) => ({ src, alt: `Recuerdo ${i + 1} de Andrea y Juan Carlos` }));
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
