<template>
  <TarjetaDetalle
    titulo="Regalos"
    resumen="Si quieres darnos algo más que tu hermosa presencia…"
  >
    <template #icono>
      <!-- Ícono de línea: caja de regalo -->
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="7" y="17" width="34" height="8" rx="1" />
        <path d="M10 25v17h28V25" />
        <path d="M24 17v25" />
        <path d="M24 17c-3-6-12-9-12-3 0 3 6 3 12 3z" />
        <path d="M24 17c3-6 12-9 12-3 0 3-6 3-12 3z" />
      </svg>
    </template>

    <p class="texto-seccion">
      Tu presencia es nuestro mejor regalo. Si deseas hacernos un obsequio,
      tendremos una <strong>lluvia de sobres</strong> el día de la celebración.
    </p>
    <p class="texto-seccion nota">Celebración solo para adultos.</p>
  </TarjetaDetalle>
</template>

<script setup lang="ts">
import TarjetaDetalle from "@/components/TarjetaDetalle.vue";
</script>

<style scoped>
.nota {
  margin-top: 12px;
  font-style: italic;
}
</style>
