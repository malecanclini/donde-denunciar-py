# Dónde Denunciar - Paraguay

Mapa interactivo para encontrar dónde denunciar **violencia contra la mujer** en Paraguay.

Una herramienta abierta basada en la **Ley 5777/16 de Protección Integral a las Mujeres contra toda forma de Violencia**, para que cualquier mujer encuentre rápido el lugar más cercano para pedir ayuda, denunciar o recibir atención.

Base construida con Claude, desarrollado con Google AI Studio.

🔗 **Demo:** https://donde-denunciar-paraguay.netlify.app/
📅 **Proyecto:** #30DayMapChallenge - Día 17: Light & Dark

---

## ¿Qué muestra?

**2.932 puntos en todo Paraguay, clasificados:**

- **13** Centros especializados de atención
- **1.179** Comisarías
- **1.740** Centros de salud / USF

## ¿Qué hice?

No solo georreferencié los datos. **Clasifiqué manualmente los puestos de salud y las comisarías** según su rol en la ruta de atención de la Ley 5777/16:

- **Comisarías:** Clasificadas para denuncia policial y derivación inmediata.
- **Centros de salud / USF:** Clasificados para atención médica, psicológica y contención.
- **Centros especializados:** Atención integral, legal y psicosocial.

Así, en una emergencia, la búsqueda no devuelve solo puntos sueltos, devuelve el tipo de ayuda correcta.

## Funcionalidades

- 🔍 Buscador por ciudad, barrio o centro
- 🗂️ Filtros por categoría: Legal, Salud / Psicológico, Policial, Albergue
- 🌓 Modo Claro / Oscuro - Versión Blanco y Negro (`?version=bw`)
- 🎨 Versión original a color
- 📱 Funciona en celular y computadora
- 📞 Acceso directo al **137 SOS Mujer - 24hs** y al **911**
- 📍 Geolocalización: "Encontrar lo más cercano a mí"

## Versiones

- **Original:** Mapa a color con categorías por color
- **Light & Dark:** Versión en blanco y negro, solo `#000000`, `#FFFFFF` y grises. Cambia con el botón Claro / Oscuro arriba a la derecha. Ideal para leer de día, de noche o con poca batería.

## Datos

Datos públicos del **INE - Instituto Nacional de Estadística, Paraguay**, curados, clasificados y georreferenciados para este mapa:

- Centros especializados
- Comisarías
- Centros de salud / USF

Total: **2.932 puntos**

## Cómo fue construido

- **Base inicial:** Prototipado con **Claude**
- **Desarrollo y ajustes:** Con **Google AI Studio**

La base del mapa, los filtros, los clusters y la versión Light & Dark se trabajaron con asistencia de IA y se curaron a mano para que los datos, la ubicación y la experiencia sean correctas para un uso real de emergencia.

## Tecnologías

- Leaflet / Supercluster para clusters
- OpenStreetMap (modo claro)
- Esri World Dark Gray (modo oscuro)
- Vite + TypeScript

## Cómo correrlo local

```bash
npm install
npm run dev
