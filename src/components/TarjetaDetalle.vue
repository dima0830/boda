<template>
  <!-- Tarjeta con título, ícono, resumen y botón "Ver más" que abre una ventana -->
  <section v-revelar class="detalle">
    <div class="tarjeta">
      <h2 class="titulo-seccion">{{ titulo }}</h2>
      <div class="icono-linea" :class="{ compacto: $slots.destacado }">
        <slot name="icono" />
      </div>
      <!-- Contenido destacado opcional (p. ej. un video), debajo del ícono -->
      <div v-if="$slots.destacado" class="destacado">
        <slot name="destacado" />
      </div>
      <p class="texto-seccion">{{ resumen }}</p>
      <button type="button" class="btn-verde" @click="abierta = true">
        {{ textoBoton }}
      </button>
    </div>

    <VentanaModal :abierta="abierta" :titulo="tituloVentana ?? titulo" @cerrar="abierta = false">
      <template #icono><slot name="icono" /></template>
      <slot :cerrar="() => (abierta = false)" />
    </VentanaModal>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VentanaModal from "@/components/VentanaModal.vue";

withDefaults(
  defineProps<{
    titulo: string;
    resumen: string;
    textoBoton?: string;
    tituloVentana?: string;
  }>(),
  { textoBoton: "Ver más", tituloVentana: undefined },
);

const abierta = ref(false);
</script>

<style scoped>
/* Cada tarjeta ocupa una pantalla y queda centrada en ella;
   el espacio de arriba y abajo deja ver el video entre tarjetas */
.detalle {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100svh;
  padding: 0 24px;
}

.tarjeta {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* angosta: a los lados se ve el video de fondo */
  width: min(100%, 300px);
  min-height: min(66vh, 560px);
  min-height: min(66svh, 560px);
  padding: 44px 22px;
  /* al terminar el scroll, la página se acomoda para dejarla en el centro */
  scroll-snap-align: center;
}

.tarjeta .titulo-seccion {
  font-size: 2.7rem;
}

.tarjeta .icono-linea {
  width: 62px;
  height: 62px;
  margin: 26px auto;
}

.tarjeta .texto-seccion {
  font-size: 1.2rem;
}

.tarjeta .btn-verde {
  margin-top: 30px;
}

.destacado {
  width: 100%;
  margin: 0 0 18px;
}

/* con contenido destacado, el ícono va más pequeño y pegado al título */
.tarjeta .icono-linea.compacto {
  width: 44px;
  height: 44px;
  margin: 16px auto 18px;
}

.icono-linea :slotted(svg) {
  width: 100%;
  height: 100%;
}
</style>
