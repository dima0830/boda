<template>
  <!-- Botón flotante de música, en la esquina inferior derecha (como en el video) -->
  <button
    type="button"
    class="musica-flotante"
    :class="{ sonando }"
    :aria-label="sonando ? 'Pausar música' : 'Reproducir música'"
    @click="alternar"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18V6l11-2v12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="6.5" cy="18" r="2.5" fill="currentColor" />
      <circle cx="17.5" cy="16" r="2.5" fill="currentColor" />
    </svg>
    <span class="texto">{{ sonando ? "Pausar" : "Música" }}</span>

    <audio ref="audioRef" :src="cancionUrl" preload="none" loop></audio>
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import cancionUrl from "@/assets/audio/Joan-Sebastian-Disename.mp3";

const audioRef = ref<HTMLAudioElement | null>(null);
const sonando = ref(false);

async function alternar() {
  const audio = audioRef.value;
  if (!audio) return;
  if (audio.paused) {
    try {
      await audio.play();
      sonando.value = true;
    } catch (error) {
      sonando.value = false;
      console.error("No se pudo reproducir el audio.", error);
    }
  } else {
    audio.pause();
    sonando.value = false;
  }
}
</script>

<style scoped>
.musica-flotante {
  position: fixed;
  /* pegado al borde derecho de la invitación (480 px) en pantallas grandes */
  right: max(14px, calc(50% - 240px + 14px));
  bottom: 18px;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  width: 54px;
  height: 54px;
  padding: 7px 0 0;
  border: 1px solid var(--oro-claro);
  border-radius: 50%;
  background: rgba(253, 251, 247, 0.94);
  color: var(--titulo);
  box-shadow: 0 8px 18px -8px rgba(60, 50, 30, 0.5);
  cursor: pointer;
}

.musica-flotante svg {
  width: 22px;
  height: 22px;
}

.sonando svg {
  animation: vaiven 1.2s ease-in-out infinite;
}

.texto {
  font-family: var(--fuente-texto);
  font-size: 0.7rem;
  line-height: 1;
}

@keyframes vaiven {
  0%,
  100% {
    transform: rotate(-8deg);
  }
  50% {
    transform: rotate(8deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .sonando svg {
    animation: none;
  }
}
</style>
