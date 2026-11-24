<template>
  <!--
    ENTRADA PERSONALIZADA (Premium): el portón del jardín cerrado, con un
    letrero colgante con el nombre del invitado (sale del enlace, ver
    src/invitado.ts). Al tocar, las puertas se abren desde el centro, la escena
    avanza hacia el jardín y aparecen "Abrir invitación" y "Guardar mi invitación".
    Las dos fotos (cerrado y abierto) tienen el mismo encuadre: la de las puertas
    cerradas se "corta" desde el centro con una máscara animada.
  -->
  <Transition name="salir">
    <div v-if="visible" class="entrada" role="dialog" aria-modal="true" aria-label="Entrada a la invitación">
      <div class="escenario" :class="{ abierta }">
        <div class="escena">
          <img class="foto" :src="jardin" alt="" />
          <img class="foto cerrada" :src="porton" alt="" />
        </div>

        <button v-if="!abierta" type="button" class="toque" aria-label="Abrir las puertas" @click="abrir"></button>

        <div class="letrero" :class="{ general: !invitado.nombre }" aria-hidden="true">
          <template v-if="invitado.nombre">
            <small>Te esperamos</small>
            <p class="nombre">{{ invitado.nombre }}</p>
            <p v-if="invitado.pases" class="pases">{{ textoPases }}</p>
          </template>
          <!-- sin nombre en el enlace: solo un saludo -->
          <p v-else class="nombre">Bienvenidos</p>
        </div>

        <p class="pista" aria-hidden="true">Toca para entrar</p>

        <div class="bienvenida">
          <p class="antes">{{ invitado.nombre ? "Bienvenidos a nuestra boda" : "Bienvenidos a la boda de" }}</p>
          <p class="nombre">{{ invitado.nombre || NOVIOS }}</p>
          <p v-if="invitado.pases" class="pases">{{ textoPases }}</p>
          <div class="acciones">
            <button type="button" class="boton principal" @click="entrar">Abrir invitación</button>
            <button type="button" class="boton secundario" :disabled="guardando" @click="guardar">
              {{ guardando ? "Preparando…" : "Guardar mi invitación" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import porton from "@/assets/images/entrada-porton.webp";
import jardin from "@/assets/images/entrada-jardin.webp";
import { invitado } from "@/invitado";

const NOVIOS = "Andrea & Juan Carlos";
const FECHA = "22 · 12 · 2026 · 6:00 p. m.";

const visible = ref(true);
const abierta = ref(false);
const guardando = ref(false);

const textoPases = computed(() =>
  invitado.pases === 1 ? "Reservamos 1 lugar para ti" : `Reservamos ${invitado.pases} lugares para ustedes`,
);

/* Mientras la entrada está a la vista, la invitación de atrás no se desplaza */
onMounted(() => document.documentElement.classList.add("con-entrada"));
onBeforeUnmount(() => document.documentElement.classList.remove("con-entrada"));

function abrir() {
  abierta.value = true;
  // el toque del invitado permite arrancar la música (los celulares la bloquean sin un toque)
  window.dispatchEvent(new CustomEvent("invitacion:musica"));
}

function entrar() {
  visible.value = false;
  document.documentElement.classList.remove("con-entrada");
  window.scrollTo(0, 0);
}

/* "Guardar mi invitación": arma una imagen vertical con el nombre y la comparte o descarga */
async function guardar() {
  guardando.value = true;
  try {
    const lienzo = await dibujarRecuerdo();
    const blob = await new Promise<Blob | null>((listo) => lienzo.toBlob(listo, "image/jpeg", 0.9));
    if (!blob) return;
    const nombreArchivo = `invitacion-boda-${(invitado.nombre || "andrea-y-juan-carlos")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}.jpg`;
    const archivo = new File([blob], nombreArchivo, { type: "image/jpeg" });
    if (navigator.canShare?.({ files: [archivo] })) {
      try {
        await navigator.share({ files: [archivo], title: "Mi invitación a la boda de Andrea & Juan Carlos" });
        return;
      } catch (e) {
        if ((e as DOMException).name === "AbortError") return; // el invitado cerró el menú
      }
    }
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = nombreArchivo;
    enlace.click();
    setTimeout(() => URL.revokeObjectURL(enlace.href), 4000);
  } finally {
    guardando.value = false;
  }
}

async function dibujarRecuerdo(): Promise<HTMLCanvasElement> {
  const A = 1080;
  const H = 1920;
  const lienzo = document.createElement("canvas");
  lienzo.width = A;
  lienzo.height = H;
  const c = lienzo.getContext("2d")!;

  await Promise.all([
    document.fonts.load('140px "Great Vibes"'),
    document.fonts.load('40px "Cinzel"'),
    document.fonts.load('italic 48px "Cormorant Garamond"'),
  ]).catch(() => {});

  // foto del jardín, recortada para llenar el formato vertical
  const foto = new Image();
  foto.src = jardin;
  await foto.decode();
  const escala = Math.max(A / foto.width, H / foto.height);
  const w = foto.width * escala;
  const h = foto.height * escala;
  c.drawImage(foto, (A - w) / 2, (H - h) / 2 - 120, w, h);

  // velo crema en la parte de abajo para el texto
  const velo = c.createLinearGradient(0, H * 0.42, 0, H);
  velo.addColorStop(0, "rgba(247,243,236,0)");
  velo.addColorStop(0.35, "rgba(247,243,236,0.9)");
  velo.addColorStop(1, "rgba(247,243,236,1)");
  c.fillStyle = velo;
  c.fillRect(0, H * 0.42, A, H * 0.58);

  // sin nombre del invitado el bloque de texto es más corto: se baja para centrarlo
  const baja = invitado.nombre ? 0 : 230;
  c.textAlign = "center";
  c.fillStyle = "#8a6d3b";
  c.font = '500 34px "Cinzel"';
  espaciado(c, "BIENVENIDOS A NUESTRA BODA", A / 2, 1290 + baja, 6);

  c.fillStyle = "#4d4b43";
  c.font = '96px "Great Vibes"';
  c.fillText(NOVIOS, A / 2, 1400 + baja);

  // el nombre del invitado solo va si el enlace lo trae
  if (invitado.nombre) {
    c.fillStyle = "#6b5a3a";
    c.font = 'italic 46px "Cormorant Garamond"';
    c.fillText("invitación para", A / 2, 1490);

    const oro = c.createLinearGradient(A * 0.2, 0, A * 0.8, 0);
    oro.addColorStop(0, "#a97b30");
    oro.addColorStop(0.45, "#d9b46a");
    oro.addColorStop(1, "#a97b30");
    c.fillStyle = oro;
    c.font = `${ajustarTamano(c, invitado.nombre, 132, A - 140)}px "Great Vibes"`;
    c.fillText(invitado.nombre, A / 2, 1630);
  }

  if (invitado.pases) {
    c.fillStyle = "#8a6d3b";
    c.font = '500 30px "Cinzel"';
    espaciado(c, `${invitado.pases} ${invitado.pases === 1 ? "PASE" : "PASES"}`, A / 2, 1720, 5);
  }

  c.fillStyle = "#4d4b43";
  c.font = '500 40px "Cormorant Garamond"';
  c.fillText(FECHA, A / 2, invitado.nombre ? 1810 : 1500 + baja);
  return lienzo;
}

/* texto en mayúsculas con espacio entre letras, centrado */
function espaciado(c: CanvasRenderingContext2D, texto: string, x: number, y: number, extra: number) {
  const ancho = [...texto].reduce((s, l) => s + c.measureText(l).width + extra, -extra);
  let cursor = x - ancho / 2;
  c.textAlign = "left";
  for (const letra of texto) {
    c.fillText(letra, cursor, y);
    cursor += c.measureText(letra).width + extra;
  }
  c.textAlign = "center";
}

/* reduce la letra si el nombre es muy largo */
function ajustarTamano(c: CanvasRenderingContext2D, texto: string, tamano: number, max: number) {
  c.font = `${tamano}px "Great Vibes"`;
  const ancho = c.measureText(texto).width;
  return ancho > max ? Math.floor((tamano * max) / ancho) : tamano;
}
</script>

<style scoped>
/* porcentaje animable para abrir las puertas desde el centro */
@property --abre {
  syntax: "<percentage>";
  inherits: true;
  initial-value: 0%;
}

.entrada {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  background: var(--fondo-mesa);
}

.escenario {
  position: relative;
  width: min(100%, 480px);
  height: 100%;
  overflow: hidden;
  background: var(--crema);
  container-type: inline-size;
}

.escena {
  position: absolute;
  inset: 0;
  transform-origin: 50% 58%;
  transition: scale 2.6s cubic-bezier(0.3, 0, 0.2, 1) 0.5s;
}

.abierta .escena {
  scale: 1.16;
}

.foto {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 30%;
}

/* puertas cerradas: una franja vacía crece desde la unión de las dos hojas */
.cerrada {
  --abre: 0%;
  -webkit-mask-image: linear-gradient(90deg, #000 calc(50.5% - var(--abre)), transparent calc(50.5% - var(--abre) + 4%), transparent calc(50.5% + var(--abre) - 4%), #000 calc(50.5% + var(--abre)));
  mask-image: linear-gradient(90deg, #000 calc(50.5% - var(--abre)), transparent calc(50.5% - var(--abre) + 4%), transparent calc(50.5% + var(--abre) - 4%), #000 calc(50.5% + var(--abre)));
  transition: --abre 1.6s cubic-bezier(0.55, 0, 0.25, 1) 0.35s, opacity 0.8s ease 1.5s;
}

.abierta .cerrada {
  --abre: 56%;
  opacity: 0;
}

.toque {
  position: absolute;
  inset: 0;
  z-index: 3;
  border: 0;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* letrero colgante con el nombre */
.letrero {
  position: absolute;
  z-index: 2;
  top: 31%;
  left: 50%;
  width: 66%;
  translate: -50% 0;
  padding: 7% 6% 6%;
  border-radius: 6px;
  background: var(--tarjeta);
  text-align: center;
  box-shadow: 0 18px 30px -14px rgba(40, 30, 10, 0.55);
  transform-origin: 50% -40%;
  animation: mecer 4.5s ease-in-out infinite;
  transition: opacity 0.5s ease, translate 0.9s cubic-bezier(0.5, 0, 0.75, 0);
}

.letrero::before,
.letrero::after {
  content: "";
  position: absolute;
  top: -40%;
  width: 1.5px;
  height: 42%;
  background: linear-gradient(var(--oro-claro), var(--oro));
}

.letrero::before {
  left: 20%;
  rotate: 18deg;
  transform-origin: bottom;
}

.letrero::after {
  right: 20%;
  rotate: -18deg;
  transform-origin: bottom;
}

.letrero small {
  display: block;
  font: 500 3.1cqw var(--fuente-mayus);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--oro);
}

.letrero .nombre {
  margin: 4% 0 2%;
  font: 10.5cqw/1.05 var(--fuente-cursiva);
  color: var(--titulo);
}

.letrero.general {
  padding: 9% 6% 8%;
}

.letrero.general .nombre {
  margin: 0;
  font-size: 13cqw;
}

.letrero .pases {
  font: italic 500 4.4cqw var(--fuente-texto);
  color: #8a6d3b;
}

.abierta .letrero {
  animation: none;
  opacity: 0;
  translate: -50% 70%;
}

@keyframes mecer {
  50% {
    rotate: 1.8deg;
  }
}

.pista {
  position: absolute;
  z-index: 2;
  left: 50%;
  bottom: 5%;
  translate: -50% 0;
  padding: 8px 18px;
  border-radius: 999px;
  background: rgba(253, 251, 247, 0.82);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  font: 500 3.3cqw var(--fuente-mayus);
  letter-spacing: 0.2em;
  color: var(--titulo);
  white-space: nowrap;
  animation: latir 2.2s ease-in-out infinite;
  transition: opacity 0.3s;
}

.abierta .pista {
  animation: none;
  opacity: 0;
}

@keyframes latir {
  50% {
    opacity: 0.55;
  }
}

/* bienvenida al abrir */
.bienvenida {
  position: absolute;
  z-index: 4;
  inset: auto 0 0;
  padding: 26cqw 7% 9%;
  text-align: center;
  background: linear-gradient(rgba(247, 243, 236, 0), rgba(247, 243, 236, 0.92) 30%, var(--crema));
  opacity: 0;
  translate: 0 30px;
  pointer-events: none;
  transition: opacity 0.9s ease 2s, translate 0.9s ease 2s;
}

.abierta .bienvenida {
  opacity: 1;
  translate: 0 0;
  pointer-events: auto;
}

.antes {
  font: 500 3.3cqw var(--fuente-mayus);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--oro);
}

.bienvenida .nombre {
  margin: 2% 0 1%;
  font: 12cqw/1.1 var(--fuente-cursiva);
  color: var(--titulo);
}

.bienvenida .pases {
  font: italic 500 4.6cqw var(--fuente-texto);
  color: #8a6d3b;
}

.acciones {
  display: grid;
  gap: 10px;
  justify-items: center;
  margin-top: 6%;
}

.boton {
  width: min(78%, 300px);
  padding: 13px 20px;
  border-radius: 999px;
  font: 600 1.05rem var(--fuente-texto);
  letter-spacing: 0.03em;
  cursor: pointer;
}

.principal {
  border: 0;
  background: var(--verde);
  color: #fff;
  box-shadow: 0 12px 24px -12px rgba(46, 70, 48, 0.8);
}

.secundario {
  border: 1px solid var(--oro-claro);
  background: rgba(253, 251, 247, 0.9);
  color: var(--titulo);
}

.boton:disabled {
  opacity: 0.7;
}

/* al entrar, la entrada se desvanece */
.salir-leave-active {
  transition: opacity 0.7s ease;
}

.salir-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .letrero,
  .pista {
    animation: none;
  }
  .escena,
  .cerrada {
    transition: opacity 0.6s ease;
  }
  .abierta .escena {
    scale: 1;
  }
  .bienvenida {
    transition-delay: 0.4s;
  }
}
</style>

<style>
/* sin desplazamiento mientras la entrada está a la vista */
html.con-entrada,
html.con-entrada body {
  overflow: hidden;
}
</style>
