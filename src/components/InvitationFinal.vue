<template>
  <section class="final-section panel">
    <div v-revelar class="seccion despedida">
      <p class="nombres">
        <span>Andrea</span>
        <span class="amp">&amp;</span>
        <span>Juan Carlos</span>
      </p>
      <span class="filete" aria-hidden="true"></span>
      <p class="los-esperamos">¡Los esperamos!</p>
    </div>

    <!-- rosas creciendo desde el borde inferior: cierran la invitación -->
    <GuirnaldaFlores tipo="abajo" />
  </section>
</template>

<style scoped>
.final-section {
  position: relative;
  overflow: hidden;
}

.despedida {
  padding-top: 100px;
  padding-bottom: 190px;
}

.nombres {
  display: flex;
  flex-direction: column;
  margin: 0;
  font-family: var(--fuente-cursiva);
  font-size: 3.2rem;
  line-height: 1;
  color: var(--titulo);
}

.amp {
  font-family: var(--fuente-titulo);
  font-size: 1.6rem;
  font-style: italic;
  color: var(--oro);
}

.filete {
  display: block;
  width: 110px;
  height: 1px;
  margin: 16px auto 12px;
  background: linear-gradient(90deg, transparent, var(--oro), transparent);
}

.los-esperamos {
  margin: 0;
  font-size: 1.4rem;
  font-style: italic;
  color: var(--tinta);
}
</style>
