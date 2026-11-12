<template>
  <section class="fotos-section panel">
    <div v-revelar class="seccion">
      <h2 class="titulo-seccion">Compartimos este día junto a ti</h2>
      <p class="texto-seccion">Comparte tus fotos y videos de este hermoso día</p>

      <!-- Ícono de línea: fotos -->
      <svg class="icono-linea" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="6" y="12" width="30" height="26" rx="2" />
        <path d="M12 8h30v26" />
        <circle cx="15" cy="20" r="3" />
        <path d="M6 33l9-8 7 6 5-4 9 8" />
      </svg>

      <input
        ref="fileInputRef"
        type="file"
        accept="image/*,video/*"
        multiple
        class="input-oculto"
        @change="handleFileSelect"
      />

      <!-- VISTA PREVIA -->
      <div v-if="selectedFiles.length" class="preview-grid">
        <div v-for="(file, index) in selectedFiles" :key="file.preview" class="preview-item">
          <video v-if="file.file.type.startsWith('video/')" :src="file.preview" muted playsinline></video>
          <img v-else :src="file.preview" :alt="file.name" />
          <button type="button" class="btn-remove" :aria-label="`Quitar ${file.name}`" @click="removeFile(index)">✕</button>
        </div>
      </div>

      <div class="acciones">
        <button type="button" class="btn-verde" :disabled="isSubmitting" @click="triggerFileInput">
          {{ selectedFiles.length ? "Añadir más" : "Subir fotos" }}
        </button>
        <button v-if="selectedFiles.length" type="button" class="btn-verde" :disabled="isSubmitting" @click="enviarFotos">
          {{ isSubmitting ? "Enviando..." : `Enviar (${selectedFiles.length})` }}
        </button>
      </div>

      <p v-if="statusMessage" class="status-message" :class="statusType">{{ statusMessage }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

interface PreviewFile {
  file: File;
  name: string;
  preview: string;
}

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<PreviewFile[]>([]);
const isSubmitting = ref(false);
const statusMessage = ref("");
const statusType = ref<"success" | "error">("success");

function triggerFileInput() {
  fileInputRef.value?.click();
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;
  Array.from(target.files).forEach((file) => {
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      selectedFiles.value.push({
        file,
        name: file.name,
        preview: URL.createObjectURL(file),
      });
    }
  });
  target.value = "";
  statusMessage.value = "";
}

function removeFile(index: number) {
  URL.revokeObjectURL(selectedFiles.value[index].preview);
  selectedFiles.value.splice(index, 1);
}

async function enviarFotos() {
  if (!selectedFiles.value.length) return;

  isSubmitting.value = true;
  statusMessage.value = "";

  try {
    const formData = new FormData();
    selectedFiles.value.forEach((item, index) => {
      formData.append(`fotos[${index}]`, item.file);
    });

    // Simulación del envío al servidor (aún no hay backend para las fotos)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    statusType.value = "success";
    statusMessage.value = "¡Gracias por compartir tus recuerdos!";

    selectedFiles.value.forEach((item) => URL.revokeObjectURL(item.preview));
    selectedFiles.value = [];
  } catch {
    statusType.value = "error";
    statusMessage.value = "Error al subir las imágenes. Inténtalo de nuevo.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.fotos-section {
  overflow: hidden;
}

.fotos-section .seccion {
  padding-top: 100px;
  padding-bottom: 20px;
}

.input-oculto {
  display: none;
}

.acciones {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0 12px;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
  gap: 8px;
  max-width: 340px;
  margin: 6px auto 0;
}

.preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 3px 8px rgba(60, 50, 30, 0.2);
}

.preview-item img,
.preview-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(30, 30, 20, 0.65);
  color: #fff;
  font-size: 0.65rem;
  cursor: pointer;
}

.status-message {
  margin: 16px 0 0;
  font-size: 1.05rem;
  font-style: italic;
  color: var(--verde);
}

.status-message.error {
  color: #9b3b26;
}
</style>
