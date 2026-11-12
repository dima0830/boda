<template>
  <Teleport to="body">
    <Transition name="ventana">
      <div v-if="abierta" class="fondo" @click.self="cerrar">
        <div
          ref="ventanaRef"
          class="ventana"
          role="dialog"
          aria-modal="true"
          :aria-label="titulo"
          tabindex="-1"
        >
          <!-- Ícono en un círculo que sobresale por arriba -->
          <div class="medallon" aria-hidden="true">
            <slot name="icono" />
          </div>

          <button type="button" class="cerrar" aria-label="Cerrar" @click="cerrar">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 7l10 10M17 7 7 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>

          <div class="marco">
            <h2 class="titulo">{{ titulo }}</h2>
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{
  abierta: boolean;
  titulo: string;
}>();

const emit = defineEmits<{ cerrar: [] }>();

const ventanaRef = ref<HTMLElement | null>(null);

function cerrar() {
  emit("cerrar");
}

function alPulsarTecla(e: KeyboardEvent) {
  if (e.key === "Escape") cerrar();
}

watch(
  () => props.abierta,
  async (abierta) => {
    if (abierta) {
      document.addEventListener("keydown", alPulsarTecla);
      document.body.style.overflow = "hidden";
      await nextTick();
      ventanaRef.value?.focus();
    } else {
      document.removeEventListener("keydown", alPulsarTecla);
      document.body.style.overflow = "";
    }
  },
);

onBeforeUnmount(() => {
  document.removeEventListener("keydown", alPulsarTecla);
  document.body.style.overflow = "";
});
</script>

<style scoped>
.fondo {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 18px 24px;
  background: rgba(40, 36, 28, 0.55);
  backdrop-filter: blur(3px);
  overflow-y: auto;
}

.ventana {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: auto;
  padding: 10px;
  border-radius: 6px;
  background: var(--tarjeta);
  box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.5);
  outline: none;
}

/* doble borde fino, como una tarjeta impresa */
.marco {
  padding: 46px 22px 26px;
  border: 1px solid var(--oro-claro);
  border-radius: 3px;
  text-align: center;
}

.medallon {
  position: absolute;
  top: -34px;
  left: 50%;
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: var(--tarjeta);
  box-shadow: 0 6px 14px -6px rgba(60, 50, 30, 0.45);
  color: var(--oro);
  transform: translateX(-50%);
}

.medallon :slotted(svg) {
  width: 34px;
  height: 34px;
}

.cerrar {
  position: absolute;
  top: 18px;
  right: 18px;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--verde);
  color: #fff;
  cursor: pointer;
}

.cerrar svg {
  width: 16px;
  height: 16px;
}

.titulo {
  margin: 0 0 14px;
  font-family: var(--fuente-titulo);
  font-size: 1.9rem;
  font-weight: 500;
  line-height: 1.1;
  color: var(--titulo);
}

/* animación de entrada */
.ventana-enter-active,
.ventana-leave-active {
  transition: opacity 0.25s ease;
}
.ventana-enter-active .ventana,
.ventana-leave-active .ventana {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.ventana-enter-from,
.ventana-leave-to {
  opacity: 0;
}
.ventana-enter-from .ventana,
.ventana-leave-to .ventana {
  transform: translateY(18px) scale(0.97);
}
</style>
