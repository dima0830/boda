/*
  ENVÍO DE FORMULARIOS (confirmación y canciones)

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
    // Texto plano para evitar la consulta previa (CORS) que Apps Script no responde
    const tipo = url.includes("cancion") ? "canciones" : "confirmaciones";
    const respuesta = await fetch(envio.hojaConfirmaciones, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ evento: envio.evento, tipo, ...(cuerpo as object) }),
    });
    const resultado = await respuesta.json().catch(() => null);
    if (!respuesta.ok || !resultado?.ok) throw new Error("No se pudo guardar en la hoja");
    return;
  }

  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuerpo),
  });
  if (!respuesta.ok) throw new Error(`El servidor respondió ${respuesta.status}`);
}
