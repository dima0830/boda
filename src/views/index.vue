<template>
  <main class="invitation-shell">
    <!-- Video fijo detrás de toda la invitación -->
    <VideoFondo />

    <!--
      Cada <GuirnaldaFlores tipo="divisor" /> queda montada sobre la unión de
      las dos secciones que separa (mitad encima de cada una).
    -->
    <div class="contenido-invitacion">
      <!-- Portada transparente: nombres sobre el video -->
      <InvitationHero />
      <GuirnaldaFlores tipo="divisor" />
      <!-- Ver la fecha (círculos para raspar) + Faltan + Celebración -->
      <InvitationIntro />
      <InvitationCelebration :event-date="eventDate" />
      <!-- Retratos de nuestro amor -->
      <InvitationMemories />
      <GuirnaldaFlores tipo="divisor" />
      <!-- Tarjetas con "Ver más": entre ellas se ve el video -->
      <div class="tarjetas">
        <InvitationMusica />
        <DressCodeSection />
        <InvitationDetails />
        <InvitationGifts />
      </div>
      <GuirnaldaFlores tipo="divisor" />
      <!-- Compartimos este día junto a ti -->
      <PhotoUpload />
      <!-- Claro entre secciones: se ve el video de fondo -->
      <GuirnaldaFlores tipo="divisor" />
      <div class="claro-video" aria-hidden="true"></div>
      <GuirnaldaFlores tipo="divisor" />
      <!-- Confirmación -->
      <InvitationForm />
      <GuirnaldaFlores tipo="divisor" />
      <!-- Cierre -->
      <InvitationFinal />
    </div>

    <!-- Botón flotante de música -->
    <InvitationAudio />
  </main>
</template>

<script setup lang="ts">
const eventDate = "2026-12-22T18:00:00-05:00";
</script>

<style scoped>
.contenido-invitacion {
  position: relative;
  z-index: 1;
}

.claro-video {
  height: 45vh;
  height: 45svh;
  min-height: 260px;
}

.tarjetas {
  padding: 40px 0;
}
</style>
