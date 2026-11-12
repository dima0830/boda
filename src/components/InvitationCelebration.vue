<template>
  <!-- FALTAN -->
  <section class="seccion faltan panel">
    <div v-revelar>
      <h2 class="titulo-seccion">Faltan</h2>
      <CountdownTimer :event-date="eventDate" />
    </div>
    <svg class="corazon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="currentColor"
      />
    </svg>
  </section>

  <GuirnaldaFlores tipo="divisor" />

  <!-- CELEBRACIÓN: tarjeta flotante sobre el video de fondo -->
  <section class="celebracion">

    <div v-revelar class="tarjeta tarjeta-evento">
      <!-- Ilustración: dos anillos dorados entrelazados -->
      <svg class="anillos" viewBox="0 0 120 80" aria-hidden="true">
        <defs>
          <linearGradient id="oro-anillo" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#f1dfae" />
            <stop offset="0.45" stop-color="#c9a45c" />
            <stop offset="1" stop-color="#8a6a2f" />
          </linearGradient>
        </defs>
        <ellipse cx="46" cy="46" rx="24" ry="22" fill="none" stroke="url(#oro-anillo)" stroke-width="6" />
        <ellipse cx="74" cy="46" rx="24" ry="22" fill="none" stroke="url(#oro-anillo)" stroke-width="6" />
        <!-- el primer anillo vuelve a pasar por delante para que se vean entrelazados -->
        <path d="M64.4 31.9A24 22 0 0 1 70 46" fill="none" stroke="url(#oro-anillo)" stroke-width="6" />
        <path d="M80 13l5-7 5 7-5 6z" fill="#fdfbf7" stroke="#c9a45c" stroke-width="1.5" stroke-linejoin="round" />
        <path d="M85 19v5" stroke="#c9a45c" stroke-width="2" />
      </svg>

      <h2 class="titulo-mayus">CELEBRACIÓN</h2>
      <span class="filete" aria-hidden="true"></span>
      <p class="mes">Diciembre</p>

      <div class="fila-fecha">
        <span class="lado">MARTES</span>
        <span class="dia">22</span>
        <span class="lado">6:00 PM</span>
      </div>
      <p class="anio">2026</p>

      <p class="lugar">Finca La Anaconda</p>

      <a :href="ubicacionUrl" target="_blank" rel="noopener noreferrer" class="btn-verde">
        ¿Cómo llegar?
      </a>
    </div>

  </section>

  <GuirnaldaFlores tipo="divisor" />
</template>

<script setup lang="ts">
import CountdownTimer from "@/components/CountdownTimer.vue";
import GuirnaldaFlores from "@/components/GuirnaldaFlores.vue";

defineProps<{
  eventDate: string;
}>();

const ubicacionUrl =
  "https://www.google.com/maps/place/FINCA+FUNDO+ANACONDA/@4.1217619,-73.453327,17z/data=!3m1!4b1!4m6!3m5!1s0x8e158700450d9e83:0xa1784734da66fe5f!8m2!3d4.1217619!4d-73.453327!16s%2Fg%2F11vj_cd68h!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D";
</script>

<style scoped>
.faltan {
  padding-top: 20px;
  padding-bottom: 100px;
}

.corazon {
  display: block;
  width: 26px;
  height: 26px;
  margin: 16px auto 0;
  color: var(--oro);
  animation: latir 2.2s ease-in-out infinite;
}

@keyframes latir {
  0%,
  100% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.18);
  }
  30% {
    transform: scale(1);
  }
  45% {
    transform: scale(1.12);
  }
}

/* Transparente: la tarjeta flota sobre el video de fondo */
.celebracion {
  position: relative;
  overflow: hidden;
}

.tarjeta-evento {
  z-index: 2;
  /* angosta y centrada: a los lados se ve el video de fondo */
  width: min(calc(100% - 48px), 300px);
  margin: 110px auto;
  padding-top: 22px;
}

.anillos {
  display: block;
  width: 110px;
  height: auto;
  margin: 0 auto 6px;
}

.filete {
  display: block;
  width: 70%;
  height: 1px;
  margin: 8px auto 10px;
  background: var(--linea);
}

.mes {
  margin: 0 0 6px;
  font-family: var(--fuente-mayus);
  font-size: 0.85rem;
  letter-spacing: 2px;
  color: var(--oro);
}

.fila-fecha {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 10px;
}

.lado {
  padding: 5px 0;
  border-block: 1px solid var(--oro-claro);
  font-family: var(--fuente-mayus);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1.2px;
  color: var(--titulo);
}

.dia {
  font-family: var(--fuente-titulo);
  font-size: 3.4rem;
  font-weight: 600;
  line-height: 1;
  color: var(--verde-oscuro);
}

.anio {
  margin: 2px 0 14px;
  font-family: var(--fuente-mayus);
  font-size: 0.8rem;
  letter-spacing: 2px;
  color: var(--titulo);
}

.lugar {
  margin: 0;
  font-size: 1.1rem;
  font-style: italic;
  color: var(--tinta);
}
</style>
