"""Compone las capas de la animación del anillo de la portada.
Lee mano1.png, mano-hombre.png y anillo.png (con fondo transparente) y genera
mano-mujer.webp, mano-hombre.webp y anillo.webp alineados en lienzos de 1600x900.
Uso: python3 scripts/componer-manos.py ~/Descargas src/assets/images <carpeta_vista_previa>
Si cambias RING_STAGE o RING_H, actualiza --anillo-x/--anillo-y/--anillo-w en InvitationHero.vue."""
import sys
from PIL import Image

SRC, OUT, PREV = sys.argv[1:4]
SW, SH = 1600, 900

# Puntos medidos en las imágenes originales
W_RING = (768, 425)      # base del dedo anular de ella, junto a los nudillos (mano1.png)
M_PINCH = (915, 360)     # hueco entre pulgar e índice de él (mano-hombre.png)
RING_STAGE = (800, 250)  # dónde queda el anillo en la escena
RING_H = 76              # alto del anillo en px de escena
RING_ROT = -16           # inclinación del dedo anular (grados, antihorario)
RING_ANCHOR_Y = 0.617    # centro de la banda dentro de anillo.png (sin el diamante)


def fade(im, side, px):
    """Difumina el canal alfa hacia un borde (bordes cortados de las mangas)."""
    a = im.getchannel("A")
    w, h = im.size
    mask = Image.new("L", im.size, 255)
    for i in range(px):
        v = int(255 * i / px)
        if side == "right":
            mask.paste(v, (w - 1 - i, 0, w - i, h))
        elif side == "left":
            mask.paste(v, (i, 0, i + 1, h))
        elif side == "bottom":
            mask.paste(v, (0, h - 1 - i, w, h - i))
    from PIL import ImageChops
    im.putalpha(ImageChops.multiply(a, mask))
    return im


def place(im, src_pt):
    canvas = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
    off = (RING_STAGE[0] - src_pt[0], RING_STAGE[1] - src_pt[1])
    canvas.alpha_composite(im, (max(off[0], 0), max(off[1], 0)),
                           (max(-off[0], 0), max(-off[1], 0)))
    return canvas, off


mujer = fade(Image.open(f"{SRC}/mano1.png").convert("RGBA"), "right", 160)
mujer_c, ow = place(mujer, W_RING)

hombre = Image.open(f"{SRC}/mano-hombre.png").convert("RGBA")
hombre = fade(hombre, "bottom", 170)
hombre_c, om = place(hombre, M_PINCH)
hombre_c = fade(hombre_c, "left", 280)  # la manga se desvanece antes del borde de la escena

anillo = Image.open(f"{SRC}/anillo.png").convert("RGBA")
anillo = anillo.crop(anillo.getchannel("A").point(lambda a: 255 if a > 20 else 0).getbbox())
anillo_web = anillo.resize((round(anillo.width * 320 / anillo.height), 320), Image.LANCZOS)

mujer_c.save(f"{OUT}/mano-mujer.webp", quality=88, method=6)
hombre_c.save(f"{OUT}/mano-hombre.webp", quality=88, method=6)
anillo_web.save(f"{OUT}/anillo.webp", quality=92, method=6)
print("offsets mujer", ow, "hombre", om, "anillo", anillo_web.size,
      "anillo-w %", round(100 * RING_H * anillo.width / anillo.height / SW, 3),
      "x %", round(100 * RING_STAGE[0] / SW, 3), "y %", round(100 * RING_STAGE[1] / SH, 3))

# Vistas previas: final (anillo puesto) y con la mano de él sosteniéndolo
r = anillo.resize((round(anillo.width * RING_H / anillo.height), RING_H), Image.LANCZOS)
r = r.rotate(-RING_ROT, expand=True, resample=Image.BICUBIC)  # PIL: ángulo positivo = antihorario; CSS: rotate(-13deg)
def put_ring(c):
    c.alpha_composite(r, (RING_STAGE[0] - r.width // 2, RING_STAGE[1] - round(r.height * RING_ANCHOR_Y)))
bg = Image.new("RGBA", (SW, SH), (239, 230, 210, 255))
f = bg.copy(); f.alpha_composite(mujer_c); put_ring(f); f.convert("RGB").save(f"{PREV}/prev_final.jpg")
g = bg.copy(); g.alpha_composite(mujer_c); g.alpha_composite(hombre_c); put_ring(g); g.convert("RGB").save(f"{PREV}/prev_puesta.jpg")
f.crop((780, 200, 1060, 420)).resize((840, 660)).convert("RGB").save(f"{PREV}/prev_zoom.jpg")
