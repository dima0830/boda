<template>
  <div class="countdown-timer">
    <p v-if="eventHasPassed" class="countdown-complete">¡Hoy es el gran día!</p>
    <div v-else class="timer-grid">
      <div v-for="unidad in unidades" :key="unidad.etiqueta" class="time-unit">
        <span class="time-value">{{ unidad.valor }}</span>
        <span class="time-label">{{ unidad.etiqueta }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

interface Props {
  eventDate?: string;
}

// FECHA CONFIGURADA: 22 de diciembre de 2026 a las 6:00 p. m. (hora Colombia / UTC-5)
const props = withDefaults(defineProps<Props>(), {
  eventDate: "2026-12-22T18:00:00-05:00",
});

const restante = ref(0);
const eventHasPassed = computed(() => restante.value <= 0);

const unidades = computed(() => {
  const ms = Math.max(restante.value, 0);
  return [
    { valor: Math.floor(ms / 86400000), etiqueta: "Días" },
    { valor: Math.floor((ms % 86400000) / 3600000), etiqueta: "hs" },
    { valor: Math.floor((ms % 3600000) / 60000), etiqueta: "min" },
    { valor: Math.floor((ms % 60000) / 1000), etiqueta: "seg" },
  ];
});

let interval: ReturnType<typeof setInterval> | null = null;

function calcularTiempo() {
  const objetivo = new Date(props.eventDate).getTime();
  if (isNaN(objetivo)) {
    console.error("Formato de fecha inválido en eventDate:", props.eventDate);
    return;
  }
  restante.value = objetivo - Date.now();
}

watch(() => props.eventDate, calcularTiempo);

onMounted(() => {
  calcularTiempo();
  interval = setInterval(calcularTiempo, 1000);
});

onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
});
</script>

<style scoped>
.timer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 300px;
  margin: 8px auto 0;
}

.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2px 0;
}

/* líneas verticales finas entre las unidades */
.time-unit + .time-unit {
  border-left: 1px solid var(--linea);
}

.time-value {
  font-family: var(--fuente-titulo);
  font-size: 2.4rem;
  font-weight: 500;
  line-height: 1.1;
  color: var(--titulo);
  font-variant-numeric: lining-nums tabular-nums;
}

.time-label {
  font-size: 0.95rem;
  font-style: italic;
  color: var(--tinta);
}

.countdown-complete {
  margin: 0;
  font-family: var(--fuente-titulo);
  font-size: 1.6rem;
  color: var(--titulo);
}
</style>
