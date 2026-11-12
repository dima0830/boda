"""Genera el primer fotograma para el video de Google Flow: fondo de portada +
pose final de la animación (las dos manos con el anillo puesto), en 1920x1080.
Uso: python3 scripts/fotograma-flow.py <salida.png>"""
import sys
from PIL import Image, ImageDraw, ImageFilter

IMG = "src/assets/images/"
W, H = 1920, 1080
RING = (800, 250)        # centro de la banda en la escena (igual que en componer-manos.py)
RING_W_PCT = 1.4         # mismo tamaño que --anillo-w
RING_ROT = 16            # PIL: positivo = antihorario (CSS rotate(-16deg))
ESCALA = 1.35            # tamaño de las manos respecto al lienzo de 1600 px

bg = Image.open(IMG + "principal.jpg").convert("RGBA")
s = max(W / bg.width, H / bg.height)
bg = bg.resize((round(bg.width * s), round(bg.height * s)), Image.LANCZOS)
bg = bg.crop(((bg.width - W) // 2, (bg.height - H) // 2, (bg.width - W) // 2 + W, (bg.height - H) // 2 + H))

# velo marfil como en la página
velo = Image.new("L", (W, H), 0)
ImageDraw.Draw(velo).ellipse([W * 0.2, H * 0.12, W * 0.8, H * 0.92], fill=150)
velo = velo.filter(ImageFilter.GaussianBlur(160))
bg = Image.composite(Image.new("RGBA", (W, H), (247, 243, 234, 255)), bg, velo)

escena = Image.new("RGBA", (1600, 900), (0, 0, 0, 0))
escena.alpha_composite(Image.open(IMG + "mano-mujer.webp").convert("RGBA"))
escena.alpha_composite(Image.open(IMG + "mano-hombre.webp").convert("RGBA"))
anillo = Image.open(IMG + "anillo.webp").convert("RGBA")
aw = 1600 * RING_W_PCT / 100
anillo = anillo.resize((round(aw), round(aw * anillo.height / anillo.width)), Image.LANCZOS)
pad = Image.new("RGBA", (anillo.width * 3, anillo.height * 2), (0, 0, 0, 0))
cy = round(anillo.height * 0.617)
pad.alpha_composite(anillo, (anillo.width, anillo.height - cy))   # centro de la banda en el centro de pad
pad = pad.rotate(RING_ROT, resample=Image.BICUBIC)
escena.alpha_composite(pad, (RING[0] - pad.width // 2, RING[1] - pad.height // 2))

escena = escena.resize((round(1600 * ESCALA), round(900 * ESCALA)), Image.LANCZOS)
x = (W - escena.width) // 2   # anillo centrado en el fotograma
y = round(H * 0.42 - RING[1] * ESCALA)
bg.alpha_composite(escena, (x, y))
bg.convert("RGB").save(sys.argv[1])
print("guardado", sys.argv[1])
