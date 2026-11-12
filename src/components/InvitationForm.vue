<template>
  <section id="confirmar" v-revelar class="seccion confirmacion panel">
    <h2 class="titulo-seccion">Confirmación</h2>
    <p class="texto-seccion">¿Nos acompañas en este día tan especial?</p>

    <!-- Ícono de línea: lista con vistos -->
    <svg class="icono-linea" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6 12l3 3 6-6M6 25l3 3 6-6" />
      <circle cx="10" cy="38" r="2.5" fill="currentColor" />
      <path d="M22 12h20M22 25h20M22 38h20" stroke-width="3" />
    </svg>

    <p v-if="submitted" class="texto-seccion gracias">
      <template v-if="isAttending">
        ¡Gracias, <strong>{{ submittedName }}</strong>! Recibimos tu confirmación
        con {{ submittedPasses }} {{ submittedPasses === 1 ? "pase" : "pases" }}.
      </template>
      <template v-else>
        Gracias por avisarnos, <strong>{{ submittedName }}</strong>. Te vamos a extrañar.
      </template>
    </p>
    <button v-else type="button" class="btn-verde" @click="abierta = true">
      Confirmar asistencia
    </button>

    <VentanaModal :abierta="abierta" titulo="¿Asistes a la celebración?" @cerrar="abierta = false">
      <template #icono>
        <!-- copas de brindis -->
        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10 8h10l-1 11a4 4 0 0 1-8 0z" />
          <path d="M15 23v14M11 37h8" />
          <path d="M28 8h10l-1 11a4 4 0 0 1-8 0z" />
          <path d="M33 23v14M29 37h8" />
          <path d="M22 4l2-2M24 7h3M20 3V0" />
        </svg>
      </template>

      <form class="rsvp-form" @submit.prevent="confirmAttendance">
        <div class="radios" role="radiogroup" aria-label="¿Asistirás?">
          <label v-for="opcion in opcionesAsistencia" :key="opcion.valor" class="radio">
            <input v-model="attendance" type="radio" name="asistencia" :value="opcion.valor" />
            <span>{{ opcion.texto }}</span>
          </label>
        </div>

        <label class="campo">
          <span class="campo-etiqueta">Nombre completo*</span>
          <input v-model="guestName" type="text" required autocomplete="name" class="campo-entrada" placeholder="Ingresa tu nombre completo" />
        </label>

        <label class="campo">
          <span class="campo-etiqueta">Número móvil</span>
          <input v-model="guestPhone" type="tel" autocomplete="tel" class="campo-entrada" placeholder="Ej: 300 123 4567" />
        </label>

        <fieldset v-if="isAttending" class="campo">
          <legend class="campo-etiqueta">Según tu pase asignado, ¿cuántos pases usarás?</legend>
          <div class="pases">
            <button
              v-for="num in [1, 2, 3]"
              :key="num"
              type="button"
              class="pase"
              :class="{ activo: passesCount === num }"
              :aria-pressed="passesCount === num"
              @click="passesCount = num"
            >
              {{ num }}
            </button>
          </div>
        </fieldset>

        <label class="campo">
          <span class="campo-etiqueta">Mensaje para los novios</span>
          <input v-model="guestMessage" type="text" class="campo-entrada" placeholder="Escribe algo bonito… (opcional)" />
        </label>

        <p v-if="confirmationError" class="error">{{ confirmationError }}</p>

        <button class="btn-verde enviar" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? "Enviando..." : "Enviar asistencia" }}
        </button>
      </form>
    </VentanaModal>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import VentanaModal from "@/components/VentanaModal.vue";

// Los valores se guardan igual que antes en /api/rsvp
const SI_ASISTE = "Acepto con mucho gusto";
const NO_ASISTE = "Lamentablemente no puedo asistir";
const opcionesAsistencia = [
  { valor: SI_ASISTE, texto: "¡Sí, confirmo!" },
  { valor: NO_ASISTE, texto: "No puedo 😢" },
];

const abierta = ref(false);
const guestName = ref("");
const guestPhone = ref("");
const guestMessage = ref("");
const attendance = ref("");
const passesCount = ref<number | null>(null);
const confirmationError = ref("");

const isSubmitting = ref(false);
const submitted = ref(false);
const submittedName = ref("");
const submittedPasses = ref(0);

const isAttending = computed(() => attendance.value === SI_ASISTE);

async function confirmAttendance() {
  if (!attendance.value) {
    confirmationError.value = "Por favor selecciona si asistirás.";
    return;
  }
  if (!guestName.value.trim()) {
    confirmationError.value = "Por favor escribe tu nombre completo.";
    return;
  }
  if (isAttending.value && !passesCount.value) {
    confirmationError.value = "Por favor selecciona cuántos pases usarás.";
    return;
  }

  confirmationError.value = "";
  isSubmitting.value = true;
  const pases = isAttending.value ? (passesCount.value ?? 0) : 0;

  try {
    const response = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: guestName.value.trim(),
        phone: guestPhone.value.trim(),
        attendance: attendance.value,
        passesCount: pases,
        message: guestMessage.value.trim(),
      }),
    });
    if (!response.ok) throw new Error("No se pudo guardar la confirmación.");
    submittedName.value = guestName.value.trim();
    submittedPasses.value = pases;
    submitted.value = true;
    abierta.value = false;
  } catch {
    confirmationError.value =
      "No pudimos guardar tu confirmación. Por favor intenta nuevamente.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.confirmacion {
  padding-top: 30px;
  padding-bottom: 100px;
}

.gracias {
  margin-top: 4px;
}

.rsvp-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
}

.radios {
  display: flex;
  justify-content: center;
  gap: 22px;
  margin-bottom: 4px;
}

.radio {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1.05rem;
  color: var(--titulo);
  cursor: pointer;
}

.radio input {
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: var(--verde);
}

.pases {
  display: flex;
  gap: 10px;
  margin-top: 6px;
}

.pase {
  width: 42px;
  height: 42px;
  padding: 0;
  border: 1px solid var(--oro-claro);
  border-radius: 50%;
  background: transparent;
  font-family: var(--fuente-titulo);
  font-size: 1.2rem;
  color: var(--titulo);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.pase.activo {
  border-color: var(--verde);
  background: var(--verde);
  color: #fff;
}

.error {
  margin: 0;
  font-size: 0.95rem;
  color: #9b3b26;
  text-align: center;
}

.enviar {
  align-self: center;
  margin-top: 6px;
}
</style>
