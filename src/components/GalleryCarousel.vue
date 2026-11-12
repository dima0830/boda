<template>
  <div v-if="images.length" class="carrusel" aria-roledescription="carrusel" aria-label="Fotos">
    <!-- Pista deslizable: se puede arrastrar con el dedo; las flechas y puntos la mueven -->
    <div ref="pistaRef" class="pista" @scroll.passive="alDesplazar">
      <figure v-for="(image, i) in images" :key="i" class="foto" :aria-hidden="i !== actual">
        <img :src="image.src" :alt="image.alt" loading="lazy" />
      </figure>
    </div>

    <button type="button" class="flecha anterior" aria-label="Foto anterior" @click="ir(actual - 1)">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
    </button>
    <button type="button" class="flecha siguiente" aria-label="Foto siguiente" @click="ir(actual + 1)">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
    </button>

    <div class="puntos">
      <button
        v-for="(_, i) in images"
        :key="i"
        type="button"
        class="punto"
        :class="{ activo: i === actual }"
        :aria-label="`Ir a la foto ${i + 1}`"
        :aria-current="i === actual"
        @click="ir(i)"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

interface Image {
  src: string;
  alt: string;
}

const props = defineProps<{
  images: Image[];
}>();

const pistaRef = ref<HTMLElement | null>(null);
const actual = ref(0);

function ir(indice: number) {
  const pista = pistaRef.value;
  if (!pista) return;
  const total = props.images.length;
  const destino = (indice + total) % total;
  pista.scrollTo({ left: destino * pista.clientWidth, behavior: "smooth" });
  reiniciarAutoplay();
}

function alDesplazar() {
  const pista = pistaRef.value;
  if (!pista) return;
  actual.value = Math.round(pista.scrollLeft / pista.clientWidth);
}

// Avanza solo cada 6 segundos
let autoplay: ReturnType<typeof setInterval> | null = null;

function reiniciarAutoplay() {
  if (autoplay) clearInterval(autoplay);
  autoplay = setInterval(() => ir(actual.value + 1), 6000);
}

onMounted(reiniciarAutoplay);

onBeforeUnmount(() => {
  if (autoplay) clearInterval(autoplay);
});
</script>

<style scoped>
.carrusel {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.pista {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  border: 8px solid var(--tarjeta);
  border-radius: 4px;
  background: var(--tarjeta);
  box-shadow: 0 16px 32px -16px rgba(60, 50, 30, 0.45);
}

.pista::-webkit-scrollbar {
  display: none;
}

.foto {
  flex: 0 0 100%;
  margin: 0;
  aspect-ratio: 275 / 348;
  scroll-snap-align: center;
  background: #e9e3d8;
}

.foto img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.flecha {
  position: absolute;
  top: calc(50% - 14px);
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(253, 251, 247, 0.92);
  color: var(--verde);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transform: translateY(-50%);
}

.flecha svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.anterior {
  left: -14px;
}

.siguiente {
  right: -14px;
}

.puntos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  margin-top: 14px;
}

.punto {
  width: 7px;
  height: 7px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--oro-claro);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
}

.punto.activo {
  background: var(--verde);
  transform: scale(1.25);
}
</style>
