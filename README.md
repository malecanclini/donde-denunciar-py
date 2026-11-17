# Donde Denunciar Paraguay

Mapa interactivo para encontrar dónde denunciar violencia contra la mujer en Paraguay.

Una herramienta abierta basada en la *Ley 5777/16 de Protección Integral a las Mujeres contra toda forma de Violencia*, para que cualquier mujer encuentre rápido el lugar más cercano para pedir ayuda, denunciar o recibir atención.

Base construida con Claude, desarrollado con Google AI Studio.

🔗 *Demo:* https://donde-denunciar-paraguay.netlify.app/
📅 *Proyecto:* #30DayMapChallenge - Día 17: Light & Dark

### ¿Qué muestra?

*2.932 puntos* en todo Paraguay, extraídos del sitio web del INE:

- *13* Centros especializados de atención
- *1.179* Comisarías
- *1.740* Centros de salud / USF

### ¿Qué hice?

Extraje los datos públicos del sitio web del INE - Instituto Nacional de Estadística de Paraguay, los limpié, los organicé y los clasifiqué según su rol en la ruta de atención de la Ley 5777/16:

- *Comisarías:* Para denuncia policial y derivación inmediata.
- *Centros de salud / USF:* Para atención médica, psicológica y contención.
- *Centros especializados:* Atención integral, legal y psicosocial.

Así, en una emergencia, la búsqueda no devuelve solo puntos sueltos, devuelve el tipo de ayuda correcta.

### Funcionalidades

🔍 Buscador por ciudad, barrio o centro
🗂️ Filtros por categoría: Legal, Salud / Psicológico, Policial, Albergue
🌓 Modo Claro / Oscuro - Versión Blanco y Negro (?version=bw)
🎨 Versión original a color
📱 Funciona en celular y computadora
📞 Acceso directo al 137 SOS Mujer - 24hs y al 911
📍 Geolocalización: "Encontrar lo más cercano a mí"

### Versiones

- *Original:* Mapa a color con categorías por color
- *Light & Dark:* Versión en blanco y negro, solo #000000, #FFFFFF y grises. Cambia con el botón Claro / Oscuro arriba a la derecha. Ideal para leer de día, de noche o con poca batería.

### Datos

Datos públicos del INE - Instituto Nacional de Estadística, Paraguay, extraídos de su sitio web, curados y organizados para este mapa:

- Centros especializados
- Comisarías
- Centros de salud / USF
- *Total: 2.932 puntos*

### Cómo fue construido

- *Base inicial:* Prototipado con Claude
- *Desarrollo y ajustes:* Con Google AI Studio

La base del mapa, los filtros, los clusters y la versión Light & Dark se trabajaron con asistencia de IA y se curaron para que los datos, la ubicación y la experiencia sean correctas para un uso real de emergencia.

### Tecnologías

- Leaflet / Supercluster para clusters
- OpenStreetMap (modo claro)
- Esri World Dark Gray (modo oscuro)
- Vite + TypeScript

### Cómo correrlo local
npm install
npm run dev


`## English Version`

# Where to Report Paraguay

Interactive map to find where to report violence against women in Paraguay.

An open tool based on *Law 5777/16 for the Comprehensive Protection of Women against all forms of Violence*, so any woman can quickly find the nearest place to ask for help, report, or receive care.

Base built with Claude, developed with Google AI Studio.

🔗 *Demo:* https://donde-denunciar-paraguay.netlify.app/
📅 *Project:* #30DayMapChallenge - Day 17: Light & Dark

### What does it show?

*2,932 points* across Paraguay, extracted from the INE website:

- *13* Specialized Care Centers
- *1,179* Police Stations
- *1,740* Health Centers / USF

### What did I do?

I extracted public data from the website of the INE - National Institute of Statistics of Paraguay, cleaned it, organized it, and classified it according to its role in the care route of Law 5777/16:

- *Police Stations:* For police reports and immediate referral.
- *Health Centers / USF:* For medical, psychological care and support.
- *Specialized Centers:* Comprehensive, legal and psychosocial care.

So in an emergency, the search doesn't just return random points, it returns the right type of help.

### Features

🔍 Search by city, neighborhood or center
🗂️ Filters by category: Legal, Health / Psychological, Police, Shelter
🌓 Light / Dark Mode - Black & White Version (?version=bw)
🎨 Original color version
📱 Works on mobile and desktop
📞 Direct access to 137 SOS Mujer - 24hs and 911
📍 Geolocation: "Find nearest to me"

### Versions

- *Original:* Color map with categories by color
- *Light & Dark:* Black and white version, only #000000, #FFFFFF and grays. Switch with the Light / Dark button on the top right. Ideal to read during the day, at night or with low battery.

### Data

Public data from INE - National Institute of Statistics, Paraguay, extracted from its website, curated and organized for this map:

- Specialized Centers
- Police Stations
- Health Centers / USF
- *Total: 2,932 points*

### How it was built

- *Initial base:* Prototyped with Claude
- *Development and adjustments:* With Google AI Studio

The map base, filters, clusters and Light & Dark version were built with AI assistance and curated so data, location and experience are correct for real emergency use.

### Technologies

- Leaflet / Supercluster for clusters
- OpenStreetMap (light mode)
- Esri World Dark Gray (dark mode)
- Vite + TypeScript

### How to run locally
npm install
npm run dev
---

