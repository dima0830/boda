<template>
  <TarjetaDetalle titulo="Tips y Notas" resumen="Información adicional a considerar">
    <template #icono>
      <!-- Ícono de línea: portapapeles con visto -->
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="11" y="8" width="26" height="34" rx="3" />
        <path d="M18 8V5h12v3a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2z" />
        <path d="M18 26l4 4 8-9" />
      </svg>
    </template>

    <ul class="lista">
      <li>¡Por favor, sé puntual! La celebración empieza a las 6:00 p. m.</li>
      <li>Queremos que disfrutes la fiesta al máximo: es una celebración solo para adultos.</li>
      <li>Confirma tu asistencia lo antes posible para preparar todo con cariño.</li>
      <li>La finca tiene espacios al aire libre: lleva un abrigo ligero para la noche.</li>
      <li>¡Olvídate de todo y a disfrutar!</li>
    </ul>
  </TarjetaDetalle>
</template>

<script setup lang="ts">
import TarjetaDetalle from "@/components/TarjetaDetalle.vue";
</script>

<style scoped>
.lista {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 1.05rem;
  line-height: 1.4;
  color: var(--tinta);
}

.lista li + li {
  margin-top: 10px;
}

.lista li::before {
  content: "•";
  margin-right: 6px;
  color: var(--oro);
}
</style>
