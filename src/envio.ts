/*
  ENVÍO DE FORMULARIOS (confirmación, canciones y fotos)

  - modoMuestra: true → tarjeta de demostración: no envía nada, solo muestra
    el mensaje de agradecimiento.
  - Plan Básica: las respuestas se guardan en la hoja de Google de Innube.
    "evento" es el nombre de la pestaña y "hojaConfirmaciones" la URL /exec
    del script (ver /home/dima/innube/confirmaciones).
  - Si hojaConfirmaciones está vacía, se usa el servidor propio (/api/...).
*/
export const envio = {
  modoMuestra: true,
  evento: "boda-andrea-juan-carlos",
  hojaConfirmaciones: "",
};

export async function enviarFormulario(url: string, cuerpo: unknown): Promise<void> {
  if (envio.modoMuestra) {
    await new Promise((listo) => setTimeout(listo, 900));
    return;
  }

  if (envio.hojaConfirmaciones) {
    await enviarAHoja(url, cuerpo);
    return;
  }

  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
  if (!respuesta.ok) throw new Error(`El servidor respondió ${respuesta.status}`);
}

/* Plan Básica: guarda en la hoja de Google de Innube (Apps Script).
   Texto plano para evitar la consulta previa (CORS) que Apps Script no responde. */
async function enviarAHoja(url: string, cuerpo: unknown): Promise<void> {
  const tipo = url.includes("foto") ? "fotos" : url.includes("cancion") ? "canciones" : "confirmaciones";
  const respuesta = await fetch(envio.hojaConfirmaciones, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ evento: envio.evento, tipo, ...(cuerpo as object) }),
  });
  const resultado = await respuesta.json().catch(() => null);
  if (!respuesta.ok || !resultado?.ok) throw new Error("No se pudo guardar en la hoja");
}

/* Fotos y videos de los invitados */
export async function enviarArchivos(url: string, datosFormulario: FormData): Promise<void> {
  if (envio.modoMuestra) {
    await new Promise((listo) => setTimeout(listo, 1400));
    return;
  }

  if (envio.hojaConfirmaciones) {
    await subirAHoja(datosFormulario);
    return;
  }

  const respuesta = await fetch(url, { method: "POST", body: datosFormulario });
  if (!respuesta.ok) throw new Error(`El servidor respondió ${respuesta.status}`);
}

/*
  FOTOS DE LOS INVITADOS A DRIVE (plan Básica)
  Cada archivo se envía por separado a la hoja de Google, que lo guarda en
  la carpeta del evento en Drive. Las fotos se reducen antes de subir
  (lado mayor de 2560 px, JPEG) para que suban rápido desde el celular.
  Apps Script recibe como máximo unos 50 MB por envío: los videos de más de
  35 MB se rechazan con un mensaje.
*/
const MAX_LADO = 2560;
const MAX_ARCHIVO = 35 * 1024 * 1024;

async function subirAHoja(formulario: FormData): Promise<void> {
  const archivos = [...formulario.values()].filter((v): v is File => v instanceof File);
  for (const archivo of archivos) {
    const preparado = await prepararArchivo(archivo);
    await enviarAHoja("/api/fotos", preparado);
  }
}

async function prepararArchivo(archivo: File) {
  if (archivo.type.startsWith("image/") && archivo.type !== "image/gif") {
    try {
      const reducido = await reducirFoto(archivo);
      return {
        nombreArchivo: archivo.name.replace(/\.[^.]+$/, "") + ".jpg",
        tipoArchivo: "image/jpeg",
        archivo: await aBase64(reducido),
      };
    } catch {
      // formato que el navegador no sabe dibujar (p. ej. HEIC fuera de Safari): se sube tal cual
    }
  }
  if (archivo.size > MAX_ARCHIVO) throw new Error("El archivo es demasiado pesado");
  return { nombreArchivo: archivo.name, tipoArchivo: archivo.type || "application/octet-stream", archivo: await aBase64(archivo) };
}

async function reducirFoto(archivo: File): Promise<Blob> {
  const imagen = await createImageBitmap(archivo);
  const escala = Math.min(1, MAX_LADO / Math.max(imagen.width, imagen.height));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(imagen.width * escala);
  lienzo.height = Math.round(imagen.height * escala);
  lienzo.getContext("2d")!.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
  imagen.close();
  return new Promise((listo, fallo) =>
    lienzo.toBlob((b) => (b ? listo(b) : fallo(new Error("No se pudo reducir"))), "image/jpeg", 0.85),
  );
}

function aBase64(blob: Blob): Promise<string> {
  return new Promise((listo, fallo) => {
    const lector = new FileReader();
    lector.onload = () => listo(String(lector.result).split(",")[1]);
    lector.onerror = () => fallo(lector.error);
    lector.readAsDataURL(blob);
  });
}
