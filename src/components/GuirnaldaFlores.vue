<template>
  <!--
    GUIRNALDA DE ROSAS
    - divisor: va ENTRE dos secciones; no ocupa espacio y queda montada sobre la
      unión (mitad encima de cada una), así no se ve ninguna línea de corte.
    - arriba / abajo: pegada al borde superior o inferior de la sección que la
      contiene (esa sección necesita position: relative).
  -->
  <div v-if="tipo === 'divisor'" class="divisor" aria-hidden="true">
    <img :src="imagenes.divisor" alt="" class="flores" />
  </div>
  <img v-else :src="imagenes[tipo]" alt="" class="flores borde" :class="tipo" aria-hidden="true" />
</template>

<script setup lang="ts">
import divisor from "@/assets/images/guirnalda-divisor.webp";
import arriba from "@/assets/images/guirnalda-arriba.webp";
import abajo from "@/assets/images/guirnalda-abajo.webp";

defineProps<{
  tipo: "divisor" | "arriba" | "abajo";
}>();

const imagenes = { divisor, arriba, abajo };
</script>

<style scoped>
.flores {
  display: block;
  /* un poco más ancha que la invitación: las flores salen por los lados */
  width: max(108%, 520px);
  max-width: none;
  height: auto;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 6px 10px rgba(40, 32, 20, 0.18));
}

.divisor {
  position: relative;
  z-index: 5;
  height: 0;
}

.divisor .flores {
  position: absolute;
  top: 0;
  left: 50%;
  translate: -50% -50%;
  animation: mecer 9s ease-in-out infinite;
}

.borde {
  position: absolute;
  left: 50%;
  z-index: 3;
  translate: -50% 0;
  animation: mecer 10s ease-in-out infinite;
}

.borde.arriba {
  top: -2px;
  transform-origin: 50% 0;
}

.borde.abajo {
  bottom: -2px;
  transform-origin: 50% 100%;
  animation-direction: reverse;
}

/* se mecen muy suavemente, como movidas por la brisa */
@keyframes mecer {
  0%,
  100% {
    rotate: -0.4deg;
    scale: 1;
  }
  50% {
    rotate: 0.4deg;
    scale: 1.025;
  }
}

@media (prefers-reduced-motion: reduce) {
  .flores {
    animation: none !important;
  }
}
</style>
