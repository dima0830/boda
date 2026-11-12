<template>
  <!-- VER LA FECHA: tres círculos para raspar con el dedo (o el ratón) -->
  <section id="fecha" class="fecha-section panel">

    <div v-revelar class="seccion contenido">
      <h2 class="titulo-seccion">Ver la fecha</h2>
      <p class="antetitulo">{{ todosDescubiertos ? "¡Guarda la fecha!" : "Rasca los tres círculos para descubrir la fecha" }}</p>

      <div class="circulos">
        <div
          v-for="(item, i) in partes"
          :key="item.etiqueta"
          class="circulo"
          :class="['c' + i, { descubierto: descubiertos[i] }]"
        >
          <div class="valor">
            <span class="numero" :class="{ largo: item.valor.length > 4 }">{{ item.valor }}</span>
            <span class="etiqueta">{{ item.etiqueta }}</span>
          </div>
          <canvas
            v-if="!retirados[i]"
            :ref="(el) => (lienzos[i] = el as HTMLCanvasElement | null)"
            class="rasca"
            role="button"
            tabindex="0"
            :aria-label="`Raspar para descubrir el ${item.etiqueta.toLowerCase()}`"
            @pointerdown="empezar(i, $event)"
            @pointermove="mover(i, $event)"
            @pointerup="terminar(i)"
            @pointercancel="terminar(i)"
            @keydown.enter.prevent="descubrir(i)"
            @keydown.space.prevent="descubrir(i)"
          ></canvas>
        </div>
      </div>

      <!-- Confeti al descubrir los tres -->
      <div v-if="todosDescubiertos" class="confeti" aria-hidden="true">
        <span v-for="p in confeti" :key="p.id" class="pieza" :style="p.estilo"></span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

const partes = [
  { valor: "22", etiqueta: "Día" },
  { valor: "Diciembre", etiqueta: "Mes" },
  { valor: "2026", etiqueta: "Año" },
];

const PORCENTAJE_PARA_DESCUBRIR = 0.45;
const RADIO_PINCEL = 15;

const lienzos: (HTMLCanvasElement | null)[] = [];
const descubiertos = reactive([false, false, false]);
const retirados = reactive([false, false, false]);
const todosDescubiertos = computed(() => descubiertos.every(Boolean));

const rascando = ref<number | null>(null);
const ultimoPunto: ({ x: number; y: number } | null)[] = [null, null, null];

/* Piezas de confeti dorado y verde con posición y retardo al azar */
const colores = ["#b8955a", "#d8c29a", "#3e5b3f", "#e9dcc0", "#8fa58a"];
const confeti = Array.from({ length: 46 }, (_, id) => ({
  id,
  estilo: {
    left: `${Math.random() * 100}%`,
    background: colores[id % colores.length],
    animationDelay: `${Math.random() * 0.6}s`,
    animationDuration: `${2.2 + Math.random() * 1.6}s`,
    "--giro": `${Math.random() * 720 - 360}deg`,
    "--deriva": `${Math.random() * 80 - 40}px`,
    width: `${5 + Math.random() * 5}px`,
    height: `${8 + Math.random() * 6}px`,
  },
}));

function pintarCapa(lienzo: HTMLCanvasElement) {
  const tam = lienzo.clientWidth;
  const dpr = window.devicePixelRatio || 1;
  lienzo.width = tam * dpr;
  lienzo.height = tam * dpr;
  const ctx = lienzo.getContext("2d");
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  // capa perlada, como una tarjeta de raspar
  const brillo = ctx.createRadialGradient(tam * 0.35, tam * 0.3, 4, tam / 2, tam / 2, tam / 2);
  brillo.addColorStop(0, "#fbf8f2");
  brillo.addColorStop(0.6, "#ece5d8");
  brillo.addColorStop(1, "#d9cfbd");
  ctx.fillStyle = brillo;
  ctx.beginPath();
  ctx.arc(tam / 2, tam / 2, tam / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8d8472";
  ctx.font = `600 ${Math.round(tam * 0.12)}px Cinzel, serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("RASPE", tam / 2, tam / 2);
}

function puntoEn(lienzo: HTMLCanvasElement, e: PointerEvent) {
  const r = lienzo.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
}

function rascar(i: number, p: { x: number; y: number }) {
  const ctx = lienzos[i]?.getContext("2d");
  if (!ctx) return;
  ctx.globalCompositeOperation = "destination-out";
  ctx.lineCap = "round";
  ctx.lineWidth = RADIO_PINCEL * 2;
  const desde = ultimoPunto[i] ?? p;
  ctx.beginPath();
  ctx.moveTo(desde.x, desde.y);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  ultimoPunto[i] = p;
}

function porcentajeRascado(lienzo: HTMLCanvasElement) {
  const ctx = lienzo.getContext("2d");
  if (!ctx) return 0;
  const { data } = ctx.getImageData(0, 0, lienzo.width, lienzo.height);
  const centro = lienzo.width / 2;
  let total = 0;
  let borrado = 0;
  // muestrea un píxel de cada 6, solo dentro del círculo
  for (let y = 0; y < lienzo.height; y += 6) {
    for (let x = 0; x < lienzo.width; x += 6) {
      if ((x - centro) ** 2 + (y - centro) ** 2 > centro ** 2) continue;
      total++;
      if (data[(y * lienzo.width + x) * 4 + 3] < 128) borrado++;
    }
  }
  return total ? borrado / total : 0;
}

function empezar(i: number, e: PointerEvent) {
  if (descubiertos[i]) return;
  const lienzo = lienzos[i];
  if (!lienzo) return;
  lienzo.setPointerCapture(e.pointerId);
  rascando.value = i;
  ultimoPunto[i] = null;
  rascar(i, puntoEn(lienzo, e));
}

function mover(i: number, e: PointerEvent) {
  const lienzo = lienzos[i];
  if (rascando.value !== i || !lienzo) return;
  rascar(i, puntoEn(lienzo, e));
}

function terminar(i: number) {
  if (rascando.value !== i) return;
  rascando.value = null;
  ultimoPunto[i] = null;
  const lienzo = lienzos[i];
  if (lienzo && porcentajeRascado(lienzo) >= PORCENTAJE_PARA_DESCUBRIR) descubrir(i);
}

function descubrir(i: number) {
  if (descubiertos[i]) return;
  descubiertos[i] = true;
  // se desvanece lo que queda de la capa y luego se quita
  setTimeout(() => (retirados[i] = true), 600);
}

onMounted(async () => {
  // espera a la fuente Cinzel para escribir "RASPE" con ella
  await document.fonts?.ready;
  lienzos.forEach((l) => l && pintarCapa(l));
});
</script>

<style scoped>
.fecha-section {
  position: relative;
  overflow: hidden;
}

.contenido {
  padding-top: 100px;
  padding-bottom: 28px;
}

.circulos {
  display: grid;
  grid-template-columns: repeat(2, 108px);
  justify-content: center;
  gap: 14px 22px;
  margin-top: 10px;
}

/* el tercero, centrado debajo de los dos primeros (como en el video) */
.circulo.c2 {
  grid-column: 1 / -1;
  justify-self: center;
}

.circulo {
  position: relative;
  width: 108px;
  height: 108px;
  border-radius: 50%;
  background: var(--tarjeta);
  box-shadow:
    0 10px 22px -10px rgba(60, 50, 30, 0.4),
    inset 0 0 0 1px var(--linea);
}

.valor {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.numero {
  font-family: var(--fuente-titulo);
  font-size: 2.1rem;
  font-weight: 500;
  line-height: 1;
  color: var(--titulo);
}

.numero.largo {
  font-size: 1.25rem;
}

.etiqueta {
  margin-top: 4px;
  font-family: var(--fuente-mayus);
  font-size: 0.6rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--oro);
}

.descubierto .numero {
  animation: latido 0.6s ease;
}

.rasca {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  cursor: grab;
  /* el dedo raspa en vez de desplazar la página */
  touch-action: none;
  transition: opacity 0.6s ease;
}

.rasca:active {
  cursor: grabbing;
}

.rasca:focus-visible {
  outline: 2px solid var(--verde);
  outline-offset: 3px;
}

.descubierto .rasca {
  opacity: 0;
  pointer-events: none;
}

/* CONFETI */
.confeti {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.pieza {
  position: absolute;
  top: -12px;
  border-radius: 2px;
  opacity: 0;
  animation: caer linear forwards;
}

@keyframes caer {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg);
  }
  85% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(var(--deriva), 440px) rotate(var(--giro));
  }
}

@keyframes latido {
  50% {
    transform: scale(1.15);
  }
}

@media (prefers-reduced-motion: reduce) {
  .confeti {
    display: none;
  }
}
</style>
