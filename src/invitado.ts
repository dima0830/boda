/*
  INVITADO DEL ENLACE (entrada personalizada de la Premium)

  Enlaces que entiende, igual que la invitación del IMA:
  - Amigable:  …/boda/?familia-rodríguez&pases=2   → "Familia Rodríguez", 2 pases
  - Libre:     …/boda/?para=Tía+Carmen&pases=1
  - Sin nombre (…/boda/): la entrada saluda de forma general y no muestra pases.
  "cupos" funciona igual que "pases".
*/

const MINUSCULAS = new Set(["de", "del", "la", "las", "los", "y", "e"]);

const limpiar = (v: string | null | undefined) => (v ?? "").replace(/\s+/g, " ").trim().slice(0, 40);

function bonito(texto: string): string {
  return texto
    .split(/[-+_.\s]+/)
    .filter(Boolean)
    .map((p, i) => {
      const min = p.toLocaleLowerCase("es");
      return i > 0 && MINUSCULAS.has(min) ? min : min.charAt(0).toLocaleUpperCase("es") + min.slice(1);
    })
    .join(" ");
}

function leer() {
  const crudo = location.search.slice(1);
  const partes = crudo ? crudo.split("&") : [];
  const q = new URLSearchParams(partes.filter((p) => p.includes("=")).join("&"));
  let slug = partes.find((p) => p && !p.includes("=")) ?? "";
  try {
    slug = decodeURIComponent(slug);
  } catch {
    /* se usa tal cual */
  }
  const nombre = limpiar(q.get("para")) || limpiar(bonito(slug));
  const pases = Number(q.get("pases") ?? q.get("cupos"));
  return { nombre, pases: Number.isInteger(pases) && pases > 0 && pases < 50 ? pases : 0 };
}

export const invitado = leer();
