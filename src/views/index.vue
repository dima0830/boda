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

.tarjetas {
  padding: 40px 0;
}
</style>
