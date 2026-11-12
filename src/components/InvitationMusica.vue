<template>
  <TarjetaDetalle
    titulo="Música"
    resumen="¿Cuál es la canción que no puede faltar en la lista de reproducción de la fiesta?"
    texto-boton="Sugerir canción"
    titulo-ventana="Sugerir canción"
  >
    <template #icono>
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M18 34V12l20-5v22" />
        <circle cx="13" cy="34" r="5" />
        <circle cx="33" cy="29" r="5" />
        <path d="M18 18l20-5" />
        <path d="M6 10l2 2M8 6v3M42 38l2 2M44 34v3" />
      </svg>
    </template>

    <p v-if="enviada" class="texto-seccion">
      ¡Gracias! Anotamos <strong>{{ enviadaCancion }}</strong> para la fiesta.
    </p>

    <form v-else class="formulario" @submit.prevent="enviar">
      <label class="campo">
        <span class="campo-etiqueta">Tu nombre completo</span>
        <input v-model="nombre" class="campo-entrada" type="text" autocomplete="name" placeholder="Ingresa tu nombre" required />
      </label>
      <label class="campo">
        <span class="campo-etiqueta">Canción y artista</span>
        <input v-model="cancion" class="campo-entrada" type="text" placeholder="Nombre de la canción y artista" required />
      </label>
      <label class="campo">
        <span class="campo-etiqueta">Enlace de YouTube (opcional)</span>
        <input v-model="enlace" class="campo-entrada" type="url" placeholder="https://youtube.com/…" />
      </label>

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" class="btn-verde" :disabled="enviando">
        {{ enviando ? "Enviando..." : "Sugerir canción" }}
      </button>
    </form>
  </TarjetaDetalle>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TarjetaDetalle from "@/components/TarjetaDetalle.vue";

const nombre = ref("");
const cancion = ref("");
const enlace = ref("");
const enviando = ref(false);
const enviada = ref(false);
const enviadaCancion = ref("");
const error = ref("");

async function enviar() {
  error.value = "";
  enviando.value = true;
  try {
    // Mismo servidor que la confirmación de asistencia (/api/rsvp)
    const respuesta = await fetch("/api/canciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: nombre.value.trim(),
        song: cancion.value.trim(),
        link: enlace.value.trim(),
      }),
    });
    if (!respuesta.ok) throw new Error("No se pudo guardar la canción.");
    enviadaCancion.value = cancion.value.trim();
    enviada.value = true;
  } catch {
    error.value = "No pudimos guardar tu canción. Por favor intenta nuevamente.";
  } finally {
    enviando.value = false;
  }
}
</script>

<style scoped>
.formulario {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.formulario .btn-verde {
  align-self: center;
}

.error {
  margin: 0;
  color: #9b3b26;
  font-size: 0.95rem;
}
</style>
