<template>
  <section id="inicio" class="hero-section">
    <!-- degradado oscuro para leer los textos sobre el video de fondo -->
    <div class="velo" aria-hidden="true"></div>

    <!-- pétalos que caen sobre el video -->
    <div class="petalos" aria-hidden="true">
      <span v-for="p in petalos" :key="p.id" class="petalo" :style="p.estilo"></span>
    </div>

    <!-- rosas colgando desde el borde superior -->
    <GuirnaldaFlores tipo="arriba" />

    <div class="hero-contenido">
      <p class="antetitulo">NOS CASAMOS</p>

      <h1 class="nombres">
        <span class="nombre">Andrea</span>
        <span class="amp">&amp;</span>
        <span class="nombre">Juan Carlos</span>
      </h1>
      <span class="filete" aria-hidden="true"></span>
      <p class="dia-boda">¡Nuestra Boda!</p>
      <p class="fecha">Te elijo hoy y por el resto de mi vida</p>
    </div>


    <a href="#fecha" class="indicador-scroll" aria-label="Desliza hacia abajo">
      <span class="texto-desliza">DESLIZA ABAJO</span>
      <svg
        class="flecha-saltarina"
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </a>
  </section>
</template>

<script setup lang="ts">
/* Pétalos con tamaño, posición y ritmo al azar */
const petalos = Array.from({ length: 14 }, (_, id) => ({
  id,
  estilo: {
    left: `${Math.random() * 100}%`,
    width: `${8 + Math.random() * 8}px`,
    animationDuration: `${9 + Math.random() * 8}s`,
    animationDelay: `${-Math.random() * 15}s`,
    "--deriva": `${Math.random() * 120 - 60}px`,
    "--giro": `${Math.random() * 540 - 270}deg`,
    opacity: 0.55 + Math.random() * 0.4,
  },
}));
</script>

<style scoped>
.hero-section {
  --oro: #ead5a6; /* dorado claro: se lee sobre el video */
  --oro-oscuro: #f5ead2;
  --tinta: #4d4b43;

  position: relative;
  width: 100%;
  height: 100vh;
  height: 100svh;
  min-height: 600px;
  max-height: 900px;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
  /* transparente: detrás se ve el video de fondo de la invitación */
  background: transparent;
}

/* Degradado: oscurece arriba y en el centro para leer los textos blancos */
.velo {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 70% 45% at 50% 55%, rgba(20, 16, 10, 0.35), rgba(20, 16, 10, 0) 70%),
    linear-gradient(180deg, rgba(20, 16, 10, 0.45) 0%, rgba(20, 16, 10, 0.1) 40%, rgba(20, 16, 10, 0.3) 100%);
}

/* PÉTALOS */
.petalos {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
}

.petalo {
  position: absolute;
  top: -20px;
  aspect-ratio: 1 / 1.3;
  border-radius: 80% 0 80% 0;
  background: radial-gradient(circle at 30% 30%, #fffdf8, #efe4d2 70%, #e0cfb4);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  animation: caerPetalo linear infinite;
}

@keyframes caerPetalo {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  100% {
    transform: translate(var(--deriva), 105vh) rotate(var(--giro));
  }
}

.hero-contenido {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 760px;
  /* deja sitio arriba para las rosas y abajo para el divisor y el indicador */
  padding: 110px 16px 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.antetitulo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 0 18px;
  font-family: "Cinzel", "Cormorant Garamond", serif;
  font-size: clamp(0.95rem, 2.2vw, 1.2rem);
  font-weight: 600;
  letter-spacing: 6px;
  white-space: nowrap;
  color: #fff;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.45);
  animation: aparecer 1s ease 0.2s both;
}

/* líneas doradas a los lados */
.antetitulo::before,
.antetitulo::after {
  content: "";
  width: clamp(24px, 6vw, 56px);
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--oro-oscuro));
}
.antetitulo::after {
  background: linear-gradient(90deg, var(--oro-oscuro), transparent);
}

/* TEXTOS */
.nombres {
  margin: 12px 0 0;
  font-family: "Great Vibes", cursive;
  font-weight: 400;
  font-size: clamp(3.6rem, 17vw, 4.6rem);
  line-height: 0.95;
  letter-spacing: 0;
  color: #fff;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
}

/* cada nombre se descubre de izquierda a derecha, como escrito a mano */
.nombre {
  display: block;
  padding: 0 0.2em;
  white-space: nowrap;
  animation: escribir 1.6s cubic-bezier(0.55, 0, 0.3, 1) 0.6s both;
}

.nombre:last-child {
  animation-delay: 1.5s;
}

.amp {
  display: block;
  margin: -0.12em 0 -0.08em;
  font-family: "Cormorant Garamond", serif;
  font-style: italic;
  font-size: 0.5em;
  color: var(--oro);
  animation: aparecer 0.8s ease 1.2s both;
}

/* filete dorado bajo los nombres */
.filete {
  display: block;
  width: 120px;
  height: 1px;
  margin: 14px auto 0;
  background: linear-gradient(90deg, transparent, var(--oro), transparent);
  animation: dibujar 1.1s ease 2.9s both;
}

.dia-boda {
  margin: 12px 0 0;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.8rem;
  font-weight: 500;
  line-height: 1;
  color: #fff;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
  animation: aparecer 1.1s ease 3.2s both;
}

.fecha {
  margin: 10px 0 0;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.05rem;
  font-style: italic;
  font-weight: 500;
  letter-spacing: 0.3px;
  color: #fff;
  text-shadow: 0 1px 10px rgba(0, 0, 0, 0.5);
  animation: aparecer 1.1s ease 3.5s both;
}

.indicador-scroll {
  position: absolute;
  bottom: 104px;
  left: 0;
  right: 0;
  width: fit-content;
  margin: 0 auto;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--oro-oscuro);
  text-decoration: none;
  animation: aparecer 1s ease 4.2s both;
}

.texto-desliza {
  font-family: "Cinzel", serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 3px;
}

.flecha-saltarina {
  animation: rebotar 1.8s infinite;
}

@keyframes escribir {
  from {
    clip-path: inset(0 100% 0 0);
    filter: blur(3px);
  }
  to {
    clip-path: inset(0 0 0 0);
    filter: blur(0);
  }
}

@keyframes dibujar {
  from {
    width: 0;
  }
  to {
    width: 120px;
  }
}

@keyframes aparecer {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rebotar {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
}

/* Sin animación si el usuario lo prefiere: se muestra directamente el final */
@media (prefers-reduced-motion: reduce) {
  .hero-section *,
  .hero-section *::before {
    animation: none !important;
  }
}

@media (max-height: 700px) {
  .indicador-scroll {
    display: none;
  }
  .hero-contenido {
    padding: 90px 16px 80px;
  }
}

@media (max-height: 640px) {
  .nombres {
    font-size: 3.2rem;
  }
}
</style>
