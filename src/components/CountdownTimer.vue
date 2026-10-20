<template>
  <div class="countdown-timer">
    <div class="timer-grid">
      <div v-if="eventHasPassed" class="countdown-complete">
        La celebración ya sucedió
      </div>
      <template v-else>
        <div class="time-unit">
          <div class="time-value">{{ dias }}</div>
          <div class="time-label">Días</div>
        </div>
        <div class="time-unit">
          <div class="time-value">{{ horas }}</div>
          <div class="time-label">Horas</div>
        </div>
        <div class="time-unit">
          <div class="time-value">{{ minutos }}</div>
          <div class="time-label">Min</div>
        </div>
        <div class="time-unit">
          <div class="time-value">{{ segundos }}</div>
          <div class="time-label">Seg</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

interface Props {
  eventDate?: string;
}

// FECHA CONFIGURADA: 22 de Abril de 2027 a las 06:00 PM (hora Colombia / UTC-5)
const props = withDefaults(defineProps<Props>(), {
  eventDate: "2027-04-23T18:00:00-05:00",
});

const dias = ref<string | number>(0);
const horas = ref<string | number>("00");
const minutos = ref<string | number>("00");
const segundos = ref<string | number>("00");
const eventHasPassed = ref(false);

let interval: ReturnType<typeof setInterval> | null = null;

// Función para rellenar con un cero a la izquierda si es menor a 10
const padZero = (num: number) => String(num).padStart(2, "0");

function calcularTiempo() {
  const targetDate = new Date(props.eventDate).getTime();
  
  if (isNaN(targetDate)) {
    console.error("Formato de fecha inválido en eventDate:", props.eventDate);
    return;
  }

  const distance = targetDate - Date.now();
  eventHasPassed.value = distance <= 0;

  if (distance <= 0) {
    dias.value = 0;
    horas.value = "00";
    minutos.value = "00";
    segundos.value = "00";
    return;
  }

  dias.value = Math.floor(distance / (1000 * 60 * 60 * 24));
  horas.value = padZero(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  minutos.value = padZero(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
  segundos.value = padZero(Math.floor((distance % (1000 * 60)) / 1000));
}

// Reactiva el contador si cambias la propiedad externamente
watch(() => props.eventDate, () => {
  calcularTiempo();
});

onMounted(() => {
  calcularTiempo();
  interval = setInterval(calcularTiempo, 1000);
});

onBeforeUnmount(() => {
  if (interval) clearInterval(interval);
});
</script>

<style scoped>
.countdown-timer {
  width: 100%;
  padding: 2.5rem 0;
}

.timer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  justify-content: center;
  justify-items: center;
  max-width: min(100%, 320px);
  margin: 0 auto;
}

.time-unit {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  text-align: center;
  transition: transform 0.3s ease;
}

.time-unit:hover {
  transform: scale(1.1);
}

.time-value {
  font-size: clamp(3rem, 8vw, 4rem);
  font-weight: 500;
  color: #20534a;
  font-family: "Cormorant", serif;
  line-height: 0.8;
}

.time-label {
  margin-top: 0.75rem;
  color: #20534a;
  font-family: "Open Sans", sans-serif;
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.countdown-complete {
  grid-column: span 4;
  font-family: "Cormorant", serif;
  font-size: 1.5rem;
  color: #20534a;
  text-align: center;
}

@media (max-width: 480px) {
  .timer-grid {
    gap: 0.75rem;
  }

  .time-value {
    font-size: clamp(1.1rem, 8vw, 2rem);
  }

  .time-label {
    font-size: 0.7rem;
  }
}
</style>