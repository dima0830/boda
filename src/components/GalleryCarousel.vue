<template>
  <div v-if="images.length" class="gallery-carousel" aria-live="polite">
    <div class="gallery-frame-wrapper">
      <!-- MARIPOSAS DECORATIVAS CON LAS IMÁGENES -->
      <img
        src="@/assets/images/mariposa.png"
        alt="Mariposa esmeralda y dorada"
        class="mariposa-img m1"
      />
      <img
        src="@/assets/images/mariposa-.png"
        alt="Mariposa verde perfil"
        class="mariposa-img m2"
      />
      <img
        src="@/assets/images/mariposa.png"
        alt="Mariposa esmeralda y dorada"
        class="mariposa-img m3"
      />
      <img
        src="@/assets/images/mariposa-.png"
        alt="Mariposa verde perfil"
        class="mariposa-img m4"
      />

      <!-- CONTENEDOR DE LA IMAGEN (275px x 348px) -->
      <div class="gallery-frame">
        <img :src="images[current].src" :alt="images[current].alt" />
      </div>

      <!-- FLECHAS LATERALES -->
      <button 
        type="button" 
        class="gallery-arrow gallery-prev" 
        aria-label="Imagen anterior"
        @click="prev"
      >
        &#10094;
      </button>
      <button 
        type="button" 
        class="gallery-arrow gallery-next" 
        aria-label="Imagen siguiente"
        @click="next"
      >
        &#10095;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

interface Image {
  src: string;
  alt: string;
}

interface Props {
  images: Image[];
}

const props = defineProps<Props>();

const current = ref(0);
const total = computed(() => props.images.length);

function next() {
  current.value = current.value === total.value - 1 ? 0 : current.value + 1;
}

function prev() {
  current.value = current.value === 0 ? total.value - 1 : current.value - 1;
}

// Auto-advance
let autoplayInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  autoplayInterval = setInterval(() => {
    next();
  }, 15000);
});

onBeforeUnmount(() => {
  if (autoplayInterval) clearInterval(autoplayInterval);
});
</script>

<style scoped>
.gallery-carousel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  width: 95%;
  margin: 0 auto;
}

/* CONTENEDOR RELATIVO DEL TAMAÑO DE LA IMAGEN */
.gallery-frame-wrapper {
  position: relative;
  width: 275px;
  margin: 0 auto;
}

/* MARCO Y IMAGEN CON DIMENSIÓN EXACTA DE 275px x 348px */
.gallery-frame {
  position: relative;
  overflow: hidden;
  width: 275px;
  height: 348px;
  aspect-ratio: 275 / 348;
  border-radius: 20px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  background: #f4efe8;
}

.gallery-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.5s ease;
}

/* ESTILOS Y POSICIONAMIENTO DE LAS MARIPOSAS */
.mariposa-img {
  position: absolute;
  height: auto;
  z-index: 3;
  pointer-events: none;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
  animation: aleteo 3.5s ease-in-out infinite alternate;
}

/* Posiciones y tamaños individuales */
.m1 {
  width: 55px;
  top: -20px;
  left: -15px;
  transform: rotate(-12deg);
  animation-delay: 0s;
}

.m2 {
  width: 42px;
  top: 10px;
  right: -18px;
  transform: rotate(15deg);
  animation-delay: 0.8s;
}

.m3 {
  width: 48px;
  bottom: -15px;
  left: 10px;
  transform: rotate(-25deg);
  animation-delay: 1.5s;
}

.m4 {
  width: 38px;
  bottom: 15px;
  right: -12px;
  transform: rotate(5deg);
  animation-delay: 2.2s;
}

/* Animación de flotación suave */
@keyframes aleteo {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  100% {
    transform: translateY(-6px) rotate(6deg) scale(1.04);
  }
}

/* ESTILOS DE LAS FLECHAS LATERALES */
.gallery-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.8);
  color: #b59848;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  z-index: 4;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.gallery-arrow:hover {
  background-color: #ffffff;
  color: #8c7233;
  transform: translateY(-50%) scale(1.1);
}

.gallery-prev {
  left: -17px;
}

.gallery-next {
  right: -17px;
}
</style>