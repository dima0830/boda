# Prompts de imágenes: invitación de boda

Novios: **Andrea Díaz & Juan Carlos Góngora**. Concepto: **Elegante clásico**, con tonos marfil, dorado champán y verde salvia, ilustración en acuarela fina con detalles en línea dorada y flores blancas con eucalipto.

Cada imagen nueva conserva **el mismo nombre de archivo y la misma proporción** que la actual. Así, al reemplazarla en `src/assets/images/`, la tarjeta sigue funcionando sin tocar código.

---

## 1. Guía de estilo común (pégala al final de CADA prompt)

```
STYLE: elegant classic wedding stationery, delicate watercolor illustration with fine
hand-drawn gold foil line accents, soft romantic botanical theme: white garden roses,
eucalyptus, olive branches, baby's breath. Color palette strictly limited to ivory
#F7F3EA, warm cream #EFE6D2, champagne gold #C9A45C, sage green #9CAF88, deep olive
#5E6B4E and a touch of blush #E8CFC4. Soft diffused natural light, airy, refined,
timeless, high-end paper texture feel, clean composition, no text unless specified.
```

**Negative prompt** (si tu herramienta lo admite):

```
cartoon, anime, 3d render, plastic, neon, saturated colors, dark fantasy, frogs,
crocodile, princess costume, harsh shadows, watermark, signature, blurry, extra
fingers, distorted faces, misspelled text, random letters
```

### Reglas para que todo se vea como una unidad
1. Usa **la misma herramienta y el mismo modelo** para todas las imágenes. En Midjourney, genera primero el **anillo** (#4) y reutilízalo como referencia de estilo con `--sref <url>`. En otras herramientas, adjúntalo como imagen de referencia.
2. Usa **siempre la misma paleta**, sin introducir colores nuevos.
3. **Iluminación:** luz suave desde arriba a la izquierda en todas las imágenes.
4. **Fondo transparente:** donde se indica PNG transparente, genera sobre fondo blanco liso y quítalo después con remove.bg o la herramienta de recorte de Canva o Photoshop.
5. **Texto:** no pidas texto a la IA, porque suele escribirlo mal. Los nombres y la fecha ya están como texto en el código.
6. **Fotos reales:** las fotos de los novios y del lugar no se generan. Solo se les aplica el mismo filtro cálido (ver sección 4).

---

## 2. Portada: animación del anillo

La portada ya no lleva sobre. Al cargar la página se reproduce una animación sola:
1. La mano de ella entra desde la derecha.
2. La mano de él llega desde la izquierda sosteniendo el anillo.
3. Él se lo pone en el dedo anular, aparece un destello dorado y su mano se retira.
4. Aparecen *"Nos casamos"*, **Andrea & Juan Carlos** y **22 · 12 · 2026**, escritos como texto, sin imagen.

Al tocar la escena, la animación se repite.

La animación usa **3 imágenes separadas** (capas). Ahora hay unas provisionales dibujadas; cuando descargues las reales, yo las coloco y ajusto el anillo al dedo.

### Estilo de las manos (añádelo a los 3 prompts, además del bloque STYLE)
```
HANDS STYLE: elegant semi-realistic illustration with a soft painterly finish, natural
anatomically correct hands with exactly five fingers, graceful relaxed pose, warm
golden-hour light from the upper left, soft shadows, matching a dreamy ivory and
champagne wedding background.
```
Tiene que encajar con el fondo `principal.jpg` (arco de rosas con luces doradas), que es más realista que acuarela.

### #1 `principal.jpg`, fondo de portada ✅ **Ya está puesto.**

### #2 `mano-mujer.png`, mano de ella ✅ **Ya está puesta.** (horizontal 4:3, por ejemplo 1600×1200, PNG transparente)
```
Elegant woman's left hand entering the frame from the right edge, side view, palm
facing down, fingers extended and gently relaxed pointing to the left, ring finger
slightly separated and bare (no ring), natural nude-blush manicure, delicate wrist with
an ivory lace bridal sleeve cuff at the right edge of the frame, the hand occupies the
right 60% of the image and is vertically centered, empty space on the left, isolated on
plain pure white background. [HANDS STYLE] [STYLE]
```

### #3 `mano-hombre.png`, mano de él ✅ **Ya está puesta.** (horizontal 4:3, mismo tamaño que la #2, PNG transparente)
```
Man's right hand entering the frame from the lower-left edge, side view, thumb and
index finger gently pinching together at the fingertips as if holding a tiny ring (the
fingertips are empty, no ring), other fingers softly curled, wearing a charcoal suit
sleeve with a crisp white shirt cuff and a small gold cufflink, the hand points
toward the upper right, the fingertips end near the center of the image, isolated on
plain pure white background. [HANDS STYLE] [STYLE]
```
Las dos manos deben parecer de la misma escena: misma luz, mismo ángulo de cámara y mismo tamaño aproximado. Genera la #3 usando la #2 como imagen de referencia.

### #4 `anillo.png`, anillo ✅ **Ya está puesto.** (cuadrado, por ejemplo 1024×1024, PNG transparente). **Genera este primero, es la referencia de estilo.**
```
A single engagement ring, polished champagne yellow gold thin band with one brilliant
round solitaire diamond, viewed exactly from the side as if worn on a horizontal finger
(the band appears as a tall narrow vertical oval, the diamond on top), soft sparkle on
the diamond, isolated on plain pure white background, centered, high detail. [STYLE]
```
Debe estar **de lado**: la banda se ve como un óvalo vertical, porque el dedo de ella está en horizontal.

### #5 `video-historia.mp4`: video de 12 segundos, "nuestra historia" (Google Flow)

Cuenta la historia de la pareja en 4 escenas de 3 segundos, desde que se conocen hasta que él le pide la mano. Termina con ella dándole la mano, que es justo donde empieza la animación del anillo.

#### Storyboard

| Tiempo | Escena | Qué pasa | Cámara | Transición |
|---|---|---|---|---|
| 0–3 s | **1. Se conocen.** Cafetería con librería, luz de tarde | Los dos alcanzan el mismo libro, sus manos se rozan, se miran y sonríen con timidez | Plano medio, acercamiento lento | Fundido de acuarela |
| 3–6 s | **2. Primera cita.** Calle de noche con guirnaldas de luces | Caminan juntos; ella se ríe y él le ofrece el brazo | Plano general, travelling lateral | Fundido de acuarela |
| 6–9 s | **3. Enamorados.** Jardín al atardecer | Bailan despacio; él la hace girar y caen pétalos | Plano medio, giro lento alrededor | Fundido de acuarela |
| 9–12 s | **4. La propuesta.** Arco de rosas blancas con luces doradas (el mismo de la portada) | Él se arrodilla y abre la cajita del anillo; ella se lleva la mano a la boca, asiente y le extiende la mano | Plano general que se acerca a las manos | Pasa a la animación del anillo |

Las transiciones las hago yo al unir los clips; no las pidas en Flow.

#### Paso 1: definir a la pareja (para que sean los mismos en todas las escenas)

Pega este bloque en **todos** los prompts. Cambia el cabello, la piel o la ropa para que se parezcan a ustedes.
```
COUPLE: a young Latin couple in their late twenties. She has long dark brown wavy
hair, warm light-brown skin, a soft cream knit sweater and a sage green midi skirt.
He has short dark hair, a neatly trimmed beard, warm tan skin, a white shirt with
rolled sleeves and charcoal trousers. Same faces, hair and outfits in every scene.
```
```
VIDEO STYLE: hand-painted watercolor animation with fine gold line accents, ivory,
champagne gold, sage green and blush palette, soft golden light, romantic and
dreamlike, painterly faces with gentle simple features, not photorealistic. One
continuous shot, no cuts, no text, no extra people in focus. Audio: none.
```

**Recomendado:** genera primero una **imagen de referencia de la pareja** (en Flow, generar imagen, 16:9):
```
Character reference sheet: [COUPLE] standing side by side, full body, front view,
smiling, on a plain ivory background. [VIDEO STYLE]
```
Súbela como **"Ingredients"** (ingredientes) en cada escena para que Flow mantenga sus caras y ropa. Si prefieres que se parezcan a ustedes de verdad, usa una foto suya como ingrediente.

#### Paso 2: las 4 escenas

Cada una en Flow como "Ingredients to Video" (o "Text to Video"), 16:9, 8 segundos. Yo uso solo los 3 primeros segundos, así que **lo importante debe pasar al principio**.

**Escena 1: se conocen**
```
In a cozy bookshop café with warm afternoon light, the woman and the man reach for the
same book on a shelf at the same moment, their hands gently touch, they turn, look at
each other and share a shy smile. Medium shot, slow push-in. [COUPLE] [VIDEO STYLE]
```

**Escena 2: primera cita**
```
At night on a charming cobblestone street with warm string lights overhead, the couple
walks side by side; she laughs at something he says and he gallantly offers his arm,
she takes it. Wide shot, slow lateral tracking alongside them. [COUPLE] [VIDEO STYLE]
```

**Escena 3: enamorados**
```
In a blooming garden at sunset, the couple slow dances; he gently spins her around and
white rose petals drift in the golden air, both smiling with their foreheads close.
Medium shot, slow orbit around them. [COUPLE] [VIDEO STYLE]
```

**Escena 4: la propuesta** (sube también `principal.jpg` como ingrediente, para que sea el mismo arco de la portada)
```
Under an arch of white roses with warm golden bokeh lights, the man kneels on one knee
and opens a small ivory ring box showing a gold solitaire engagement ring; the woman
covers her mouth with one hand, nods with joy and extends her left hand toward him.
The shot ends with a close view of her hand reaching toward his. Wide shot slowly
pushing in toward their hands. [COUPLE] [VIDEO STYLE]
```

**Consejos:**
- **Variantes:** genera 4 de cada escena y quédate con la que mantenga mejor a la pareja y el estilo de acuarela. Descarta las que salgan fotorrealistas o con manos raras.
- **Si una acción no pasa en los 3 primeros segundos,** añade al inicio del prompt *"Immediately at the start,"*.
- **Formato:** descarga en **MP4 1080p** como `escena-1.mp4` … `escena-4.mp4` en Descargas. Yo los recorto, los uno con fundidos de acuarela en un solo `video-historia.mp4` de 12 s y lo pongo en la portada.
- **Sonido:** se reproducirá sin sonido, porque los navegadores bloquean el autoplay con audio.

### Opción B (descartada): video completo de las manos en Google Flow

Flow usa Veo, que genera clips de 8 segundos. Escribe los prompts en inglés, porque Veo los sigue mejor.

**Paso 1: imagen inicial** (en Flow, generar imagen, formato 16:9). Así controlas cómo se ven las manos antes de animarlas.
```
Cinematic close-up photograph of a bride's left hand resting gently, palm down, fingers
relaxed, bare ring finger, natural nude-blush manicure, ivory lace bridal sleeve at the
wrist, entering from the right side of the frame. From the left side, the groom's right
hand in a charcoal suit sleeve with a crisp white shirt cuff approaches, holding a thin
champagne-gold solitaire engagement ring between thumb and index finger, just about to
slide it onto her ring finger. Hands placed in the upper-middle of the frame, the lower
third is soft blurred bokeh. Background: dreamy garden with white roses and eucalyptus,
warm golden fairy-light bokeh, ivory and champagne tones. Soft golden-hour light from the
upper left, shallow depth of field, 85mm lens, elegant, romantic, photorealistic,
anatomically correct hands with five fingers each, no faces, no text.
```

**Paso 2: video** (en Flow, "Frames to Video", con la imagen del paso 1 como primer fotograma).
```
The groom's hand slowly and tenderly slides the gold solitaire ring onto the bride's
ring finger, the ring settles at the base of her finger, then his fingers gently linger
on hers and softly withdraw to the left. The bride's hand stays still and relaxed. A
delicate sparkle glints on the diamond as the ring is placed. A few white rose petals
drift slowly through the frame. Camera: locked-off close-up with a very slow, subtle
push-in. Lighting: warm golden hour, soft glowing bokeh of fairy lights in the
background. Mood: intimate, romantic, elegant. Realistic natural hand movement, no
finger distortion, no faces, no text, no captions.
Audio: soft ambient garden sounds, a faint chime when the ring is placed, no music, no
dialogue.
```

**Si prefieres hacerlo solo con texto** ("Text to Video"), une los dos prompts: pega el del paso 1 y añade al final el del paso 2.

**Consejos para Flow:**
- **Variantes:** genera 4 y quédate con la que tenga las manos mejor formadas. Revisa los dedos cuadro a cuadro.
- **Final del video:** debe terminar con el anillo ya puesto y la mano de ella quieta. La página muestra los nombres y la fecha justo debajo cuando termina.
- **Calidad:** usa el modelo **Veo 3 Quality** si lo tienes y descarga en **1080p**.
- **Vertical:** si Flow te deja elegir **9:16**, genera también una versión vertical para el celular. Si no, yo recorto la horizontal.
- **Sonido:** el navegador reproduce el video **sin sonido** al cargar (los navegadores bloquean el autoplay con audio). La música la pone el reproductor de la página.

Cuando lo descargues en Descargas, cambio el código: el video se reproduce solo, al terminar se queda en el último fotograma y aparecen los nombres y la fecha.

### Imágenes que ya no usa la portada
`nombre-vale.png`, `date.png`, `sobre1.png`, `sobre2.png`, `sobre3.png`, `sello.png` y el video `videoH.mp4`. Ya no hace falta generarlas; los nombres y la fecha ahora son texto.

---

## 3. Elementos decorativos (los que más se repiten)

### #7 `mariposa.png`, mariposa grande (400×265, PNG transparente)
Las mariposas se mantienen como hilo conductor, pero rediseñadas.
```
Single elegant butterfly, wings open, watercolor in ivory and soft sage green with
delicate champagne gold foil veins and edges, slightly translucent wings, viewed from
above, isolated on plain white background. [STYLE]
```

### #8 `mariposa-.png`, mariposa pequeña de perfil (236×236, PNG transparente)
Se usa en 7 secciones, así que es la más importante para la coherencia.
```
Single small butterfly in side profile view, wings half closed, minimal watercolor in
sage green and ivory with fine champagne gold outline, simple and light, isolated on
plain white background. [STYLE]
```

### #9 `luci.png`, adorno izquierdo del reproductor de música (842×1506, vertical, PNG transparente)
Reemplaza a la luciérnaga.
```
Tall vertical botanical sprig: a long eucalyptus branch with two white garden roses and
small baby's breath, with tiny floating golden light sparkles around it, watercolor with
gold foil accents, isolated on plain white background. [STYLE]
```

### #10 `marco.png`, marco con foto de los novios (668×973, vertical, PNG transparente)
Paso 1: genera el marco vacío.
```
Ornate oval portrait frame, vertical, made of thin champagne gold filigree intertwined
with white roses and eucalyptus leaves at the top and bottom, the inside of the oval is
completely empty pure white, front view, isolated on plain white background. [STYLE]
```
Paso 2: en Canva o Photoshop, coloca **una foto real de los novios** dentro del óvalo y aplícale el filtro de la sección 4.

### #11 `tiana.png`, ilustración junto al texto de bienvenida (1344×2400, vertical, PNG transparente)
Reemplaza a la princesa por los novios.
```
Full-body watercolor illustration of a bride and groom seen from behind, walking hand in
hand, bride in a flowing ivory lace gown with long veil, groom in a classic charcoal
suit, faces not visible, soft loose watercolor edges, a few white rose petals falling,
isolated on plain white background, vertical composition. [STYLE]
```

---

## 4. Secciones interiores

### #12 `fondo.jpg`, fondo de la sección de fecha y calendario (736×1313, vertical)
```
Vertical stationery background: ivory textured cotton paper, soft watercolor eucalyptus
and olive leaves framing the top corners and bottom edge in sage green, faint gold
speckles, very light and airy, large empty center area for text, flat lay. [STYLE]
```

### #13 `back.jpg`, fondo general de la página (1248×832, horizontal)
```
Seamless subtle background texture: ivory and warm cream watercolor wash with very faint
sage green clouds and tiny scattered gold flecks, extremely soft and low contrast,
suitable behind text. [STYLE]
```

### #14 `sapo.png`, adorno del calendario y del código de vestimenta (729×624, PNG transparente)
Reemplaza a la rana por un par de anillos.
```
Two intertwined gold wedding rings resting on a small sprig of eucalyptus with a single
white rose bud, soft watercolor with gold foil shine, isolated on plain white
background. [STYLE]
```

### #15 `tabla.png`, letrero de la galería (662×354, horizontal, PNG transparente)
Reemplaza la tabla de madera.
```
Horizontal ivory card / place-card with deckled torn paper edges and a thin champagne
gold double border, small cluster of white roses and eucalyptus at the top-left and
bottom-right corners, center completely empty for text, isolated on plain white
background. [STYLE]
```
Cambia también el texto encima, en `InvitationMemories.vue`: por ejemplo, *"Nuestra historia de amor"*.

### #16 `pergamino.png`, recuadro del color reservado (731×540, horizontal, PNG transparente)
Mismo estilo que el #15, pero algo más alto:
```
Horizontal oval ivory cartouche label with a thin champagne gold filigree border and
tiny eucalyptus leaves on both sides, center empty for one word, isolated on plain white
background. [STYLE]
```

### #17 `traje.png`, icono de vestimenta (182×122, PNG transparente)
```
Minimal line-art icon of a men's suit jacket with bow tie next to an elegant long
evening gown, single continuous thin champagne gold line, no fill, isolated on plain
white background, flat vector style.
```
Las líneas deben ser finas y doradas, igual que los iconos #22 a #24.

### #18 `sapo1.png`, adorno superior derecho de Regalos (705×1488, vertical, PNG transparente)
Reemplaza a las ranas.
```
Tall hanging floral garland: white roses, eucalyptus and trailing greenery cascading
down vertically, watercolor with gold accents, isolated on plain white background.
[STYLE]
```

### #19 `cocodrilo.png`, adorno inferior izquierdo de Regalos (773×1073, vertical, PNG transparente)
Reemplaza al cocodrilo.
```
Elegant wrapped gift box in ivory paper tied with a champagne gold silk ribbon bow, a
small sprig of eucalyptus and a white rose tucked into the ribbon, a few floating gold
sparkles, watercolor, isolated on plain white background. [STYLE]
```

### #20 `sello-2.png`, sello "no niños" (492×511, PNG transparente)
```
Round vintage rubber-stamp style badge in champagne gold ink on transparent, thin double
circle border with a tiny olive branch at the bottom, center shows a minimal line icon of
a house with a small heart, slightly imperfect ink texture, isolated on plain white
background.
```
Añade en Canva el texto curvo: `CELEBRACIÓN SOLO PARA ADULTOS`.

### #21 `loto.png`, flor al final del formulario (1084×976, PNG transparente)
Reemplaza la flor de loto.
```
Small round bouquet of white garden roses, blush ranunculus and eucalyptus tied with a
champagne silk ribbon, front view, watercolor with gold foil accents, isolated on plain
white background. [STYLE]
```

### #22 a #24 `icon-1.png`, `icon-2.png`, `icon-3.png` (109×123, PNG transparente)
Ahora no se usan, pero quedan listos para Ceremonia, Recepción y Regalos. Mismo prompt, cambiando el objeto:
```
Minimal line-art icon of [a small chapel with a cross / two champagne glasses
toasting / a gift box with ribbon], single continuous thin champagne gold line, no
fill, isolated on plain white background, flat vector style.
```

### #25 `circulo.png`, corona floral (437×464, PNG transparente)
```
Thin champagne gold circle ring with an asymmetric cluster of white roses and eucalyptus
on the bottom-right and a smaller cluster on the top-left, center empty, isolated on
plain white background. [STYLE]
```

### #26 `papel.png` (1024×1024, PNG transparente)
Lo mismo que el #15, pero cuadrado.

### #27 `final.jpg`, banner final (1167×483, panorámico)
```
Panoramic cinematic image of a garden wedding reception at dusk: long table with ivory
linen, white roses and eucalyptus centerpieces, glowing candles and string lights,
soft bokeh, warm champagne tones, no people, no text. [STYLE]
```
Alternativa: una foto real de los novios con el filtro de abajo.

---

## 5. Fotos reales (no se generan, solo se unifica el color)

| Archivo | Qué poner |
|---|---|
| `gal1.jpg` … `gal14.jpg` (275×348, vertical 4:5) | Fotos de la pareja: noviazgo, pedida, viajes |
| `finca.jpg` (1280×960) | Foto del lugar de la recepción |
| Dentro de `marco.png` | Retrato principal de los novios |

**Filtro común** (Lightroom, Snapseed o Canva): temperatura **+15**, saturación **−20**, verdes desplazados hacia salvia, negros levantados **+10**, viñeta suave.

Para que la galería se vea uniforme, recórtalas todas a **4:5 vertical**.

---

## 6. Orden recomendado
1. #4 anillo: define el estilo y sirve de referencia.
2. #8 y #7 mariposas.
3. #2 y #3 manos de la portada.
4. #12 y #13 fondos.
5. Los demás adornos.
6. Fotos reales con el filtro.
